const fs = require('fs');
const path = require('path');
const http = require('http');

const PROMPT_TEMPLATE_PATH = path.join(__dirname, '..', 'prompts', 'generate-prompt.txt');

const MAX_USERNAME_LENGTH = 24;
const MAX_USERNAME_COUNT = 20;

// Read the CCR API key from the key helper file at startup
// This avoids hardcoding keys while still using the credentials from the CCR profile
function loadCcrApiKey() {
  const keyHelperPath = process.env.CCR_REMOTE_SYNC_API_KEY_HELPER;
  if (!keyHelperPath) return null;

  // The key helper is a batch file that echoes the API key
  // Read the file contents and extract the key from the "echo" command
  try {
    const fs = require('fs');
    const content = fs.readFileSync(keyHelperPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('@echo'));
    for (const line of lines) {
      const match = line.trim().match(/^echo\s+(.+)$/i);
      if (match) return match[1].trim();
    }
  } catch (err) {
    // ignore
  }

  return null;
}

function loadPromptTemplate() {
  try {
    return fs.readFileSync(PROMPT_TEMPLATE_PATH, 'utf-8');
  } catch (err) {
    throw new Error('Prompt template not found');
  }
}

function buildPrompt(prompt) {
  const template = loadPromptTemplate();
  return template.replace('{user_prompt}', prompt);
}

function validateUsernames(raw) {
  if (!Array.isArray(raw)) {
    throw new Error('Expected an array of usernames');
  }

  const seen = new Set();
  const valid = [];

  for (const entry of raw) {
    if (typeof entry !== 'string') continue;

    const trimmed = entry.trim();
    if (trimmed.length === 0) continue;
    if (trimmed.length > MAX_USERNAME_LENGTH) continue;

    // Check for duplicates (case-insensitive)
    const lower = trimmed.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);

    // Reject prompt leakage / obvious non-username content
    if (trimmed.includes(' ')) continue;
    if (trimmed.includes('\n')) continue;
    if (trimmed.includes('\t')) continue;

    valid.push(trimmed);

    if (valid.length >= MAX_USERNAME_COUNT) break;
  }

  return valid;
}

async function generateUsernames(prompt) {
  const systemMessage = buildPrompt(prompt);

  // Get credentials from environment (CCR profile) — never hardcoded
  const gatewayKey = process.env.CCR_CORE_GATEWAY_AUTH_TOKEN;
  const apiKey = loadCcrApiKey();

  const requestBody = JSON.stringify({
    model: process.env.AI_MODEL || 'OpenRouter/cohere/north-mini-code:free',
    messages: [
      {
        role: 'system',
        content: systemMessage
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  // Use http module directly — Node's fetch has issues with CCR's localhost proxy
  // Parse the base URL from ANTHROPIC_BASE_URL env var
  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'http://127.0.0.1:3456';
  const url = new URL(baseUrl);

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: url.hostname,
      port: url.port || 3456,
      path: '/v1/chat/completions',
      method: 'POST',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'x-ccr-core-auth': gatewayKey,
        'User-Agent': 'curl/8.21.0',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`AI API error: ${res.statusCode} ${data}`));
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch (err) {
          reject(new Error('Failed to parse API response as JSON'));
          return;
        }

        // Extract the message content from OpenAI-compatible response
        let content;
        if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
          content = parsed.choices[0].message.content;
        } else if (parsed.message) {
          content = parsed.message.content;
        } else {
          reject(new Error('Unexpected API response format'));
          return;
        }

        if (!content || typeof content !== 'string') {
          reject(new Error('Empty response from AI'));
          return;
        }

        // Parse JSON — extract from code fences if present
        let jsonStr = content.trim();
        const codeFenceMatch = jsonStr.match(/^```(?:json)?\n([\s\S]*?)\n```$/);
        if (codeFenceMatch) {
          jsonStr = codeFenceMatch[1].trim();
        }

        let result;
        try {
          result = JSON.parse(jsonStr);
        } catch (err) {
          reject(new Error('Failed to parse AI response as JSON'));
          return;
        }

        const usernames = validateUsernames(result.usernames || []);

        if (usernames.length === 0) {
          reject(new Error('No valid usernames generated'));
          return;
        }

        resolve({ usernames });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request to AI API timed out'));
    });

    req.on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });

    req.write(requestBody);
    req.end();
  });
}

module.exports = {
  generateUsernames,
  validateUsernames,
  MAX_USERNAME_LENGTH,
  MAX_USERNAME_COUNT
};

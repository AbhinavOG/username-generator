// Username Studio — client-side logic

const form = null; // Not used in this design
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');

const emptyHint = document.getElementById('empty-hint');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const resultsSection = document.getElementById('results-section');
const usernameGrid = document.getElementById('username-grid');
const resultsCount = document.getElementById('results-count');
const generateAgainBtn = document.getElementById('generate-again-btn');
const retryBtn = document.getElementById('retry-btn');
const errorMessage = document.getElementById('error-message');

// Chips for quick prompts
const chips = document.querySelectorAll('.chip');

// Current prompt is stored to enable "Generate Again"
let currentPrompt = '';

// --- Theme Toggle ---
function initTheme() {
  const saved = localStorage.getItem('theme');
  const html = document.documentElement;

  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '🌙';
  } else {
    html.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '☀️';
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', toggleTheme);

// --- State Management ---
function showState(state) {
  if (state === 'empty') {
    emptyHint.classList.remove('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    resultsSection.classList.remove('visible');
  } else if (state === 'loading') {
    emptyHint.classList.add('hidden');
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    resultsSection.classList.remove('visible');
    generateBtn.disabled = true;
  } else if (state === 'success') {
    emptyHint.classList.add('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    resultsSection.classList.add('visible');
    generateBtn.disabled = false;
  } else if (state === 'error') {
    emptyHint.classList.add('hidden');
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
    resultsSection.classList.remove('visible');
    generateBtn.disabled = false;
  }
}

// --- Copy to clipboard ---
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied ✓';
    button.classList.add('copied');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    button.textContent = 'Copied ✓';
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  });
}

// --- Render usernames with staggered animation ---
function renderUsernames(usernames) {
  usernameGrid.innerHTML = '';
  resultsCount.textContent = `${usernames.length} suggestions`;

  usernames.forEach((name, index) => {
    const card = document.createElement('div');
    card.className = 'username-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const textSpan = document.createElement('span');
    textSpan.className = 'username-text';
    textSpan.textContent = name;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('aria-label', `Copy username ${name}`);
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', () => copyToClipboard(name, copyBtn));

    card.appendChild(textSpan);
    card.appendChild(copyBtn);
    usernameGrid.appendChild(card);
  });

  // Add stagger animation class
  const cards = usernameGrid.querySelectorAll('.username-card');
  cards.forEach((card, i) => {
    card.style.animation = `fadeInUp 0.4s ease ${i * 0.05}s both`;
  });
}

// --- Generate usernames ---
async function generateUsernames(prompt) {
  showState('loading');

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Something went wrong');
    }

    const data = await response.json();

    if (!data.usernames || data.usernames.length === 0) {
      throw new Error('No usernames were generated');
    }

    renderUsernames(data.usernames);
    showState('success');
  } catch (err) {
    errorMessage.textContent = err.message;
    showState('error');
  }
}

// --- Form submission ---
function handleGenerate() {
  const prompt = promptInput.value.trim();

  if (prompt.length === 0) {
    showState('empty');
    return;
  }

  currentPrompt = prompt;
  generateUsernames(prompt);
}

// Add click handler to generate button
generateBtn.addEventListener('click', handleGenerate);

// Also support Enter key in textarea
promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleGenerate();
  }
});

// --- Generate Again ---
generateAgainBtn.addEventListener('click', () => {
  if (currentPrompt) {
    promptInput.value = currentPrompt;
    generateUsernames(currentPrompt);
  }
});

// --- Retry after error ---
retryBtn.addEventListener('click', () => {
  if (currentPrompt) {
    generateUsernames(currentPrompt);
  }
});

// --- Chip click handlers ---
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    promptInput.value = chip.dataset.prompt;
    promptInput.dispatchEvent(new Event('input'));
  });
});

// --- Auto-resize textarea ---
promptInput.addEventListener('input', () => {
  promptInput.style.height = 'auto';
  promptInput.style.height = Math.max(50, promptInput.scrollHeight) + 'px';

  // Enable/disable generate button based on input
  generateBtn.disabled = promptInput.value.trim().length === 0;
});

// --- Initialize ---
initTheme();
showState('empty');

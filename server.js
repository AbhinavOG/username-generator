require('dotenv').config();

const express = require('express');
const path = require('path');
const { generateUsernames } = require('./lib/username-generator');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '1kb' }));

// API endpoint for username generation
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await generateUsernames(prompt.trim());
    res.json(result);
  } catch (err) {
    console.error('Generation error:', err.message);
    res.status(500).json({
      error: 'Failed to generate usernames. Please try again.'
    });
  }
});

// Fallback: serve index.html for routes that start with a known path pattern
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Username generator running on port ${PORT}`);
});

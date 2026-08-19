# Username Studio

A minimal, AI-powered username generator. Describe what you want and get relevant, memorable username ideas in seconds.

🌐 **Live Demo:** [https://username-studio.vercel.app](https://username-studio.vercel.app)

![Username Studio Preview](https://i.imgur.com/placeholder.png)

## What It Does

Struggling to come up with a good username? Just tell Username Studio what you need in plain English:

> "Professional GitHub username containing Alex, without numbers"

> "Gaming username with Shadow"

> "Short developer username, no underscores"

And get 20 curated suggestions instantly.

## Features

- **Natural language input** — Describe exactly what you want, no forms or dropdowns
- **Smart generation** — Respects your constraints (no numbers, specific words, style preferences)
- **One-click copy** — Copy any username instantly with "Copied ✓" feedback
- **Generate again** — Get a fresh batch using the same prompt with one click
- **Dark mode** — Premium dark-first design with light mode support
- **Responsive** — Works beautifully on mobile, tablet, and desktop
- **Privacy-first** — No accounts, no tracking, no saved history

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Backend**: Node.js + Express
- **AI**: Integrates with [Claude Code Router (CCR)](https://github.com/musistudio/claude-code-router) for secure API access

## Getting Started

### Prerequisites

- Node.js 18+
- CCR (claude-code-router) running locally

### Installation

```bash
git clone https://github.com/AbhinavOG/username-generator.git
cd username-generator
npm install
npm start
```

Open `http://localhost:3000` in your browser.

## Configuration

The app reads these environment variables (automatically available when running within CCR):

| Variable | Description | Default |
|----------|-------------|---------|
| `ANTHROPIC_BASE_URL` | CCR proxy URL | `http://127.0.0.1:3456` |
| `CCR_CORE_GATEWAY_AUTH_TOKEN` | CCR gateway auth token | _(from CCR)_ |
| `CCR_REMOTE_SYNC_API_KEY_HELPER` | Path to CCR key helper script | _(from CCR)_ |
| `AI_MODEL` | AI model to use | `OpenRouter/cohere/north-mini-code:free` |
| `PORT` | Server port | `3000` |

No API keys are hardcoded — all credentials are loaded at runtime.

## How It Works

1. User describes their desired username requirements
2. The backend forwards the request to CCR's gateway (not the frontend)
3. The AI generates 20 username suggestions as structured JSON
4. The backend validates the response (dedupes, filters invalid entries)
5. Results are displayed with one-click copy buttons

## API

`POST /api/generate`

```json
{
  "prompt": "Professional GitHub username containing Alex, no numbers"
}
```

Response:
```json
{
  "usernames": [
    "alexdev",
    "alexcoder",
    "alexlabs",
    "..."
  ]
}
```

## License

MIT

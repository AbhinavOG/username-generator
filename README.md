<div align="center">

<img src="Username-generator.png" width="120"/>

# Username Generator

**Describe what you want. Get usernames you'll actually use.**

[![Local Only](https://img.shields.io/badge/deploy-local-black?style=flat-square)&nbsp;
[![Node.js](https://img.shields.io/badge/runtime-node%2018+-339933?style=flat-square)&nbsp;
</div>

---

<br/>

## ✨ What It Does

Stuck on a username? Stop overthinking it.

Just type what you're after — the generator understands your intent and produces 20 clean, relevant suggestions instantly.

**Examples:**

> • *"Professional GitHub username containing Alex, no numbers"*
>
> • *"Gaming username with Shadow"*
>
> • *"Short developer username, no underscores"*

That's it. No forms. No dropdowns. Just ask in plain English.

<br/>

## 🚀 Quick Start

```bash
git clone https://github.com/AbhinavOG/username-generator.git
cd username-generator
npm install
npm start
```

Then open <http://localhost:3000> — that's it.

<br/>

---

<div align="center">

<img src="Username-generator.png" width="600" style="border-radius: 12px;"/>

</div>

<br/>

---

## 🎯 Features

<br/>

<div align="center">

| 🧠 **Smart** | Respects your constraints — "no numbers", specific words, style & more |
|:-----------:|:---------------------------------------------------------------|
| ⚡ **Fast** | 20 suggestions generated in seconds, not minutes |
| 📋 **One click** | Copy to clipboard with instant visual feedback |
| 🔁 **Regenerate** | Fresh batch with the same prompt — no retyping |
| 🌙 **Dark first** | Premium dark UI with optional light mode |
| 📱 **Responsive** | Looks great from phone to desktop |
| 🔒 **Privacy** | Local only. No accounts. No tracking. No API keys in the client. |

</div>

<br/>

---

## 🏗️ How It Works

```

                           ┌─────────────────┐
                           │   Your Prompt   │
                           └────────┬────────┘
                                    │
                                    ▼
┌──────────┐     ┌────────────┐    │    ┌──────────┐
│   CSS    │────▶│   Vanilla  │◀───┴───▶│  Node.js  │
│  Styles  │     │ JavaScript │         │  Express  │
└──────────┘     └──────┬─────┘         └─────┬─────┘
                         │                     │
                         ▼                     │
              ┌────────────────────┐            │
              │   Prompt Box UI    │            │
              │  • Type your need  │            │
              │  • Quick chips     │            │
              │  • Generate button │            │
              └────────┬───────────┘            │
                       │                        │
                       ▼                        │
              ┌────────────────────┐            │
              │ Loading Spinner   │            │
              └────────┬───────────┘            │
                       │                        │
                       ▼                        │
              ┌────────────────────┐    ┌───────┴─────────┐
              │    20 Username     │◀───┤  CCR API Call   │
              │    Suggestions     │    │  (secure)       │
              └────────┬───────────┘    └─────────────────┘
                       │
                       ▼
              ┌────────────────────┐
              │ Copy • Generate    │
              │      Again          │
              └────────────────────┘

```

<br/>

## 🛠️ Configuration

All credentials come from your environment — nothing hardcoded in the code.

| Variable | Description | Default |
|---|---|---|
| `ANTHROPIC_BASE_URL` | CCR proxy URL | `http://127.0.0.1:3456` |
| `CCR_CORE_GATEWAY_AUTH_TOKEN` | Gateway auth token | _(from CCR)_ |
| `CCR_REMOTE_SYNC_API_KEY_HELPER` | Path to key helper script | _(from CCR)_ |
| `AI_MODEL` | AI model name | `OpenRouter/cohere/north-mini-code:free` |
| `PORT` | Express server port | `3000` |

<br/>

---

## 📡 API

```http
POST /api/generate
Content-Type: application/json

{
  "prompt": "Professional GitHub username containing Alex, no numbers"
}
```

**Response:**

```json
{
  "usernames": [
    "alexdev",
    "alexcoder",
    "alexlabs",
    "alexstudio",
    "alexworks",
    "…"
  ]
}
```

<br/>

---

<div align="center">

Made with ❤️ using vanilla web tech

MIT License © 2025

</div>

# LLM Compare

A simple tool for comparing responses from different AI chats and manually assembling the final synthesis without APIs and local models.

## Features

### Two operating modes

- **Manual mode** — copy the prompt, paste responses from web chats manually
- **API mode** — automatic sending of requests to 10+ providers through a unified interface

### Supported API Providers

| Provider | Type | API Key |
|----------|------|---------|
| LM Studio | Local | Not required |
| Ollama | Local | Not required |
| Custom server | Local/Own | Optional |
| OpenAI | Cloud | `sk-...` |
| DeepSeek | Cloud | `sk-...` |
| Anthropic | Cloud | `sk-ant-...` (via proxy) |
| Google (Gemini) | Cloud | Google AI Studio |
| Groq Cloud | Cloud | `gsk_...` |
| Mistral AI | Cloud | Mistral Console |
| Hugging Face | Cloud | `hf_...` |
| OpenRouter | Cloud | `sk-or-...` |

API keys and selected models are saved **separately for each provider**. When switching providers, their saved settings are automatically applied — no need to re-enter the key.

### API Key Management

- **Import keys** — upload a `.txt` file with keys, all providers at once
- **Export keys** — download all saved keys as a `.txt` file
- **Delete all keys** — clear all saved keys with one click

Import file format (`PROVIDER - key`, order doesn't matter):
```
OPENAI - sk-your-key-here
GROQ - gsk_your-key-here
GOOGLE - AIzayour-key-here
ANTHROPIC - sk-ant-your-key-here
DEEPSEEK - sk-your-key-here
MISTRAL - your-key-here
HUGGING_FACE - hf_your-key-here
OPENROUTER - sk-or-your-key-here
```

### Workflow

1. **Request** — enter the initial task
2. **Enhancement** — refine the prompt via AI (manually or through API)
3. **Models** — send to different AI chats (manually or automatically via API)
4. **Synthesis** — aggregate the best parts of responses
5. **Result** — final text, comparison, and JSON export

### Interface

- `Copy and open...` buttons for quick navigation to web chats
- Fields for entering chat links directly at the "Models" step
- Individual system prompts for specific models
- Star rating of responses (1–5) considered in synthesis
- `Comparison` tab — side-by-side view of all responses
- `JSON` tab — structured export
- `Chat` tab — conversation history with AI when using API

### Settings and Management

- API key validation for cloud providers
- Import/export keys from `.txt` file
- Delete all keys with one click
- Edit model list
- Configure system prompts for enhancement and aggregation
- Ready-made request templates
- Light/dark theme switching
- Disable notifications

### History and Data

- Session history and continuation of started chats
- Local auto-save in browser
- Import and export history

## Ready-made Templates

- `Deep analysis`
- `Step-by-step plan`
- `Option comparison`
- `Code and debugging`
- `Brief summary`
- `Fact vs opinion`

## How to Run

### Option 1. Just open the file

Open [LLM_Compare.html](LLM_Compare.html) in a browser. Works for most providers (except Anthropic).

### Option 2. Via proxy server (recommended)

Runs both the app and proxy for CORS bypass. Without this, Anthropic API won't work from the browser.

```powershell
node proxy-server.js
```

Open: `http://localhost:3000`

The proxy also serves static files — no need to run `http.server` separately.

### Option 3. Via Python server (without Anthropic)

```powershell
py -m http.server 8000
```

Open: `http://localhost:8000/LLM_Compare.html`

## Browser Extensions

The project includes extensions for **Chrome** and **Firefox** with additional features:

- Fields for entering chat links directly at the "Models" step
- Automatic saving of chat URLs
- Local auto-save of data

### Installing the Extension

#### Chrome
1. Open `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in the top right corner)
3. Click **"Load unpacked extension"**
4. Select the `chrome-extension/` folder from the project

#### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on"**
3. Select the `firefox-extension/manifest.json` file

For details, see [chrome-extension/README.md](chrome-extension/README.md) and [firefox-extension/README.md](firefox-extension/README.md).

## API Provider Setup

### Local Providers (LM Studio / Ollama)

1. Launch LM Studio or Ollama on your computer
2. In settings, select the provider
3. Enter the server address (default `http://localhost:1234` for LM Studio, `http://localhost:11434` for Ollama)
4. Click `Check` to load the model list

### Cloud Providers (OpenAI, Google, Mistral, DeepSeek, Groq)

1. In settings, select the provider
2. Enter the API key
3. Click `Check Key` for validation
4. Select a model from the list

### Anthropic (requires proxy)

Anthropic API doesn't support direct requests from the browser (CORS). A proxy server is required.

1. Start the proxy: `node proxy-server.js`
2. Open `http://localhost:3000`
3. In settings, select "Anthropic" (server address is already set to `http://localhost:3000`)
4. Enter the API key from [console.anthropic.com](https://console.anthropic.com)
5. Click `Check Key`
6. Select a model from the list

### Hugging Face

1. Get a key at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. In settings, select "Hugging Face"
3. Paste the key (starts with `hf_`)
4. Click `Check Key`
5. Enter the model ID manually, e.g.: `meta-llama/Llama-3.3-70B-Instruct`

### OpenRouter

1. Get a key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. In settings, select "OpenRouter"
3. Paste the key (starts with `sk-or-`)
4. Click `Check Key`
5. Enter the model ID manually, e.g.: `anthropic/claude-3.5-sonnet`

> API keys are stored only in your browser and are tied to each provider separately.

## Quick Start with Key Import

If you already have API keys for multiple providers:

1. Create an `api-keys.txt` file in the format:
```
OPENAI - sk-your-key
GROQ - gsk_your-key
ANTHROPIC - sk-ant-your-key
```
2. In Settings → Providers, click "Import Keys (.txt)"
3. All keys will be loaded automatically
4. Switch between providers — keys will be applied automatically

## Switching Between Providers

When switching providers in settings:
- The API key and selected model are **saved** for the current provider
- For the new provider, its previously saved settings are **applied**
- Each provider stores its key, model, and server address independently

This allows quick switching between providers without re-entering keys.

## How to Use (Manual Mode)

1. At the `Request` step, enter the initial task
2. At the `Enhancement` step, copy the system prompt and prompt, send to AI chat, paste the result
3. At the `Models` step, use the navigation buttons to chats or send via API
4. Rate responses with stars
5. At the `Synthesis` step, get the aggregating prompt
6. At the `Result` step, check the final text, comparison, and JSON

## Settings

In `Settings`, you can access:
- **General** — application parameters
- **Models** — provider selection, API key, model list
- **Prompts** — system prompts for enhancement and aggregation
- **Templates** — ready-made request templates
- **Providers** — provider selection, import/export keys, API management
- **Log** — application operation log

## API Documentation

All providers use a format compatible with OpenAI API. Details on endpoints, parameters, and streaming — in [api-docs.html](api-docs.html).

## Project Structure

```
LLM_Compare/
├── LLM_Compare.html          # Main application interface
├── proxy-server.js           # Proxy server for CORS bypass (Anthropic) + static files
├── api-docs.html             # API provider documentation
├── README.md                 # Project description
├── .gitignore                # Git exclusions
├── chrome-extension/         # Chrome extension (MV3)
│   ├── manifest.json
│   ├── background.js
│   ├── LLM_Compare.html
│   ├── app.js
│   └── README.md
├── firefox-extension/        # Firefox extension (MV2)
│   ├── manifest.json
│   ├── background.js
│   ├── LLM_Compare.html
│   ├── app.js
│   └── README.md
└── standalone/               # Standalone version (if available)
```

## Technical Details

- Single HTML file, no build required
- For Anthropic API, `node proxy-server.js` is required (CORS bypass)
- Data is stored in browser `localStorage` (API keys are tied to providers)
- API requests go directly from the browser (CORS depends on the provider)
- Interface adapted for mobile devices and tablets
- Light and dark theme support
- Markdown rendering of responses via [marked.js](https://marked.js.org)
- Styling via [Tailwind CSS](https://tailwindcss.com) (CDN)

## Limitations

- Anthropic API requires a proxy server (`node proxy-server.js`)
- Some cloud APIs may block browser requests due to CORS
- Free provider tiers have request limits
- Some browsers restrict pop-up windows
- Data is lost when clearing browser localStorage

## Who Is This For

- Compare responses from different AI models in one place
- Build the best final response from multiple sources
- Work via API or manually — your choice
- Maintain session history and continue old chats
- Keep the entire workflow in one local file
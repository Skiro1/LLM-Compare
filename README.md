# LLM Compare

A simple tool for comparing responses from different AI chats and manually assembling a final synthesis without APIs or local models.

## Features

### Two Operating Modes

- **Manual Mode** — copy prompts, paste responses from web chats manually
- **API Mode** — automatic request submission to 10+ providers through a unified interface

### Supported API Providers

| Provider | Type | API Key |
|----------|------|---------|
| LM Studio | Local | Not required |
| Ollama | Local | Not required |
| Custom Server | Local/Custom | Optional |
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

- **Import Keys** — upload a `.txt` file with keys, all providers at once
- **Export Keys** — download all saved keys to a `.txt` file
- **Delete All Keys** — clear all saved keys with one click

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
2. **Improvement** — refine the prompt via AI (manually or via API)
3. **Models** — send to different AI chats (manually or automatically via API)
4. **Synthesis** — aggregate the best parts of responses
5. **Result** — final text, comparison and JSON export

### Interface

- `Copy and Open...` buttons for quick navigation to web chats
- Input fields for chat links directly on the "Models" step
- Individual system prompts for specific models
- Star rating for responses (1–5) with synthesis weighting
- `Comparison` tab — side-by-side view of all responses
- `JSON` tab — structured export
- `Chat` tab — API interaction history

### Settings and Controls

- API key verification for cloud providers
- Import/export keys from `.txt` file
- Delete all keys with one click
- Model list editing
- System prompt configuration for improvement and aggregation
- Ready-made request templates
- Light/dark theme switching
- Notification toggling

### History and Data

- Session history and continuation of started chats
- Local autosave in browser
- History import and export

## Ready-made Templates

- `Deep Analysis`
- `Step-by-Step Plan`
- `Variant Comparison`
- `Code & Debugging`
- `Brief Summary`
- `Fact vs Opinion`

## How to Run

### Option 1. Open File Directly

Open [LLM_Compare.html](LLM_Compare.html) in a browser. Works for most providers (except Anthropic).

### Option 2. Via Proxy Server (Recommended)

Starts both the app and a proxy to bypass CORS. Required for Anthropic API to work in the browser.

```powershell
node proxy-server.js
```

Open: `http://localhost:3000`

The proxy also serves static files — no need to run `http.server` separately.

### Option 3. Via Python Server (without Anthropic)

```powershell
py -m http.server 8000
```

Open: `http://localhost:8000/LLM_Compare.html`

## Browser Extensions

The project includes extensions for **Chrome** and **Firefox** with additional features:

- Input fields for chat links directly on the "Models" step
- Automatic chat URL saving
- Local data autosave

### Installing the Extension

#### Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension/` folder

#### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `firefox-extension/manifest.json` file

Details — see [chrome-extension/README.md](chrome-extension/README.md) and [firefox-extension/README.md](firefox-extension/README.md).

## API Provider Configuration

### Local Providers (LM Studio / Ollama)

1. Launch LM Studio or Ollama on your computer
2. Select the provider in settings
3. Specify the server address (default `http://localhost:1234` for LM Studio, `http://localhost:11434` for Ollama)
4. Click `Check` to load the model list

### Cloud Providers (OpenAI, Google, Mistral, DeepSeek, Groq)

1. Select the provider in settings
2. Enter the API key
3. Click `Check Key` to validate
4. Select a model from the list

### Anthropic (proxy required)

Anthropic API doesn't support direct browser requests (CORS). A proxy server is required.

1. Start the proxy: `node proxy-server.js`
2. Open `http://localhost:3000`
3. Select "Anthropic" in settings (server address is already set to `http://localhost:3000`)
4. Enter the API key from [console.anthropic.com](https://console.anthropic.com)
5. Click `Check Key`
6. Select a model from the list

### Hugging Face

1. Get a key at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Select "Hugging Face" in settings
3. Paste the key (starts with `hf_`)
4. Click `Check Key`
5. Specify the model ID manually, e.g.: `meta-llama/Llama-3.3-70B-Instruct`

### OpenRouter

1. Get a key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Select "OpenRouter" in settings
3. Paste the key (starts with `sk-or-`)
4. Click `Check Key`
5. Specify the model ID manually, e.g.: `anthropic/claude-3.5-sonnet`

> API keys are stored only in your browser and are tied to each provider separately.

## Quick Start with Keys Import

If you already have API keys for multiple providers:

1. Create a file `api-keys.txt` in the following format:
```
OPENAI - sk-your-key
GROQ - gsk_your-key
ANTHROPIC - sk-ant-your-key
```
2. In Settings → Providers, click "Import Keys (.txt)"
3. All keys will load automatically
4. Switch between providers — keys will apply automatically

## Switching Between Providers

When switching providers in settings:
- API key and selected model are **saved** for the current provider
- Previously saved settings are **applied** for the new provider
- Each provider stores its key, model, and server address independently

This allows quick switching between providers without re-entering keys.

## How to Use (Manual Mode)

1. At the `Request` step, enter the initial task
2. At the `Improvement` step, copy the system prompt and prompt, send to an AI chat, paste the result
3. At the `Models` step, use the navigation buttons to go to chats or send via API
4. Rate responses with stars
5. At the `Synthesis` step, get the aggregating prompt
6. At the `Result` step, review the final text, comparison and JSON

## Settings

Available in `Settings`:
- **General** — application parameters
- **Models** — provider selection, API key, model list
- **Prompts** — system prompts for improvement and aggregation
- **Templates** — ready-made request templates
- **Providers** — provider selection, key import/export, API management
- **Log** — application activity log

## API Documentation

All providers use a format compatible with OpenAI API. Details on endpoints, parameters and streaming — see [api-docs.html](api-docs.html).

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
└── standalone/               # Standalone version (if exists)
```

## Technical Details

- Single HTML file, no build required
- Anthropic API requires `node proxy-server.js` (CORS bypass)
- Data stored in browser `localStorage` (API keys tied to provider)
- API requests sent directly from browser (CORS depends on provider)
- Interface adapted for mobile devices and tablets
- Light and dark theme support
- Markdown rendering via [marked.js](https://marked.js.org)
- Styled with [Tailwind CSS](https://tailwindcss.com) (CDN)

## Limitations

- Anthropic API requires proxy server (`node proxy-server.js`)
- Some cloud APIs may block browser requests due to CORS
- Free provider tiers have request limits
- Some browsers restrict pop-up windows
- Data is lost when clearing browser localStorage

## Who Is This For

- Compare responses from different AI models in one place
- Assemble the best final response from multiple sources
- Work via API or manually — your choice
- Maintain session history and continue old chats
- Keep the entire workflow in one local file

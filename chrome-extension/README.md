# LLM Compare — Chrome Extension

Chrome Extension (Manifest V3) for the LLM Compare application.

## Features

- Enter chat URLs directly at the "Models" stage
- Automatic saving of chat URLs
- Local auto-save of data in `localStorage`
- **API retry with backoff** — requests auto-retry on failure (1s → 2s → 4s)
- **Textarea auto-resize** — textareas expand to content height automatically

## Installation

1. Open `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top right corner)
3. Click **Load unpacked**
4. Select the `chrome-extension/` folder from the project

## Structure

```
chrome-extension/
├── manifest.json       # Extension manifest (MV3)
├── background.js       # Service worker
├── popup.html          # Extension popup
├── LLM_Compare.html    # Main interface
├── app.js              # Application logic
└── icons/              # Extension icons
```

## Technical Details

- Manifest V3
- Service worker in `background.js`
- Data stored in browser `localStorage`
- No build required

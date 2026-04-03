# LLM Compare — Chrome Extension

Chrome extension (Manifest V3) for the LLM Compare application.

## Features

- Fields for entering chat links directly at the "Models" step
- Automatic saving of chat URLs
- Local auto-save of data in `localStorage`

## Installation

1. Open `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in the top right corner)
3. Click **"Load unpacked extension"**
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
- Data is stored in browser `localStorage`
- No build required
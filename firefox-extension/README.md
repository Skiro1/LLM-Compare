# LLM Compare — Firefox Extension

Firefox extension (Manifest V2) for the LLM Compare application.

## Features

- Fields for entering chat links directly at the "Models" step
- Automatic saving of chat URLs
- Local auto-save of data in `localStorage`

## Installation

1. Open `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on…"**
3. Select the `manifest.json` file from the `firefox-extension/` folder

> Temporary add-ons are removed when the browser is closed. For permanent installation, package the extension as `.xpi` or publish on AMO.

## Structure

```
firefox-extension/
├── manifest.json       # Extension manifest (MV2)
├── background.js       # Background script
├── popup.html          # Extension popup
├── LLM_Compare.html    # Main interface
├── app.js              # Application logic
└── icons/              # Extension icons
```

## Technical Details

- Manifest V2
- Background script in `background.js`
- Data is stored in browser `localStorage`
- No build required
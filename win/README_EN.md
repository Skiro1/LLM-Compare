# LLM Compare — Windows Desktop App

> Desktop version of LLM Compare for Windows (NSIS installer + portable)

## Structure

```
win/
├── package.json          # Electron + electron-builder config
├── main.js               # Electron main process (opens links in external browser)
├── preload.js            # Preload script (contextBridge)
├── .gitignore            # dist/, node_modules/
├── build-en.bat          # English version build script
├── build-ru.bat          # Russian version build script
└── README_EN.md          # This file
```

The `resources/app/` folder is created automatically during build.

## Quick Start

### 1. Install dependencies

```powershell
cd win
npm install
```

### 2. Copy project files

**English version:**
```powershell
# Or run build-en.bat as Administrator:
mkdir resources\app
copy ..\index.html resources\app\
xcopy ..\css resources\app\css\ /E
xcopy ..\js resources\app\js\ /E
copy ..\proxy-server.js resources\app\
```

**Russian version:**
```powershell
# Or run build-ru.bat as Administrator:
mkdir resources\app
copy ..\ru\index.html resources\app\
xcopy ..\ru\css resources\app\css\ /E
xcopy ..\ru\js resources\app\js\ /E
copy ..\proxy-server.js resources\app\
```

### 3. Run in development mode

```powershell
npm start
```

### 4. Build the installer

```powershell
npm run build:win
```

Output will be in `dist/`:
- `LLM Compare Setup 1.2.0.exe` — NSIS installer
- `LLM Compare 1.2.0.exe` — portable version

> ⚠️ Run scripts **as Administrator** to avoid symbolic link errors.

---

## What the build script does

1. **Creates `resources/app/`** — folder with application files
2. **Copies project files** — index.html, css/, js/, proxy-server.js
3. **Installs dependencies** — electron, electron-builder
4. **Builds installer** — electron-builder creates .exe in `dist/`

---

## Custom icon

By default, Electron's standard icon is used. To replace:

1. Create a `.png` icon (512×512 recommended)
2. Place it in `resources/icon.png`
3. electron-builder will automatically convert to `.ico`

---

## electron-builder configuration

The `build` section in `package.json`:

```json
{
  "build": {
    "appId": "com.skiro1.llm-compare",
    "productName": "LLM Compare",
    "win": {
      "target": ["portable"]
    }
  }
}
```

### Options:

| Parameter | Description |
|---|---|
| `appId` | Unique application identifier |
| `productName` | Name in the installer |
| `win.target` | `portable`, `nsis` (installer), `zip` |

---

## Requirements

- **Node.js** 18+
- **Windows** 10/11
- **npm** 9+

---

## Electron Architecture

```
┌─────────────────────────────────┐
│         Main Process            │
│         (main.js)               │
│  - Creates window               │
│  - Loads index.html             │
│  - Opens external links         │
│    in the system browser        │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│       Renderer Process          │
│       (index.html + JS)         │
│  - Entire application UI        │
│  - marked.js (CDN)              │
│  - Tailwind CSS (CDN)           │
└─────────────────────────────────┘
```

### Why do external links open in the browser?

Google and other services block Electron. All links (Google login, web chats, OAuth) automatically open in the user's default browser — Chrome, Firefox, Edge, etc.

---

## Troubleshooting

### "Cannot find module" error
```powershell
npm install
```

### Application doesn't start
Check that `resources/app/index.html` exists:
```powershell
dir resources\app\
```

### Build error
Delete `node_modules` and `dist`, then start over:
```powershell
rmdir /s /q node_modules dist
npm install
npm run build:win
```

### Symbolic link error
Run the script **as Administrator**.

---

## GitHub Releases

To publish to GitHub Releases:

1. Add to `package.json`:
```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "Skiro1",
      "repo": "LLM-Compare"
    }
  }
}
```

2. Run:
```powershell
set GH_TOKEN=your_github_token
npm run build:win -- --publish always
```

---

## License

MIT — see [LICENSE](../LICENSE)

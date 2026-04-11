# Changelog & Roadmap

## What's Done ✅

### Translation & Internationalization (v1.1.0 - Current)

#### Files Translated to English
- ✅ `README.md` — Full project description translated
- ✅ `LLM_Compare.html` — Main application interface (6083 lines)
- ✅ `proxy-server.js` — Console messages translated

#### Chrome Extension (`chrome-extension/`)
- ✅ `LLM_Compare.html` — Application interface
- ✅ `app.js` — Application logic (4158 lines) including:
  - System prompts (enhancer + aggregator)
  - Task profiles and templates
  - Model system prompts (20 models)
  - All UI strings, notifications, error messages
- ✅ `docs.js` — Theme toggle and copy button labels
- ✅ `popup.html` — Extension popup
- ✅ `manifest.json` — Extension metadata
- ✅ `README.md` — Extension documentation

#### Firefox Extension (`firefox-extension/`)
- ✅ `LLM_Compare.html` — Application interface
- ✅ `app.js` — Application logic (4158 lines)
- ✅ `docs.js` — Theme toggle and copy button labels
- ✅ `popup.html` — Extension popup
- ✅ `manifest.json` — Extension metadata
- ✅ `README.md` — Extension documentation

#### Bugs Fixed
- 🔧 **Syntax Error** — Unescaped apostrophe `user's` at line 5234 in `LLM_Compare.html`
- 🔧 **Syntax Error** — Unescaped apostrophe `user's` at line 5273 in `LLM_Compare.html`
- 🔧 **Syntax Error** — Unescaped apostrophe `don't` at line 5290 in `LLM_Compare.html`
- 🔧 **Syntax Error** — Unescaped apostrophe `don't` at line 5331 in `LLM_Compare.html`
- 🔧 **Runtime Error** — `btn is null` in `copyToClipboard()` function (both chrome & firefox extensions)
- 🔧 **Cleanup** — Removed temporary translation scripts (`bulk_translate.py`, `translate_all.py`)

#### Validation & Quality
- ✅ All JavaScript files pass syntax validation (`node -c`)
- ✅ All JSON files are valid (`manifest.json`, `opencode.json`, `package.json`)
- ✅ All HTML files have `lang="en"` attribute
- ✅ Zero Russian text in project files (except `ru/` folder and `translate.js`)

---

## Planned Improvements 🚧

### Priority 1 — Critical (Next Release v1.3.0)

#### Error Handling & Reliability
- [ ] **Add connection status indicators** — Real-time provider status
- [ ] **Graceful degradation** — Fallback when provider is unavailable

#### Security
- [ ] **Encrypt API keys** — Use Web Crypto API for localStorage
- [ ] **Add CORS proxy authentication** — Prevent unauthorized proxy usage
- [ ] **Sanitize user inputs** — Prevent XSS in prompts and responses

---

### Priority 2 — Important (v1.3.0)

#### Testing
- [ ] **Add unit tests** — Test core functions (prompts, validation, storage)
- [ ] **Add integration tests** — Test API provider interactions
- [ ] **Add E2E tests** — Test user workflows with Playwright
- [ ] **Add CI/CD** — GitHub Actions for automated testing

#### Performance
- [ ] **Lazy loading** — Load tabs and modals on demand
- [ ] **Cache API responses** — Reduce redundant requests
- [ ] **Optimize bundle size** — Tree-shaking, code splitting
- [ ] **Add service worker** — Offline support for cached data

#### User Experience
- [ ] **Streaming responses** — Real-time response display
- [ ] **Undo functionality** — Revert accidental changes
- [ ] **Bulk operations** — Select multiple models for actions
- [ ] **Keyboard shortcuts** — Quick navigation and actions

---

### Priority 3 — Nice to Have (v1.4.0+)

#### Features
- [ ] **PWA support** — Install as desktop/mobile app
- [ ] **Export to PDF** — Download results as formatted PDF
- [ ] **Custom providers** — User-defined provider configurations
- [ ] **Prompt versioning** — Track changes to prompts over time
- [ ] **Response analytics** — Statistics on model performance
- [ ] **Collaborative mode** — Share sessions with team members

#### Developer Experience
- [ ] **TypeScript migration** — Full type safety
- [ ] **API documentation** — OpenAPI/Swagger spec
- [ ] **Developer console** — Debug mode with detailed logs
- [ ] **Plugin system** — Allow third-party extensions

#### Integrations
- [ ] **Webhook support** — Trigger external services
- [ ] **Import from Open WebUI** — Migrate existing sessions
- [ ] **Cloud sync** — Backup sessions to cloud storage
- [ ] **Model benchmarking** — Automated comparison reports

---

## Project Stats

| Metric | Value |
|--------|-------|
| Total Files Translated | 21 files |
| Lines of Code Translated | ~25,000+ lines |
| Bugs Fixed | 6 |
| Supported Providers | 11 |
| Supported Languages | English, Russian (in `ru/`) |
| Browser Extensions | Chrome (MV3), Firefox (MV2) |

---

## Version History

### v1.2.0 — Modular Architecture & UX Improvements
- ✅ Split monolithic `LLM_Compare.html` into 11 JS modules + CSS
- ✅ Cheerio-based automated split script
- ✅ All JS files pass `node --check` syntax validation
- ✅ Applied to all 6 locations (root, ru/, extensions)
- ✅ Star History badge added to README
- ✅ **Fixed textarea resize bug** — replaced `resize: vertical` with auto-resize JS (no more glitchy drag handle)
- ✅ **Removed API Documentation** — deleted `api-docs.html` from all 6 locations, removed buttons and links from all index.html and popup files
- ✅ **Fixed popup.js** — restored broken extension popup files (were corrupted during cleanup)
- ✅ **Added retry with exponential backoff** — API requests auto-retry on failure (1s → 2s → 4s, max 3 attempts)
- ✅ **Added try/catch for saveToHistory** — error handling for history saving
- ✅ **Windows Desktop App** — Electron-based standalone app (`win/`) with NSIS installer and portable versions
- ✅ **RU updates folder** — `ru-updates/` for tracking files that need translation
- ✅ `.gitignore` updated
- ✅ Removed temporary files and cleanup scripts

### v1.1.0 (Current) — Translation & Bug Fixes
- ✅ Full English translation of all project files
- ✅ Fixed 4 syntax errors in `LLM_Compare.html`
- ✅ Fixed 2 runtime errors in extensions
- ✅ Cleaned up temporary translation scripts
- ✅ Validated all JS, JSON, and HTML files

### v1.0.2
- Previous release (see `Project_V1.0.2.zip`)

### v1.0.1
- Previous release (see `Project_V1.0.1.zip`)

### v1.0.0
- Initial release (see `Project_V1.0.0.zip`)

---

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

You are free to:
- ✅ Use the software for any purpose
- ✅ Modify the software to suit your needs
- ✅ Share the software with others
- ✅ Distribute modified versions

All subject to the following condition:
- Include the original copyright and license notice in any copy

---

**Last Updated:** April 3, 2026  
**Maintained By:** LLM Compare Team

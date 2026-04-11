# LLM Compare — Windows Desktop App

> Desktop-версия LLM Compare для Windows (NSIS installer + portable)

## Структура

```
win/
├── package.json          # Electron + electron-builder config
├── main.js               # Electron main process (открывает ссылки во внешнем браузере)
├── preload.js            # Preload script (contextBridge)
├── .gitignore            # dist/, node_modules/
├── build-en.bat          # Скрипт сборки английской версии
├── build-ru.bat          # Скрипт сборки русской версии
└── README_RU.md          # Этот файл
```

Папка `resources/app/` создаётся автоматически при сборке.

## Быстрый старт

### 1. Установите зависимости

```powershell
cd win
npm install
```

### 2. Скопируйте файлы проекта

**Английская версия:**
```powershell
# Или запустите build-en.bat от имени администратора:
mkdir resources\app
copy ..\index.html resources\app\
xcopy ..\css resources\app\css\ /E
xcopy ..\js resources\app\js\ /E
copy ..\proxy-server.js resources\app\
```

**Русская версия:**
```powershell
# Или запустите build-ru.bat от имени администратора:
mkdir resources\app
copy ..\ru\index.html resources\app\
xcopy ..\ru\css resources\app\css\ /E
xcopy ..\ru\js resources\app\js\ /E
copy ..\proxy-server.js resources\app\
```

### 3. Запустите в режиме разработки

```powershell
npm start
```

### 4. Соберите установщик

```powershell
npm run build:win
```

Результат будет в папке `dist/`:
- `LLM Compare Setup 1.2.0.exe` — NSIS installer
- `LLM Compare 1.2.0.exe` — portable version

> ⚠️ Запускайте скрипты **от имени администратора**, чтобы избежать ошибок с символическими ссылками.

---

## Что делает скрипт сборки

1. **Создаёт `resources/app/`** — папку с файлами приложения
2. **Копирует файлы проекта** — index.html, css/, js/, proxy-server.js
3. **Устанавливает зависимости** — electron, electron-builder
4. **Собирает установщик** — electron-builder создаёт .exe в `dist/`

---

## Настройка иконки

По умолчанию используется стандартная иконка Electron. Чтобы заменить:

1. Создайте `.png` иконку (512×512)
2. Положите в `resources/icon.png`
3. electron-builder автоматически сконвертирует в `.ico`

---

## Конфигурация electron-builder

В `package.json` секция `build`:

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

### Параметры:

| Параметр | Описание |
|---|---|
| `appId` | Уникальный идентификатор приложения |
| `productName` | Название в установщике |
| `win.target` | `portable`, `nsis` (установщик), `zip` |

---

## Требования

- **Node.js** 18+
- **Windows** 10/11
- **npm** 9+

---

## Архитектура Electron

```
┌─────────────────────────────────┐
│         Main Process            │
│         (main.js)               │
│  - Создаёт окно                 │
│  - Загружает index.html         │
│  - Открывает внешние ссылки     │
│    в системном браузере         │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│       Renderer Process          │
│       (index.html + JS)         │
│  - Весь UI приложения           │
│  - marked.js (CDN)              │
│  - Tailwind CSS (CDN)           │
└─────────────────────────────────┘
```

### Почему внешние ссылки открываются в браузере?

Google и другие сервисы блокируют Electron. Все ссылки (Google login, веб-чаты, OAuth) автоматически открываются в браузере по умолчанию пользователя — Chrome, Firefox, Edge и т.д.

### Надёжность API запросов

Все API запросы используют **повторные попытки с экспоненциальной задержкой**:
- При ошибе → повтор через 1с → 2с → 4с
- Максимум 3 попытки
- Каждая попытка логируется в журнале приложения
- Во время повторных попыток пользователь видит статус "Waiting for response..."

---

## Troubleshooting

### Ошибка "Cannot find module"
```powershell
npm install
```

### Приложение не запускается
Проверьте что `resources/app/index.html` существует:
```powershell
dir resources\app\
```

### Ошибка при сборке
Удалите `node_modules` и `dist`, затем начните заново:
```powershell
rmdir /s /q node_modules dist
npm install
npm run build:win
```

### Ошибка с символическими ссылками
Запустите скрипт **от имени администратора**.

---

## GitHub Releases

Чтобы опубликовать на GitHub Releases:

1. В `package.json` добавьте:
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

2. Запустите:
```powershell
set GH_TOKEN=your_github_token
npm run build:win -- --publish always
```

---

## Лицензия

MIT — см. [LICENSE](../LICENSE)

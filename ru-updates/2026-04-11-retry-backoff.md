# 2026-04-11 — Retry with exponential backoff

## Статус: ✅ Выполнено (все 6 локаций + win)

## Что изменено

Добавлена функция `retryWithBackoff()` — автоматические повторные попытки при ошибках API:

```js
async function retryWithBackoff(fn, maxRetries = 2) {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (e) {
            lastError = e;
            if (attempt < maxRetries) {
                const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s...
                appLog('warn', `Request failed, retry ${attempt + 1}/${maxRetries} in ${delay}ms: ${e.message}`);
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }
    throw lastError;
}
```

Функция `doCloudChatRequest()` теперь оборачивает все fetch-запросы в retryWithBackoff.

## Обновлённые файлы

| Файл | Статус |
|---|---|
| `js/modules/providers.js` | ✅ |
| `chrome-extension/app.js` | ✅ |
| `firefox-extension/app.js` | ✅ |
| `ru/js/modules/providers.js` | ✅ |
| `ru/chrome-extension/app.js` | ✅ |
| `ru/firefox-extension/app.js` | ✅ |
| `win/resources/app/*` | ✅ Синхронизировано |

## Логика retry

- **maxRetries: 2** — максимум 2 повторные попытки (3 всего)
- **Задержка:** 1с → 2с → 4с (экспоненциальная)
- **Логирование:** `appLog('warn', ...)` при каждой попытке
- **Пользователь:** видит статус "Waiting for response..." дольше, но не видит ошибки при временных сбоях

# LLM Compare — Расширение для Firefox

Расширение для Firefox (Manifest V2) приложения LLM Compare.

## Возможности

- Поля для ввода ссылок на чаты прямо на этапе «Модели»
- Автоматическое сохранение URL чатов
- Локальный автосейв данных в `localStorage`

## Установка

1. Откройте `about:debugging#/runtime/this-firefox`
2. Нажмите **«Загрузить временное дополнение…»**
3. Выберите файл `manifest.json` из папки `firefox-extension/`

> Временные дополнения удаляются при закрытии браузера. Для постоянной установки упакуйте расширение в `.xpi` или опубликуйте в AMO.

## Структура

```
firefox-extension/
├── manifest.json       # Манифест расширения (MV2)
├── background.js       # Background script
├── popup.html          # Попап расширения
├── LLM_Compare.html    # Основной интерфейс
├── app.js              # Логика приложения
└── icons/              # Иконки расширения
```

## Технические детали

- Manifest V2
- Background script в `background.js`
- Данные хранятся в `localStorage` браузера
- Не требует сборки

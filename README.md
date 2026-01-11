# Tic-Tac-Toe

Веб-приложение "Крестики-нолики" с системой промокодов.

## Технологии

- **React 18** + TypeScript
- **Vite** — сборка
- **Tailwind CSS v4** — стилизация
- **Framer Motion** — анимации
- **Lucide React** — иконки

## Установка

```bash
npm install
```

## Запуск

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Структура проекта

```
src/
├── components/
│   ├── Cell.tsx          # Ячейка игрового поля
│   ├── GameBoard.tsx     # Игровое поле 3x3
│   ├── Header.tsx        # Заголовок
│   ├── Modal.tsx         # Модальное окно результата
│   └── PromoCode.tsx     # Компонент промокода
├── hooks/
│   ├── useGame.ts        # Игровая логика
│   └── useAI.ts          # Алгоритм противника
├── services/
│   └── telegramService.ts
├── types/
│   └── game.ts           # TypeScript типы
├── utils/
│   ├── codeGenerator.ts  # Генератор промокодов
│   └── storage.ts        # localStorage
├── App.tsx
├── main.tsx
└── index.css
```

## Функциональность

- Игра против компьютера с адаптивной сложностью
- Генерация промокодов при победе
- Сохранение статистики в localStorage
- Анимации с использованием spring physics
- Адаптивный дизайн (Mobile First)
- Поддержка клавиатурной навигации
- Haptic feedback на мобильных устройствах

## API интеграция

Проект поддерживает отправку промокодов через Telegram Bot API.

- **Development:** mock-реализация (логирование в консоль)
- **Production:** реальная отправка через `/api/telegram`

## Деплой на Vercel

### 1. Подключение репозитория

```bash
# Установить Vercel CLI (опционально)
npm i -g vercel

# Деплой
vercel
```

Или подключить репозиторий через [Vercel Dashboard](https://vercel.com/dashboard).

### 2. Настройка переменных окружения

В Vercel Dashboard → Project → Settings → Environment Variables добавить:

| Переменная | Описание |
|------------|----------|
| `TELEGRAM_BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | ID чата/канала для отправки промокодов |

### 3. Получение Telegram credentials

1. Создать бота через [@BotFather](https://t.me/BotFather) → `/newbot`
2. Скопировать токен бота
3. Добавить бота в нужный чат/канал
4. Получить Chat ID через [@userinfobot](https://t.me/userinfobot) или API

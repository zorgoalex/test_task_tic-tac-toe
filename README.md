# Tic-Tac-Toe

Веб-приложение "Крестики-нолики" с адаптивным ИИ и системой промокодов.

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
│   └── useAI.ts          # Логика ИИ
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

- Игра против ИИ с адаптивной сложностью
- Генерация промокодов при победе
- Сохранение статистики в localStorage
- Анимации с использованием spring physics
- Адаптивный дизайн (Mobile First)
- Поддержка клавиатурной навигации
- Haptic feedback на мобильных устройствах

## API интеграция

Проект поддерживает отправку промокодов через внешний API. В режиме разработки используется mock-реализация.

Для production необходимо создать API endpoint `/api/telegram` и настроить переменные окружения.

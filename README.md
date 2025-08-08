# Kinescope Quotes (v0)

Сервис смет для онлайн‑трансляций. Публичный шаринг по токену, фиксированная ставка УСН 7%.

## Быстрый старт
```bash
pnpm i
pnpm prisma:dev
pnpm dev
```
Открой `http://localhost:3000/admin/quotes/new`, создай смету и получи ссылку `/q/<token>`.

## Деплой
- Vercel + Neon/Supabase (скопируй `DATABASE_URL`, выполни `prisma migrate deploy`).

## Примечания
- Авторизация отключена для v1 (стейджинг). Подключим позже при необходимости.

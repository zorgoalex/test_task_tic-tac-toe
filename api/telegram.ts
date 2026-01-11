import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * API Route для отправки промокодов в Telegram
 *
 * Переменные окружения (настроить в Vercel Dashboard):
 * - TELEGRAM_BOT_TOKEN: токен бота от @BotFather
 * - TELEGRAM_CHAT_ID: ID чата/канала для отправки
 */

const TELEGRAM_API = 'https://api.telegram.org/bot'

interface TelegramResponse {
  ok: boolean
  description?: string
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Проверяем переменные окружения
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  // Получаем данные из тела запроса
  const { code, message: customMessage } = req.body

  if (!code && !customMessage) {
    return res.status(400).json({ error: 'Missing code or message' })
  }

  // Формируем сообщение
  const message = code
    ? `Победа! Промокод выдан: ${code}`
    : customMessage

  try {
    // Отправляем в Telegram
    const response = await fetch(`${TELEGRAM_API}${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    })

    const data: TelegramResponse = await response.json()

    if (!data.ok) {
      console.error('Telegram API error:', data.description)
      return res.status(500).json({ error: 'Failed to send message' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Telegram request failed:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Сервис для отправки промокодов в Telegram
 *
 * Локальная разработка: mock с console.log
 * Продакшен (Vercel): реальный API запрос
 */

interface SendPromoCodeResult {
  success: boolean
  message: string
}

const IS_PRODUCTION = import.meta.env.PROD
const API_ENDPOINT = '/api/telegram'

/**
 * Отправляет промокод в Telegram
 * В dev-режиме просто логирует в консоль
 */
export async function sendMessage(message: string): Promise<SendPromoCodeResult> {
  if (!IS_PRODUCTION) {
    console.log('[TelegramService] Mock: отправка сообщения', message)
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true, message: 'Сообщение отправлено (mock)' }
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return { success: true, message: 'Сообщение отправлено' }
  } catch (error) {
    console.error('[TelegramService] Ошибка отправки:', error)
    return { success: false, message: 'Не удалось отправить сообщение' }
  }
}

export async function sendPromoCode(code: string): Promise<SendPromoCodeResult> {
  if (!IS_PRODUCTION) {
    // Mock для локальной разработки
    console.log('[TelegramService] Mock: отправка промокода', code)

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      success: true,
      message: 'Промокод отправлен (mock)',
    }
  }

  // Реальная отправка в продакшене
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    return {
      success: true,
      message: 'Промокод отправлен',
    }
  } catch (error) {
    console.error('[TelegramService] Ошибка отправки:', error)
    return {
      success: false,
      message: 'Не удалось отправить промокод',
    }
  }
}

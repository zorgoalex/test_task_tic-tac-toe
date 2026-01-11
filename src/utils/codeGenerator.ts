/**
 * Генератор промокодов
 * Исключает неоднозначные символы: 0, O, I, 1, l
 * Формат: XXX-XXX (например, K7M-2PQ)
 */

const ALLOWED_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function getRandomChar(): string {
  return ALLOWED_CHARS[Math.floor(Math.random() * ALLOWED_CHARS.length)]
}

export function generatePromoCode(): string {
  const part1 = Array.from({ length: 3 }, getRandomChar).join('')
  const part2 = Array.from({ length: 3 }, getRandomChar).join('')
  return `${part1}-${part2}`
}

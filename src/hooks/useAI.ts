import { useCallback } from 'react'
import type { CellValue } from '../types/game'
import { WINNING_COMBINATIONS } from '../types/game'
import { getStats } from '../utils/storage'

/**
 * ИИ "Драматург"
 * Играет в поддавки, но незаметно
 * Адаптируется к истории побед/поражений игрока
 */

export function useAI() {
  const getAIMove = useCallback((board: CellValue[]): number => {
    const stats = getStats()
    const emptyIndices = board
      .map((cell, index) => (cell === null ? index : -1))
      .filter(index => index !== -1)

    if (emptyIndices.length === 0) return -1

    // Базовый шанс ошибки: 20%
    // Если игрок проиграл последнюю игру — увеличиваем до 35%
    // Если игрок выиграл 2+ раз подряд — уменьшаем до 10%
    let mistakeChance = 0.2

    if (stats.lastResult === 'loss') {
      mistakeChance = 0.35
    } else if (stats.wins >= 2 && stats.lastResult === 'win') {
      mistakeChance = 0.1
    }

    // С определенной вероятностью делаем случайный ход
    if (Math.random() < mistakeChance) {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
    }

    // Проверяем, можем ли выиграть
    const winningMove = findWinningMove(board, 'O')
    if (winningMove !== -1) {
      return winningMove
    }

    // Блокируем игрока с вероятностью 80%
    const blockingMove = findWinningMove(board, 'X')
    if (blockingMove !== -1) {
      // Иногда "забываем" заблокировать
      if (Math.random() < 0.8) {
        return blockingMove
      }
    }

    // Занимаем центр, если свободен
    if (board[4] === null) {
      return 4
    }

    // Занимаем угол
    const corners = [0, 2, 6, 8].filter(i => board[i] === null)
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)]
    }

    // Занимаем любую свободную клетку
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
  }, [])

  return { getAIMove }
}

/**
 * Находит выигрышный ход для указанного игрока
 */
function findWinningMove(board: CellValue[], player: CellValue): number {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    const cells = [board[a], board[b], board[c]]
    const playerCount = cells.filter(cell => cell === player).length
    const emptyCount = cells.filter(cell => cell === null).length

    if (playerCount === 2 && emptyCount === 1) {
      // Нашли линию с двумя фигурами игрока и одной пустой клеткой
      if (board[a] === null) return a
      if (board[b] === null) return b
      if (board[c] === null) return c
    }
  }
  return -1
}

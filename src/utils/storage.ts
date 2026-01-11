/**
 * Работа с localStorage для хранения статистики игр
 */

const STORAGE_KEY = 'tic-tac-toe-stats'

export interface GameStats {
  wins: number
  losses: number
  draws: number
  lastResult: 'win' | 'loss' | 'draw' | null
}

const defaultStats: GameStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  lastResult: null,
}

export function getStats(): GameStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...defaultStats, ...JSON.parse(stored) }
    }
  } catch {
    // Игнорируем ошибки парсинга
  }
  return { ...defaultStats }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // Игнорируем ошибки сохранения
  }
}

export function recordWin(): GameStats {
  const stats = getStats()
  stats.wins++
  stats.lastResult = 'win'
  saveStats(stats)
  return stats
}

export function recordLoss(): GameStats {
  const stats = getStats()
  stats.losses++
  stats.lastResult = 'loss'
  saveStats(stats)
  return stats
}

export function recordDraw(): GameStats {
  const stats = getStats()
  stats.draws++
  stats.lastResult = 'draw'
  saveStats(stats)
  return stats
}

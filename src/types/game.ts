/**
 * Типы для игры "Крестики-нолики"
 */

export type CellValue = 'X' | 'O' | null
export type Player = 'X' | 'O'
export type GameStatus = 'playing' | 'win' | 'loss' | 'draw'

export interface WinLine {
  cells: [number, number, number]
  winner: Player
}

export interface GameState {
  board: CellValue[]
  currentPlayer: Player
  status: GameStatus
  winLine: WinLine | null
  isPlayerTurn: boolean
}

export const WINNING_COMBINATIONS: [number, number, number][] = [
  [0, 1, 2], // верхний ряд
  [3, 4, 5], // средний ряд
  [6, 7, 8], // нижний ряд
  [0, 3, 6], // левый столбец
  [1, 4, 7], // средний столбец
  [2, 5, 8], // правый столбец
  [0, 4, 8], // диагональ \
  [2, 4, 6], // диагональ /
]

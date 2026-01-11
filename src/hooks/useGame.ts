import { useState, useCallback } from 'react'
import type { CellValue, GameState, WinLine, GameStatus } from '../types/game'
import { WINNING_COMBINATIONS } from '../types/game'
import { useAI } from './useAI'

const createInitialState = (): GameState => ({
  board: Array(9).fill(null),
  currentPlayer: 'X',
  status: 'playing',
  winLine: null,
  isPlayerTurn: true, // Игрок всегда X и ходит первым
})

function checkWinner(board: CellValue[]): WinLine | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        cells: [a, b, c],
        winner: board[a]!,
      }
    }
  }
  return null
}

function checkDraw(board: CellValue[]): boolean {
  return board.every(cell => cell !== null)
}

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const { getAIMove } = useAI()

  const makeMove = useCallback((index: number) => {
    setState(prev => {
      // Проверяем, можно ли сделать ход
      if (prev.board[index] !== null || prev.status !== 'playing' || !prev.isPlayerTurn) {
        return prev
      }

      // Делаем ход игрока
      const newBoard = [...prev.board]
      newBoard[index] = 'X'

      // Проверяем победу игрока
      const winLine = checkWinner(newBoard)
      if (winLine) {
        return {
          ...prev,
          board: newBoard,
          status: 'win' as GameStatus,
          winLine,
          isPlayerTurn: false,
        }
      }

      // Проверяем ничью
      if (checkDraw(newBoard)) {
        return {
          ...prev,
          board: newBoard,
          status: 'draw' as GameStatus,
          isPlayerTurn: false,
        }
      }

      // Передаем ход ИИ
      return {
        ...prev,
        board: newBoard,
        currentPlayer: 'O',
        isPlayerTurn: false,
      }
    })
  }, [])

  const processAIMove = useCallback(async () => {
    setIsProcessing(true)

    // Небольшая задержка для "обдумывания"
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400))

    setState(prev => {
      if (prev.status !== 'playing' || prev.isPlayerTurn) {
        setIsProcessing(false)
        return prev
      }

      const aiMove = getAIMove(prev.board)
      if (aiMove === -1) {
        setIsProcessing(false)
        return prev
      }

      const newBoard = [...prev.board]
      newBoard[aiMove] = 'O'

      // Проверяем победу ИИ
      const winLine = checkWinner(newBoard)
      if (winLine) {
        setIsProcessing(false)
        return {
          ...prev,
          board: newBoard,
          status: 'loss' as GameStatus,
          winLine,
          isPlayerTurn: false,
        }
      }

      // Проверяем ничью
      if (checkDraw(newBoard)) {
        setIsProcessing(false)
        return {
          ...prev,
          board: newBoard,
          status: 'draw' as GameStatus,
          isPlayerTurn: false,
        }
      }

      setIsProcessing(false)
      return {
        ...prev,
        board: newBoard,
        currentPlayer: 'X',
        isPlayerTurn: true,
      }
    })
  }, [getAIMove])

  const resetGame = useCallback(() => {
    setState(createInitialState())
    setIsProcessing(false)
  }, [])

  return {
    state,
    isProcessing,
    makeMove,
    processAIMove,
    resetGame,
  }
}

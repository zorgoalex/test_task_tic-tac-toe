import { motion } from 'framer-motion'
import { Cell } from './Cell'
import type { CellValue, WinLine } from '../types/game'

interface GameBoardProps {
  board: CellValue[]
  onCellClick: (index: number) => void
  disabled: boolean
  winLine: WinLine | null
  isBlurred: boolean
}

export function GameBoard({ board, onCellClick, disabled, winLine, isBlurred }: GameBoardProps) {
  const winningCells: number[] = winLine?.cells ?? []

  return (
    <motion.div
      className={`
        relative
        w-full max-w-[320px] mx-auto
        rounded-2xl overflow-hidden
        transition-all duration-500
        ${isBlurred ? 'blur-sm opacity-50' : ''}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(168, 85, 247, 0.3))',
        padding: '3px',
        boxShadow: '0 8px 32px rgba(255, 107, 157, 0.2), 0 4px 16px rgba(168, 85, 247, 0.15)',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      role="grid"
      aria-label="Игровое поле 3 на 3"
    >
      <div
        className="grid grid-cols-3 rounded-xl overflow-hidden"
        style={{
          gap: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        {board.map((value, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
            }}
            role="gridcell"
          >
            <Cell
              value={value}
              index={index}
              onClick={() => onCellClick(index)}
              disabled={disabled}
              isWinning={winningCells.includes(index)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

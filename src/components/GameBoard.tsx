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
        grid grid-cols-3
        w-full max-w-[320px] mx-auto
        rounded-lg overflow-hidden
        transition-all duration-500
        ${isBlurred ? 'blur-sm opacity-50' : ''}
      `}
      style={{
        backgroundColor: 'rgba(51, 51, 51, 0.12)',
        gap: '1px',
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      role="grid"
      aria-label="Игровое поле 3 на 3"
    >
      {board.map((value, index) => (
        <div
          key={index}
          style={{ backgroundColor: '#f9f9f7' }}
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
    </motion.div>
  )
}

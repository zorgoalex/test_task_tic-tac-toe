import { motion } from 'framer-motion'
import type { CellValue } from '../types/game'

interface CellProps {
  value: CellValue
  index: number
  onClick: () => void
  disabled: boolean
  isWinning: boolean
}

const COLORS = {
  player: '#7a8a6b',    // sage-dark
  computer: '#a88888',  // rose-dark
  winBg: 'rgba(156, 170, 139, 0.15)', // sage с прозрачностью
  hoverBg: 'rgba(51, 51, 51, 0.05)',
}

export function Cell({ value, index, onClick, disabled, isWinning }: CellProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <motion.button
      className={`
        w-full flex items-center justify-center
        text-5xl sm:text-6xl font-medium
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${disabled ? 'cursor-default' : 'cursor-pointer'}
      `}
      style={{
        aspectRatio: '1 / 1',
        minHeight: '80px',
        backgroundColor: isWinning ? COLORS.winBg : 'transparent',
        color: value === 'X' ? COLORS.player : COLORS.computer,
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || value !== null}
      aria-label={`Ячейка ${index + 1}${value ? `, занята ${value === 'X' ? 'вами' : 'компьютером'}` : ', пустая'}`}
      tabIndex={disabled ? -1 : 0}
      whileHover={!disabled && !value ? { scale: 1.05, backgroundColor: COLORS.hoverBg } : {}}
      whileTap={!disabled && !value ? { scale: 0.95 } : {}}
    >
      {value && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: isWinning ? [1, 1.1, 1] : 1,
            rotate: 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            scale: isWinning
              ? { repeat: Infinity, duration: 1.5 }
              : { duration: 0.3 },
          }}
          style={{
            filter: isWinning ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none',
          }}
        >
          {value === 'X' ? '✦' : '○'}
        </motion.span>
      )}
    </motion.button>
  )
}

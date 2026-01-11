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
  player: '#ff6b9d',      // vibrant pink
  computer: '#a855f7',    // purple
  winBg: 'rgba(255, 107, 157, 0.2)',
  hoverBg: 'rgba(255, 107, 157, 0.1)',
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
            scale: isWinning ? [1, 1.2, 1] : 1,
            rotate: 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 15,
            scale: isWinning
              ? { repeat: Infinity, duration: 1 }
              : { duration: 0.3 },
          }}
          style={{
            filter: isWinning
              ? 'drop-shadow(0 0 12px rgba(255, 107, 157, 0.6))'
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          {value === 'X' ? '💗' : '💜'}
        </motion.span>
      )}
    </motion.button>
  )
}

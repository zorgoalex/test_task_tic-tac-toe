import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { GameStatus } from '../types/game'
import { PromoCode } from './PromoCode'

interface ModalProps {
  isOpen: boolean
  status: GameStatus
  promoCode: string | null
  onClose: () => void
  onPlayAgain: () => void
}

const COLORS = {
  ivory: '#f9f9f7',
  charcoal: '#333333',
  sage: '#9caa8b',
  sageDark: '#7a8a6b',
}

const TITLES: Record<Exclude<GameStatus, 'playing'>, string> = {
  win: 'Поздравляем!',
  loss: 'Попробуйте ещё раз',
  draw: 'Ничья',
}

const MESSAGES: Record<Exclude<GameStatus, 'playing'>, string> = {
  win: 'Вы выиграли и получаете промокод на скидку!',
  loss: 'В этот раз не получилось, но вы можете сыграть ещё.',
  draw: 'Отличная игра! Попробуйте ещё раз.',
}

export function Modal({ isOpen, status, promoCode, onClose, onPlayAgain }: ModalProps) {
  // Блокируем скролл при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (status === 'playing') return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 backdrop-blur-sm z-40"
            style={{ backgroundColor: 'rgba(51, 51, 51, 0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 bottom-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div
              className="rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full mx-auto relative"
              style={{ backgroundColor: COLORS.ivory }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 transition-colors rounded-full"
                style={{ color: 'rgba(51, 51, 51, 0.5)' }}
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <h2
                  id="modal-title"
                  className="font-serif text-2xl sm:text-3xl font-semibold mb-2"
                  style={{ color: COLORS.charcoal }}
                >
                  {TITLES[status]}
                </h2>

                <p className="mb-6" style={{ color: 'rgba(51, 51, 51, 0.7)' }}>
                  {MESSAGES[status]}
                </p>

                {/* Промокод при победе */}
                {status === 'win' && promoCode && (
                  <div className="mb-6">
                    <PromoCode code={promoCode} />
                  </div>
                )}

                {/* Кнопка "Играть ещё" */}
                <motion.button
                  onClick={onPlayAgain}
                  className="w-full py-3 px-6 text-white font-medium rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ backgroundColor: COLORS.sage }}
                  whileHover={{ scale: 1.02, backgroundColor: COLORS.sageDark }}
                  whileTap={{ scale: 0.98 }}
                >
                  Играть ещё
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

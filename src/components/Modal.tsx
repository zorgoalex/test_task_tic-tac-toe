import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Meh } from 'lucide-react'
import type { GameStatus } from '../types/game'
import { PromoCode } from './PromoCode'

interface ModalProps {
  isOpen: boolean
  status: GameStatus
  promoCode: string | null
  onClose: () => void
  onPlayAgain: () => void
}

const TITLES: Record<Exclude<GameStatus, 'playing'>, { text: string; emoji: string }> = {
  win: { text: 'Победа!', emoji: '🎉' },
  loss: { text: 'Почти получилось,\nдавай ещё раз!', emoji: '🥺' },
  draw: { text: 'Ничья', emoji: '🤝' },
}

const MESSAGES: Record<Exclude<GameStatus, 'playing'>, string> = {
  win: 'Ты выиграла! Держи промокод на скидку 💝',
  loss: 'Победа уже близко! 💪',
  draw: 'Отличная игра! Попробуй ещё раз 💪',
}

// Confetti component
function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: ['#ff6b9d', '#a855f7', '#22d3ee', '#fb923c', '#fbbf24'][Math.floor(Math.random() * 5)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 100,
            rotate: p.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  )
}

export function Modal({ isOpen, status, promoCode, onClose, onPlayAgain }: ModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  // Блокируем скролл при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (status === 'win') {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, status])

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

  const IconComponent = status === 'win' ? Sparkles : Meh
  const gradientColors = status === 'win'
    ? 'from-pink-500 to-purple-500'
    : status === 'loss'
    ? 'from-purple-400 to-indigo-400'
    : 'from-cyan-400 to-teal-400'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showConfetti && <Confetti />}

          {/* Overlay */}
          <motion.div
            className="fixed inset-0 backdrop-blur-md z-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
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
              className="glass rounded-3xl p-6 sm:p-8 max-w-md w-full mx-auto relative overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Decorative gradient blob */}
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradientColors} rounded-full opacity-20 blur-3xl`}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 transition-all rounded-full hover:bg-white/50"
                style={{ color: 'rgba(0, 0, 0, 0.4)' }}
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center relative z-10">
                {/* Icon - только для win и draw */}
                {status !== 'loss' && (
                  <motion.div
                    className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: status === 'win'
                        ? 'linear-gradient(135deg, #ff6b9d, #a855f7)'
                        : 'linear-gradient(135deg, #22d3ee, #14b8a6)',
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                )}

                {/* Title with emoji */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-5xl mb-3 block">{TITLES[status].emoji}</span>
                  <h2
                    id="modal-title"
                    className="font-display text-xl sm:text-2xl font-bold mb-2 gradient-text whitespace-pre-line"
                  >
                    {TITLES[status].text}
                  </h2>
                </motion.div>

                <motion.p
                  className="mb-6 text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {MESSAGES[status]}
                </motion.p>

                {/* Промокод при победе */}
                {status === 'win' && promoCode && (
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <PromoCode code={promoCode} />
                  </motion.div>
                )}

                {/* Кнопка "Играть ещё" */}
                <motion.button
                  onClick={onPlayAgain}
                  className="w-full py-3.5 px-6 text-white font-semibold rounded-2xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b9d 0%, #a855f7 100%)',
                    boxShadow: '0 4px 20px rgba(255, 107, 157, 0.4)',
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 6px 25px rgba(255, 107, 157, 0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  ✨ Играть ещё
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

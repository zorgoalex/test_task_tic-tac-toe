import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Gift } from 'lucide-react'

interface PromoCodeProps {
  code: string
}

export function PromoCode({ code }: PromoCodeProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)

      // Haptic feedback на мобильных
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }

      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
        <Gift className="w-4 h-4" style={{ color: '#ff6b9d' }} />
        <span>Твой промокод:</span>
      </div>

      <motion.div
        className="flex items-center gap-3 rounded-2xl px-5 py-3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(168, 85, 247, 0.1))',
          border: '2px dashed rgba(255, 107, 157, 0.4)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <span
          className="font-mono text-2xl sm:text-3xl font-bold tracking-wider gradient-text"
        >
          {code}
        </span>

        <motion.button
          onClick={handleCopy}
          className="p-2.5 rounded-xl transition-all"
          style={{
            background: copied
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, #ff6b9d, #a855f7)',
            color: 'white',
            boxShadow: copied
              ? '0 4px 15px rgba(34, 197, 94, 0.3)'
              : '0 4px 15px rgba(255, 107, 157, 0.3)',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={copied ? 'Скопировано' : 'Копировать промокод'}
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </motion.button>
      </motion.div>

      {copied && (
        <motion.p
          className="text-sm font-medium"
          style={{ color: '#22c55e' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Скопировано! ✅
        </motion.p>
      )}
    </div>
  )
}

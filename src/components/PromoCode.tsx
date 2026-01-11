import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

interface PromoCodeProps {
  code: string
}

const COLORS = {
  charcoal: '#333333',
  sage: '#9caa8b',
  sageDark: '#7a8a6b',
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
      <p className="text-sm" style={{ color: 'rgba(51, 51, 51, 0.7)' }}>
        Ваш промокод:
      </p>

      <motion.div
        className="flex items-center gap-3 rounded-lg px-5 py-3"
        style={{ backgroundColor: 'rgba(51, 51, 51, 0.05)' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <span
          className="font-mono text-2xl sm:text-3xl font-medium tracking-wider"
          style={{ color: COLORS.charcoal }}
        >
          {code}
        </span>

        <motion.button
          onClick={handleCopy}
          className="p-2 rounded-md transition-colors"
          style={{
            backgroundColor: copied ? 'rgba(156, 170, 139, 0.2)' : 'rgba(51, 51, 51, 0.1)',
            color: copied ? COLORS.sageDark : 'rgba(51, 51, 51, 0.7)',
          }}
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
          className="text-sm"
          style={{ color: COLORS.sageDark }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Скопировано!
        </motion.p>
      )}
    </div>
  )
}

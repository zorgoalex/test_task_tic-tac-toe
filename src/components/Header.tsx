import { motion } from 'framer-motion'

interface HeaderProps {
  subtitle?: string
}

export function Header({ subtitle }: HeaderProps) {
  return (
    <motion.header
      className="text-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1
        className="font-display text-4xl sm:text-5xl font-extrabold mb-2 gradient-text"
      >
        Крестики-нолики
      </h1>
      {subtitle && (
        <motion.p
          className="text-base sm:text-lg font-medium"
          style={{ color: '#64748b' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.header>
  )
}

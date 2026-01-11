import { motion } from 'framer-motion'

interface HeaderProps {
  subtitle?: string
}

export function Header({ subtitle }: HeaderProps) {
  return (
    <motion.header
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1
        className="font-serif text-3xl sm:text-4xl font-semibold mb-2"
        style={{ color: '#333333' }}
      >
        Крестики-нолики
      </h1>
      {subtitle && (
        <p
          className="text-sm sm:text-base"
          style={{ color: 'rgba(51, 51, 51, 0.6)' }}
        >
          {subtitle}
        </p>
      )}
    </motion.header>
  )
}

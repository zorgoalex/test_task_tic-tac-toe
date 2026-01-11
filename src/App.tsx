import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { GameBoard } from './components/GameBoard'
import { Modal } from './components/Modal'
import { useGame } from './hooks/useGame'
import { generatePromoCode } from './utils/codeGenerator'
import { recordWin, recordLoss, recordDraw } from './utils/storage'
import { sendPromoCode, sendMessage } from './services/telegramService'

function App() {
  const { state, isProcessing, makeMove, processAIMove, resetGame } = useGame()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [lastClickTime, setLastClickTime] = useState(0)

  // Обработка хода компьютера
  useEffect(() => {
    if (!state.isPlayerTurn && state.status === 'playing' && !isProcessing) {
      processAIMove()
    }
  }, [state.isPlayerTurn, state.status, isProcessing, processAIMove])

  // Обработка завершения игры
  useEffect(() => {
    if (state.status !== 'playing') {
      const timer = setTimeout(() => {
        if (state.status === 'win') {
          const code = generatePromoCode()
          setPromoCode(code)
          recordWin()
          sendPromoCode(code)
        } else if (state.status === 'loss') {
          recordLoss()
          sendMessage('Проигрыш')
        } else if (state.status === 'draw') {
          recordDraw()
        }
        setIsModalOpen(true)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [state.status])

  // Обработка клика по ячейке с debounce
  const handleCellClick = useCallback((index: number) => {
    const now = Date.now()
    if (now - lastClickTime < 300) return

    setLastClickTime(now)
    makeMove(index)
  }, [makeMove, lastClickTime])

  // Сброс игры
  const handlePlayAgain = useCallback(() => {
    setIsModalOpen(false)
    setPromoCode(null)
    resetGame()
  }, [resetGame])

  // Текст статуса
  const getStatusText = () => {
    if (state.status !== 'playing') return ''
    if (isProcessing) return 'Думаю... 🤔'
    return 'Твой ход! ✨'
  }

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Декоративные элементы */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>💖</div>
      <div className="absolute bottom-20 right-10 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>✨</div>
      <div className="absolute top-1/4 right-20 text-4xl opacity-15 animate-pulse">💫</div>

      <div className="w-full max-w-md relative z-10">
        <Header subtitle={getStatusText()} />

        <div className="glass rounded-3xl p-6 sm:p-8">
          <GameBoard
            board={state.board}
            onCellClick={handleCellClick}
            disabled={!state.isPlayerTurn || state.status !== 'playing' || isProcessing}
            winLine={state.winLine}
            isBlurred={isModalOpen}
          />

          {/* Легенда */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255, 107, 157, 0.15)' }}>
              <span className="text-xl">💗</span>
              <span style={{ color: '#e85a8a', fontWeight: 600 }}>Ты</span>
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)' }}>
              <span className="text-xl">🤖</span>
              <span style={{ color: '#7c3aed', fontWeight: 600 }}>Бот</span>
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        status={state.status}
        promoCode={promoCode}
        onClose={handlePlayAgain}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  )
}

export default App

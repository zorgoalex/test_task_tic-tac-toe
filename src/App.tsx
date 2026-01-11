import { useState, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { GameBoard } from './components/GameBoard'
import { Modal } from './components/Modal'
import { useGame } from './hooks/useGame'
import { generatePromoCode } from './utils/codeGenerator'
import { recordWin, recordLoss, recordDraw } from './utils/storage'
import { sendPromoCode } from './services/telegramService'

function App() {
  const { state, isProcessing, makeMove, processAIMove, resetGame } = useGame()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [lastClickTime, setLastClickTime] = useState(0)

  // Обработка хода ИИ
  useEffect(() => {
    if (!state.isPlayerTurn && state.status === 'playing' && !isProcessing) {
      processAIMove()
    }
  }, [state.isPlayerTurn, state.status, isProcessing, processAIMove])

  // Обработка завершения игры
  useEffect(() => {
    if (state.status !== 'playing') {
      // Небольшая задержка перед показом модального окна
      const timer = setTimeout(() => {
        if (state.status === 'win') {
          const code = generatePromoCode()
          setPromoCode(code)
          recordWin()
          // Отправляем промокод в Telegram (mock в dev)
          sendPromoCode(code)
        } else if (state.status === 'loss') {
          recordLoss()
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
    if (now - lastClickTime < 300) return // Debounce 300ms

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
    if (isProcessing) return 'Компьютер думает...'
    return 'Ваш ход'
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: '#f9f9f7' }}
    >
      <div className="w-full max-w-md">
        <Header subtitle={getStatusText()} />

        <GameBoard
          board={state.board}
          onCellClick={handleCellClick}
          disabled={!state.isPlayerTurn || state.status !== 'playing' || isProcessing}
          winLine={state.winLine}
          isBlurred={isModalOpen}
        />

        {/* Индикатор хода */}
        <div className="mt-6 text-center">
          <div
            className="flex items-center justify-center gap-4 text-sm"
            style={{ color: 'rgba(51, 51, 51, 0.6)' }}
          >
            <span className="flex items-center gap-1">
              <span className="text-lg" style={{ color: '#7a8a6b' }}>✦</span> Вы
            </span>
            <span className="flex items-center gap-1">
              <span className="text-lg" style={{ color: '#a88888' }}>○</span> Компьютер
            </span>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        status={state.status}
        promoCode={promoCode}
        onClose={() => setIsModalOpen(false)}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  )
}

export default App

import { useMemo, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'
import { createInitialBoard } from '../chess/init'
import type { Board, Square } from '../types'
import { getGameStatus, isLegalMove, movePiece, otherColor } from '../chess/rules'
import { getLegalMovesForTurn } from '../chess/helpers'
import { ChessBoard } from './ChessBoard'
import { ChessInfo } from './ChessInfo'

function App() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard())
  const [turn, setTurn] = useState<'w' | 'b'>('w')
  const [selected, setSelected] = useState<Square | null>(null)

  const selectedPiece = selected ? board[selected.rank][selected.file] : null
  const legalMoves = useMemo(
    () => getLegalMovesForTurn(board, selected, turn),
    [board, selected, turn]
  )
  const status = useMemo(() => getGameStatus(board, turn), [board, turn])

  const handleSelect = (square: Square) => {
    if (selected && legalMoves.some((m) => m.file === square.file && m.rank === square.rank)) {
      handleMove(selected, square)
      return
    }

    const piece = board[square.rank][square.file]
    if (piece && piece.color === turn) {
      setSelected(square)
    } else {
      setSelected(null)
    }
  }

  const handleMove = (from: Square, to: Square) => {
    const moving = board[from.rank][from.file]
    if (!moving || moving.color !== turn) return
    if (!isLegalMove(board, from, to)) return

    const next = movePiece(board, from, to)
    setBoard(next)
    setTurn(otherColor(turn))
    setSelected(null)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <ChessInfo turn={turn} selectedPiece={selectedPiece} legalMoves={legalMoves} status={status} />
        <ChessBoard
          board={board}
          selected={selected}
          legalMoves={legalMoves}
          onSelect={handleSelect}
          onMove={handleMove}
        />
      </div>
    </DndProvider>
  )
}

export default App

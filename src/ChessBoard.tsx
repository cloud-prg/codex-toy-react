import type { Board, Square } from './chessTypes'
import { ChessSquare } from './ChessSquare'
import { squareKey } from './chessHelpers'

export type ChessBoardProps = {
  board: Board
  selected: Square | null
  legalMoves: Square[]
  onSelect: (square: Square) => void
  onMove: (from: Square, to: Square) => void
}

export const ChessBoard = ({
  board,
  selected,
  legalMoves,
  onSelect,
  onMove,
}: ChessBoardProps) => {
  const squares: React.ReactNode[] = []
  for (let rank = 7; rank >= 0; rank -= 1) {
    for (let file = 0; file < 8; file += 1) {
      squares.push(
        <ChessSquare
          key={squareKey({ file, rank })}
          board={board}
          square={{ file, rank }}
          selected={selected}
          legalMoves={legalMoves}
          onSelect={onSelect}
          onMove={onMove}
        />
      )
    }
  }
  return <div className="board">{squares}</div>
}

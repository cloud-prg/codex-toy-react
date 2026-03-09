import type { Piece, Square } from '../types'
import type { GameStatus } from '../chess/rules'
import { pieceText } from '../types'

export type ChessInfoProps = {
  turn: 'w' | 'b'
  selectedPiece: Piece | null
  legalMoves: Square[]
  status: GameStatus
}

const statusText = (status: GameStatus): string => {
  if (status === 'check') return '将军'
  if (status === 'checkmate') return '将死'
  if (status === 'stalemate') return '逼和'
  return '进行中'
}

export const ChessInfo = ({ turn, selectedPiece, legalMoves, status }: ChessInfoProps) => {
  return (
    <div className="info">
      <h1>Chess (Text Pieces)</h1>
      <p>Turn: {turn === 'w' ? 'White' : 'Black'}</p>
      <p>Status: {statusText(status)}</p>
      <p>Selected: {selectedPiece ? pieceText(selectedPiece) : 'None'}</p>
      <p>Legal targets: {legalMoves.length}</p>
      <p className="hint">Tip: click then move, or drag and drop</p>
    </div>
  )
}

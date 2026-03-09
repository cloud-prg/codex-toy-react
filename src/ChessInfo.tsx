import type { Piece, Square } from './chessTypes'
import { pieceText } from './chessTypes'

export type ChessInfoProps = {
  turn: 'w' | 'b'
  selectedPiece: Piece | null
  legalMoves: Square[]
}

export const ChessInfo = ({ turn, selectedPiece, legalMoves }: ChessInfoProps) => {
  return (
    <div className="info">
      <h1>Chess (文本棋子)</h1>
      <p>当前回合: {turn === 'w' ? '白方' : '黑方'}</p>
      <p>选中棋子: {selectedPiece ? pieceText(selectedPiece) : '无'}</p>
      <p>可走位置: {legalMoves.length}</p>
      <p className="hint">提示: 点击棋子后点击目标格子，或直接拖拽棋子</p>
    </div>
  )
}

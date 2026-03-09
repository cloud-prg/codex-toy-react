import { useDrag, useDrop } from 'react-dnd'
import type { Board, Square } from '../types'
import { pieceText, ItemTypes, type DragItem } from '../types'
import { canDropOnSquare, squareEquals, squareInMoves } from '../chess/helpers'

export type ChessSquareProps = {
  board: Board
  square: Square
  selected: Square | null
  legalMoves: Square[]
  onSelect: (square: Square) => void
  onMove: (from: Square, to: Square) => void
}

export const ChessSquare = ({
  board,
  square,
  selected,
  legalMoves,
  onSelect,
  onMove,
}: ChessSquareProps) => {
  const piece = board[square.rank][square.file]
  const isSelected = squareEquals(selected, square)
  const isLegal = squareInMoves(legalMoves, square)

  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item: DragItem) => onMove(item.from, square),
    canDrop: (item: DragItem) => canDropOnSquare(board, item.from, square),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [board, square, onMove])

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { from: square },
    canDrag: () => piece !== null,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [piece, square])

  const isDark = (square.file + square.rank) % 2 === 1
  const classNames = [
    'square',
    isDark ? 'square--dark' : 'square--light',
    isSelected ? 'square--selected' : '',
    isLegal ? 'square--legal' : '',
    isOver && canDrop ? 'square--drop' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={(node) => {
        dropRef(node)
      }}
      className={classNames}
      onClick={() => onSelect(square)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect(square)
      }}
    >
      {piece ? (
        <div
          ref={(node) => {
            dragRef(node)
          }}
          className="piece"
          style={{ opacity: isDragging ? 0.4 : 1 }}
        >
          {pieceText(piece)}
        </div>
      ) : null}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'
import { createInitialBoard } from './chessInit'
import { Board, Piece, Square, pieceText } from './chessTypes'
import { getMovesForSquare, isLegalMove, movePiece, otherColor } from './chessRules'

const ItemTypes = {
  PIECE: 'piece',
} as const

type DragItem = {
  from: Square
}

type SquareCellProps = {
  board: Board
  square: Square
  selected: Square | null
  legalMoves: Square[]
  onSelect: (square: Square) => void
  onMove: (from: Square, to: Square) => void
}

const SquareCell = ({
  board,
  square,
  selected,
  legalMoves,
  onSelect,
  onMove,
}: SquareCellProps) => {
  const piece = board[square.rank][square.file]
  const isSelected = selected?.file === square.file && selected?.rank === square.rank
  const isLegal = legalMoves.some(
    (m) => m.file === square.file && m.rank === square.rank
  )

  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item: DragItem) => onMove(item.from, square),
    canDrop: (item: DragItem) => isLegalMove(board, item.from, square),
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
      ref={dropRef}
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
          ref={dragRef}
          className="piece"
          style={{ opacity: isDragging ? 0.4 : 1 }}
        >
          {pieceText(piece)}
        </div>
      ) : null}
    </div>
  )
}

const BoardView = ({
  board,
  selected,
  legalMoves,
  onSelect,
  onMove,
}: {
  board: Board
  selected: Square | null
  legalMoves: Square[]
  onSelect: (square: Square) => void
  onMove: (from: Square, to: Square) => void
}) => {
  const squares: JSX.Element[] = []
  for (let rank = 7; rank >= 0; rank -= 1) {
    for (let file = 0; file < 8; file += 1) {
      squares.push(
        <SquareCell
          key={`${file}-${rank}`}
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

const InfoPanel = ({
  turn,
  selectedPiece,
  legalMoves,
}: {
  turn: 'w' | 'b'
  selectedPiece: Piece | null
  legalMoves: Square[]
}) => {
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

function App() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard())
  const [turn, setTurn] = useState<'w' | 'b'>('w')
  const [selected, setSelected] = useState<Square | null>(null)

  const selectedPiece = selected ? board[selected.rank][selected.file] : null
  const legalMoves = useMemo(() => {
    if (!selected) return []
    const piece = board[selected.rank][selected.file]
    if (!piece || piece.color !== turn) return []
    return getMovesForSquare(board, selected)
  }, [board, selected, turn])

  const handleSelect = (square: Square) => {
    const piece = board[square.rank][square.file]
    if (selected && legalMoves.some((m) => m.file === square.file && m.rank === square.rank)) {
      handleMove(selected, square)
      return
    }
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
        <InfoPanel turn={turn} selectedPiece={selectedPiece} legalMoves={legalMoves} />
        <BoardView
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

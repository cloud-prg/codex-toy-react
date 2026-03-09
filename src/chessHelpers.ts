import type { Board, Square } from './chessTypes'
import { getMovesForSquare, isLegalMove } from './chessRules'

export const squareKey = (sq: Square): string => `${sq.file}-${sq.rank}`

export const squareEquals = (a: Square | null, b: Square): boolean =>
  !!a && a.file === b.file && a.rank === b.rank

export const squareInMoves = (moves: Square[], square: Square): boolean =>
  moves.some((m) => m.file === square.file && m.rank === square.rank)

export const getLegalMovesForTurn = (
  board: Board,
  selected: Square | null,
  turn: 'w' | 'b'
): Square[] => {
  if (!selected) return []
  const piece = board[selected.rank][selected.file]
  if (!piece || piece.color !== turn) return []
  return getMovesForSquare(board, selected)
}

export const canDropOnSquare = (
  board: Board,
  from: Square,
  to: Square
): boolean => isLegalMove(board, from, to)

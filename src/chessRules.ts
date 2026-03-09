import type { Board, Color, Piece, PieceType, Square } from './chessTypes'

const inBounds = (file: number, rank: number): boolean =>
  file >= 0 && file < 8 && rank >= 0 && rank < 8

const isEnemy = (a: Piece, b: Piece | null): boolean =>
  b !== null && a.color !== b.color

const addIfEmptyOrEnemy = (
  board: Board,
  piece: Piece,
  file: number,
  rank: number,
  moves: Square[]
): boolean => {
  if (!inBounds(file, rank)) return false
  const target = board[rank][file]
  if (target === null) {
    moves.push({ file, rank })
    return true
  }
  if (isEnemy(piece, target)) {
    moves.push({ file, rank })
  }
  return false
}

const addRayMoves = (
  board: Board,
  piece: Piece,
  df: number,
  dr: number,
  from: Square,
  moves: Square[]
) => {
  let file = from.file + df
  let rank = from.rank + dr
  while (inBounds(file, rank)) {
    const target = board[rank][file]
    if (target === null) {
      moves.push({ file, rank })
    } else {
      if (isEnemy(piece, target)) {
        moves.push({ file, rank })
      }
      break
    }
    file += df
    rank += dr
  }
}

const pawnMoves = (board: Board, piece: Piece, from: Square): Square[] => {
  const moves: Square[] = []
  const dir = piece.color === 'w' ? 1 : -1
  const startRank = piece.color === 'w' ? 1 : 6

  const oneRank = from.rank + dir
  if (inBounds(from.file, oneRank) && board[oneRank][from.file] === null) {
    moves.push({ file: from.file, rank: oneRank })

    const twoRank = from.rank + dir * 2
    if (from.rank === startRank && board[twoRank][from.file] === null) {
      moves.push({ file: from.file, rank: twoRank })
    }
  }

  for (const df of [-1, 1]) {
    const file = from.file + df
    const rank = from.rank + dir
    if (!inBounds(file, rank)) continue
    const target = board[rank][file]
    if (target && isEnemy(piece, target)) {
      moves.push({ file, rank })
    }
  }

  return moves
}

const pawnAttackSquares = (piece: Piece, from: Square): Square[] => {
  const dir = piece.color === 'w' ? 1 : -1
  const squares: Square[] = []
  for (const df of [-1, 1]) {
    const file = from.file + df
    const rank = from.rank + dir
    if (inBounds(file, rank)) {
      squares.push({ file, rank })
    }
  }
  return squares
}

const knightMoves = (board: Board, piece: Piece, from: Square): Square[] => {
  const moves: Square[] = []
  const deltas = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ]
  for (const [df, dr] of deltas) {
    addIfEmptyOrEnemy(board, piece, from.file + df, from.rank + dr, moves)
  }
  return moves
}

const kingMoves = (board: Board, piece: Piece, from: Square): Square[] => {
  const moves: Square[] = []
  for (let df = -1; df <= 1; df += 1) {
    for (let dr = -1; dr <= 1; dr += 1) {
      if (df === 0 && dr === 0) continue
      addIfEmptyOrEnemy(board, piece, from.file + df, from.rank + dr, moves)
    }
  }
  return moves
}

const slidingMoves = (
  board: Board,
  piece: Piece,
  from: Square,
  dirs: Array<[number, number]>
): Square[] => {
  const moves: Square[] = []
  for (const [df, dr] of dirs) {
    addRayMoves(board, piece, df, dr, from, moves)
  }
  return moves
}

const moveSets: Record<PieceType, (board: Board, piece: Piece, from: Square) => Square[]> = {
  P: pawnMoves,
  N: knightMoves,
  B: (board, piece, from) =>
    slidingMoves(board, piece, from, [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]),
  R: (board, piece, from) =>
    slidingMoves(board, piece, from, [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]),
  Q: (board, piece, from) =>
    slidingMoves(board, piece, from, [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]),
  K: kingMoves,
}

const getPseudoMovesForSquare = (board: Board, from: Square): Square[] => {
  const piece = board[from.rank][from.file]
  if (!piece) return []
  return moveSets[piece.type](board, piece, from)
}

const findKingSquare = (board: Board, color: Color): Square | null => {
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank][file]
      if (piece?.type === 'K' && piece.color === color) {
        return { file, rank }
      }
    }
  }
  return null
}

const isSquareAttacked = (board: Board, square: Square, byColor: Color): boolean => {
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank][file]
      if (!piece || piece.color !== byColor) continue

      const from = { file, rank }
      const attacks = piece.type === 'P' ? pawnAttackSquares(piece, from) : getPseudoMovesForSquare(board, from)

      if (attacks.some((m) => m.file === square.file && m.rank === square.rank)) {
        return true
      }
    }
  }
  return false
}

export const movePiece = (board: Board, from: Square, to: Square): Board => {
  const next = board.map((row) => row.slice())
  const moving = next[from.rank][from.file]
  next[from.rank][from.file] = null
  next[to.rank][to.file] = moving
  return next
}

export const otherColor = (color: Color): Color => (color === 'w' ? 'b' : 'w')

export const isInCheck = (board: Board, color: Color): boolean => {
  const kingSquare = findKingSquare(board, color)
  if (!kingSquare) return false
  return isSquareAttacked(board, kingSquare, otherColor(color))
}

export const getMovesForSquare = (board: Board, from: Square): Square[] => {
  const piece = board[from.rank][from.file]
  if (!piece) return []

  return getPseudoMovesForSquare(board, from).filter((to) => {
    const next = movePiece(board, from, to)
    return !isInCheck(next, piece.color)
  })
}

export const isLegalMove = (board: Board, from: Square, to: Square): boolean =>
  getMovesForSquare(board, from).some((move) => move.file === to.file && move.rank === to.rank)

export const hasAnyLegalMove = (board: Board, color: Color): boolean => {
  for (let rank = 0; rank < 8; rank += 1) {
    for (let file = 0; file < 8; file += 1) {
      const piece = board[rank][file]
      if (!piece || piece.color !== color) continue
      if (getMovesForSquare(board, { file, rank }).length > 0) {
        return true
      }
    }
  }
  return false
}

export type GameStatus = 'ongoing' | 'check' | 'checkmate' | 'stalemate'

export const getGameStatus = (board: Board, turn: Color): GameStatus => {
  const check = isInCheck(board, turn)
  const hasMove = hasAnyLegalMove(board, turn)

  if (check && !hasMove) return 'checkmate'
  if (!check && !hasMove) return 'stalemate'
  if (check) return 'check'
  return 'ongoing'
}

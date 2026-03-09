import type { Board, Color, Piece, PieceType, Square } from './chessTypes'

const inBounds = (file: number, rank: number): boolean =>
  file >= 0 && file < 8 && rank >= 0 && rank < 8

const getPiece = (board: Board, sq: Square): Piece | null =>
  board[sq.rank][sq.file]

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
  let f = from.file + df
  let r = from.rank + dr
  while (inBounds(f, r)) {
    const target = board[r][f]
    if (target === null) {
      moves.push({ file: f, rank: r })
    } else {
      if (isEnemy(piece, target)) moves.push({ file: f, rank: r })
      break
    }
    f += df
    r += dr
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
    if (
      from.rank === startRank &&
      board[twoRank][from.file] === null
    ) {
      moves.push({ file: from.file, rank: twoRank })
    }
  }

  for (const df of [-1, 1]) {
    const f = from.file + df
    const r = from.rank + dir
    if (!inBounds(f, r)) continue
    const target = board[r][f]
    if (target && isEnemy(piece, target)) {
      moves.push({ file: f, rank: r })
    }
  }

  return moves
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
  B: (b, p, f) => slidingMoves(b, p, f, [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]),
  R: (b, p, f) => slidingMoves(b, p, f, [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]),
  Q: (b, p, f) => slidingMoves(b, p, f, [
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

export const getMovesForSquare = (
  board: Board,
  from: Square
): Square[] => {
  const piece = getPiece(board, from)
  if (!piece) return []
  return moveSets[piece.type](board, piece, from)
}

export const isLegalMove = (
  board: Board,
  from: Square,
  to: Square
): boolean => {
  return getMovesForSquare(board, from).some(
    (m) => m.file === to.file && m.rank === to.rank
  )
}

export const movePiece = (
  board: Board,
  from: Square,
  to: Square
): Board => {
  const next = board.map((row) => row.slice())
  const piece = next[from.rank][from.file]
  next[from.rank][from.file] = null
  next[to.rank][to.file] = piece
  return next
}

export const otherColor = (color: Color): Color => (color === 'w' ? 'b' : 'w')

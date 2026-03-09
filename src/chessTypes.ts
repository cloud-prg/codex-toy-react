export type Color = 'w' | 'b'
export type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P'

export type Piece = {
  type: PieceType
  color: Color
}

export type Square = {
  file: number // 0..7 (a..h)
  rank: number // 0..7 (1..8)
}

export type Board = (Piece | null)[][]

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

export const pieceText = (piece: Piece): string => {
  const map: Record<PieceType, string> = {
    K: 'K',
    Q: 'Q',
    R: 'R',
    B: 'B',
    N: 'N',
    P: 'P',
  }
  return piece.color === 'w' ? map[piece.type] : map[piece.type].toLowerCase()
}

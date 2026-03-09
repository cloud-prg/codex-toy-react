import { Board, Piece } from './chessTypes'

const emptyRow = (): (Piece | null)[] => Array.from({ length: 8 }, () => null)

export const createInitialBoard = (): Board => {
  const board: Board = Array.from({ length: 8 }, () => emptyRow())

  const backRank = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'] as const

  for (let file = 0; file < 8; file += 1) {
    board[1][file] = { type: 'P', color: 'w' }
    board[6][file] = { type: 'P', color: 'b' }
    board[0][file] = { type: backRank[file], color: 'w' }
    board[7][file] = { type: backRank[file], color: 'b' }
  }

  return board
}

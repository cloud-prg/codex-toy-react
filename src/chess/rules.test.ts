import { describe, expect, it } from 'vitest'
import { createInitialBoard } from './init'
import { getMovesForSquare, movePiece } from './rules'

const sq = (file: number, rank: number) => ({ file, rank })

describe('chess rules', () => {
  it('initial pawns have one/two step moves', () => {
    const board = createInitialBoard()
    const moves = getMovesForSquare(board, sq(0, 1))
    expect(moves).toEqual(
      expect.arrayContaining([sq(0, 2), sq(0, 3)])
    )
  })

  it('blocked pawn has no forward moves', () => {
    const board = createInitialBoard()
    const next = movePiece(board, sq(0, 1), sq(0, 2))
    const moves = getMovesForSquare(next, sq(0, 1))
    expect(moves).toEqual([])
  })

  it('knight can jump over pieces', () => {
    const board = createInitialBoard()
    const moves = getMovesForSquare(board, sq(1, 0))
    expect(moves).toEqual(expect.arrayContaining([sq(0, 2), sq(2, 2)]))
  })
})

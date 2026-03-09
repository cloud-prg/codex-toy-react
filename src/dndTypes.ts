import type { Square } from './chessTypes'

export const ItemTypes = {
  PIECE: 'piece',
} as const

export type DragItem = {
  from: Square
}

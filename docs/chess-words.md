# 棋盘用语：file、rank、Square、moves

## Square（格子）

**Square = 棋盘上的「一个格子」**，在代码里就是一个坐标：

```ts
type Square = {
  file: number  // 横着看是第几列
  rank: number // 竖着看是第几行
}
```

例如 `{ file: 0, rank: 0 }` 表示左下角那一格，`{ file: 7, rank: 7 }` 表示右上角。

---

## file（列）

**file = 横着的「列」**，从左到右。

- 国际象棋里通常叫 a 列、b 列 … h 列（共 8 列）
- 代码里用数字：**0, 1, 2, 3, 4, 5, 6, 7**（0 是 a，7 是 h）

```
  a   b   c   d   e   f   g   h     ← 国际象棋叫法
  0   1   2   3   4   5   6   7     ← 代码里的 file
```

---

## rank（行）

**rank = 竖着的「行」**，从下到上（白方视角的「从近到远」）。

- 国际象棋里通常叫 1 行、2 行 … 8 行（共 8 行）
- 代码里用数字：**0, 1, 2, 3, 4, 5, 6, 7**（0 是 1 行，7 是 8 行）

```
  rank 7  ← 第 8 行（黑方底线）
  rank 6
  rank 5
  ...
  rank 1
  rank 0  ← 第 1 行（白方底线）
```

---

## 棋盘示意图（代码里的 file / rank）

```
         file: 0  1  2  3  4  5  6  7
              (a)(b)(c)(d)(e)(f)(g)(h)
rank 7  →  [  ♜  ♞  ♝  ♛  ♚  ♝  ♞  ♜  ]  黑方
rank 6  →  [  ♟  ♟  ♟  ♟  ♟  ♟  ♟  ♟  ]
rank 5  →  [  ·  ·  ·  ·  ·  ·  ·  ·  ]
rank 4  →  [  ·  ·  ·  ·  ·  ·  ·  ·  ]
rank 3  →  [  ·  ·  ·  ·  ·  ·  ·  ·  ]
rank 2  →  [  ♙  ♙  ♙  ♙  ♙  ♙  ♙  ♙  ]
rank 1  →  [  ♖  ♘  ♗  ♕  ♔  ♗  ♘  ♖  ]  白方
rank 0  →  (第1行)
```

- 左下角格子：`file: 0, rank: 0`（白方左车）
- 右下角格子：`file: 7, rank: 0`（白方右车）
- 棋盘是 `board[rank][file]`：先写「第几行」，再写「第几列」

---

## moves（走法 / 可走的格子）

**moves = 当前这步棋「可以走到的那些格子」**，类型是 **Square 的数组**（`Square[]`）。

- 例如：你点了白方 e2 的兵，它的 `moves` 可能是 `[{ file: 4, rank: 2 }, { file: 4, rank: 3 }]`（直走一格或两格）
- 例如：你点了马，`moves` 就是它能跳到的几个格子的列表

所以：

- **Square** = 一个格子 = `{ file, rank }`
- **moves** = 很多格子 = `Square[]`，表示「能走到的所有目标格」

---

## 和类型定义对照

| 概念 | 类型 | 含义 |
|------|------|------|
| 一个格子 | `Square` | `{ file: number, rank: number }` |
| 很多格子（走法） | `Square[]` | 例如某棋子的合法目标格列表 |
| 整张棋盘 | `Board` | `(Piece \| null)[][]`，即 `board[rank][file]` 是该格上的棋子或空 |

取棋盘上某格的棋子：

```ts
const piece = board[square.rank][square.file]
// 先按行 rank，再按列 file
```

# chess/rules.ts 方法说明

## 一、内部工具（不导出）

| 方法 | 作用 |
|------|------|
| **`inBounds(file, rank)`** | 判断坐标是否在棋盘内（0≤file,rank<8）。 |
| **`isEnemy(a, b)`** | 判断两子是否敌对：`b` 非空且颜色与 `a` 不同。 |
| **`addReachableSquareReturnCanExtendRay(...)`** | 若格可达（空或敌）则加入 `moves`；返回值表示**射线能否继续延伸**（空=true，敌/己/越界=false）。用于王、马等。 |
| **`addRayMoves(...)`** | 沿方向 `(df, dr)` 做射线：从 `from` 出发，空格加入、遇到子则若是敌方也加入然后停，己方则只停。用于车、象、后的直线/斜线。 |
| **`pawnMoves(...)`** | 兵的**伪合法**走法：直走 1 格（或起始行 2 格）、斜吃 1 格。不含吃过路兵。 |
| **`pawnAttackSquares(...)`** | 兵从某格能**攻击到的格子**（斜前两格），不关心是否有子。用于判断“是否被兵将军”。 |
| **`knightMoves(...)`** | 马的 8 个 L 形格，用 `addIfEmptyOrEnemy` 筛掉越界和己方。 |
| **`kingMoves(...)`** | 王周围 8 格，同样用 `addIfEmptyOrEnemy`。 |
| **`slidingMoves(...)`** | 给定多个方向 `dirs`，对每个方向调用 `addRayMoves`，用于象/车/后。 |
| **`moveSets`** | 按兵种分发的走法表：`P→pawnMoves`，`N→knightMoves`，`B/R/Q` 用不同方向的 `slidingMoves`，`K→kingMoves`。 |
| **`getPseudoMovesForSquare(board, from)`** | 某格棋子的**伪合法走法**（不考虑“走完是否被将军”）。 |
| **`findKingSquare(board, color)`** | 在棋盘上找到某方王的格子。 |
| **`isSquareAttacked(board, square, byColor)`** | 某格是否被 `byColor` 一方**攻击到**（任一子能走到/攻击到该格）。 |

---

## 二、对外导出（给 App / helpers 用）

| 方法 | 作用 |
|------|------|
| **`movePiece(board, from, to)`** | 在棋盘上执行一步：`from` 移到 `to`，返回新棋盘（不校验是否合法）。 |
| **`otherColor(color)`** | 白↔黑：`'w'`→`'b'`，`'b'`→`'w'`。 |
| **`isInCheck(board, color)`** | `color` 方的王是否被将军（王所在格是否被对方攻击）。 |
| **`getMovesForSquare(board, from)`** | **合法走法**：先取伪合法，再过滤掉“走完己方被将军”的走法。 |
| **`isLegalMove(board, from, to)`** | 从 `from` 到 `to` 这一步是否在合法走法列表里。 |
| **`hasAnyLegalMove(board, color)`** | `color` 方是否还有任意一步合法走法（用于判将死/逼和）。 |
| **`getGameStatus(board, turn)`** | 当前局面状态：`'checkmate'` 将死、`'stalemate'` 逼和、`'check'` 将军、`'ongoing'` 进行中。 |

---

## 三、调用关系简图

```
getGameStatus
  → isInCheck, hasAnyLegalMove
       → findKingSquare, isSquareAttacked, getMovesForSquare
              → getPseudoMovesForSquare → moveSets → 各兵种走法
              → movePiece, isInCheck（过滤自将）

getMovesForSquare
  → getPseudoMovesForSquare
  → movePiece + isInCheck（过滤）
```

---

## 四、概念区分

- **伪合法（pseudo-legal）**：符合该兵种规则、不关心走完是否被将军。
- **合法（legal）**：伪合法里再排除“走完己方王被将军”的步。
- **攻击（attack）**：某子能否打到某格（兵用斜线，其他用走法）。

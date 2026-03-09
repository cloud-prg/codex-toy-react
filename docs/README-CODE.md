# 代码阅读指南

## 目录结构

```
src/
├── main.tsx              # 唯一入口：挂载 React 根组件
├── index.css             # 全局样式
├── types/
│   └── index.ts          # 类型主文件：棋盘/棋子/拖拽类型统一从这里导入
├── chess/                # 棋盘逻辑（纯 TS，无 UI）
│   ├── init.ts           # 初始棋盘
│   ├── rules.ts          # 走子规则、胜负判定
│   ├── helpers.ts        # 合法走法、格子工具函数
│   └── rules.test.ts     # 规则单测
├── components/           # React 组件
│   ├── App.tsx           # 根组件：状态 + 事件
│   ├── App.css
│   ├── ChessBoard.tsx    # 8×8 棋盘
│   ├── ChessSquare.tsx   # 单格（点击/拖拽）
│   └── ChessInfo.tsx     # 回合/状态展示
└── test/
    └── setup.ts          # 测试环境
```

## 建议阅读顺序

1. **`src/types/index.ts`** — 先弄清 `Piece`、`Square`、`Board`、`DragItem` 等数据结构。
2. **`src/chess/init.ts`** — 棋盘如何初始化。
3. **`src/chess/rules.ts`** — 走子是否合法、执行走子、将军/将死/逼和。
4. **`src/chess/helpers.ts`** — 当前选中格子的合法走法、拖拽是否可放。
5. **`src/components/App.tsx`** — 状态（board / turn / selected）与 handleSelect、handleMove。
6. **`src/components/ChessBoard.tsx`** → **`ChessSquare.tsx`** — 棋盘与单格渲染、点击/拖拽如何触发 onSelect、onMove。
7. **`src/components/ChessInfo.tsx`** — 仅展示，无状态。

## 导入约定

- 类型统一从 `../types` 或 `@/types` 导入（仅此一个入口）。
- 棋盘逻辑从 `../chess/xxx` 导入。
- 组件之间用相对路径 `./ChessBoard` 等。

export type CellValue = number | null;

export type Board = CellValue[][];

export type Difficulty = "easy" | "normal" | "hard";

export type GameStatus = "playing" | "won" | "lost";

export interface CellPosition {
  row: number;
  col: number;
}

export interface GameState {
  board: Board;
  solution: Board;
  initialBoard: Board;
  selected: CellPosition | null;
  lives: number;
  hints: number;
  status: GameStatus;
  difficulty: Difficulty;
  mistakes: Set<string>;
}

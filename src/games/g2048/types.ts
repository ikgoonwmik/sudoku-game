export type Direction = "up" | "down" | "left" | "right";

export type GameStatus = "playing" | "won" | "lost";

export interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  best: number;
  status: GameStatus;
  hasWonOnce: boolean;
}

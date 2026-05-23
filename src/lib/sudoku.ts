import type { Board, CellValue, Difficulty } from "../types/sudoku";

const SIZE = 9;
const BOX = 3;

const createEmptyBoard = (): Board =>
  Array.from({ length: SIZE }, () => Array<CellValue>(SIZE).fill(null));

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const isValidPlacement = (
  board: Board,
  row: number,
  col: number,
  num: number,
): boolean => {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = boxRow; r < boxRow + BOX; r++) {
    for (let c = boxCol; c < boxCol + BOX; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
};

const fillBoard = (board: Board): boolean => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === null) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const generateSolution = (): Board => {
  const board = createEmptyBoard();
  fillBoard(board);
  return board;
};

const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

const removeCells = (board: Board, count: number): Board => {
  const result = cloneBoard(board);
  const positions = shuffle(Array.from({ length: SIZE * SIZE }, (_, i) => i));
  let removed = 0;
  for (const pos of positions) {
    if (removed >= count) break;
    const row = Math.floor(pos / SIZE);
    const col = pos % SIZE;
    if (result[row][col] !== null) {
      result[row][col] = null;
      removed++;
    }
  }
  return result;
};

const REMOVE_COUNT: Record<Difficulty, number> = {
  easy: 35,
  normal: 45,
  hard: 55,
};

export const generatePuzzle = (
  difficulty: Difficulty,
): { puzzle: Board; solution: Board } => {
  const solution = generateSolution();
  const puzzle = removeCells(solution, REMOVE_COUNT[difficulty]);
  return { puzzle, solution };
};

export const isBoardComplete = (board: Board): boolean => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null) return false;
    }
  }
  return true;
};

export const findEmptyCells = (
  board: Board,
): { row: number; col: number }[] => {
  const empty: { row: number; col: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null) empty.push({ row: r, col: c });
    }
  }
  return empty;
};

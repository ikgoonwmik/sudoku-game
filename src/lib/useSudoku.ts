import { useCallback, useState } from "react";
import type {
  Board,
  CellPosition,
  Difficulty,
  GameState,
  GameStatus,
} from "../types/sudoku";
import { findEmptyCells, generatePuzzle, isBoardComplete } from "./sudoku";

const MAX_LIVES = 3;
const MAX_HINTS = 2;

const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

const createInitialState = (difficulty: Difficulty): GameState => {
  const { puzzle, solution } = generatePuzzle(difficulty);
  return {
    board: cloneBoard(puzzle),
    solution,
    initialBoard: cloneBoard(puzzle),
    selected: null,
    lives: MAX_LIVES,
    hints: MAX_HINTS,
    status: "playing",
    difficulty,
    mistakes: new Set<string>(),
  };
};

export const useSudoku = (initialDifficulty: Difficulty = "easy") => {
  const [state, setState] = useState<GameState>(() =>
    createInitialState(initialDifficulty),
  );

  const newGame = useCallback((difficulty: Difficulty) => {
    setState(createInitialState(difficulty));
  }, []);

  const selectCell = useCallback((pos: CellPosition) => {
    setState((prev) => {
      if (prev.status !== "playing") return prev;
      return { ...prev, selected: pos };
    });
  }, []);

  const inputNumber = useCallback((num: number) => {
    setState((prev) => {
      if (prev.status !== "playing" || !prev.selected) return prev;
      const { row, col } = prev.selected;

      if (prev.initialBoard[row][col] !== null) return prev;

      const key = `${row}-${col}`;
      const newBoard = cloneBoard(prev.board);
      newBoard[row][col] = num;

      const isCorrect = prev.solution[row][col] === num;
      const newMistakes = new Set(prev.mistakes);
      let newLives = prev.lives;

      if (isCorrect) {
        newMistakes.delete(key);
      } else {
        if (!newMistakes.has(key)) {
          newLives = prev.lives - 1;
        }
        newMistakes.add(key);
      }

      let status: GameStatus = prev.status;
      if (newLives <= 0) {
        status = "lost";
      } else if (isBoardComplete(newBoard) && newMistakes.size === 0) {
        status = "won";
      }

      return {
        ...prev,
        board: newBoard,
        lives: newLives,
        mistakes: newMistakes,
        status,
      };
    });
  }, []);

  const eraseCell = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing" || !prev.selected) return prev;
      const { row, col } = prev.selected;
      if (prev.initialBoard[row][col] !== null) return prev;

      const newBoard = cloneBoard(prev.board);
      newBoard[row][col] = null;
      const newMistakes = new Set(prev.mistakes);
      newMistakes.delete(`${row}-${col}`);

      return { ...prev, board: newBoard, mistakes: newMistakes };
    });
  }, []);

  const useHint = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "playing" || prev.hints <= 0) return prev;

      const empties = findEmptyCells(prev.board);
      const wrongCells = Array.from(prev.mistakes).map((key) => {
        const [r, c] = key.split("-").map(Number);
        return { row: r, col: c };
      });

      const targets = [...empties, ...wrongCells];
      if (targets.length === 0) return prev;

      const target = targets[Math.floor(Math.random() * targets.length)];
      const { row, col } = target;
      const answer = prev.solution[row][col];

      const newBoard = cloneBoard(prev.board);
      newBoard[row][col] = answer;
      const newMistakes = new Set(prev.mistakes);
      newMistakes.delete(`${row}-${col}`);

      let status: GameStatus = prev.status;
      if (isBoardComplete(newBoard) && newMistakes.size === 0) {
        status = "won";
      }

      return {
        ...prev,
        board: newBoard,
        hints: prev.hints - 1,
        mistakes: newMistakes,
        status,
        selected: { row, col },
      };
    });
  }, []);

  return {
    state,
    newGame,
    selectCell,
    inputNumber,
    eraseCell,
    useHint,
  };
};

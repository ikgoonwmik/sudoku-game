import { useCallback, useEffect, useRef, useState } from "react";
import {
  addRandomTileTo,
  canMove,
  cleanupMergedTiles,
  createInitialTiles,
  hasReached,
  move,
} from "./g2048";
import type { Direction, GameState, GameStatus, Tile } from "./types";

const BEST_KEY = "g2048_best";
const ANIMATION_MS = 130;

const loadBest = (): number => {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

const saveBest = (value: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // ignore
  }
};

const createInitialState = (best: number): GameState => ({
  tiles: createInitialTiles(),
  score: 0,
  best,
  status: "playing",
  hasWonOnce: false,
});

export const use2048 = () => {
  const [state, setState] = useState<GameState>(() =>
    createInitialState(loadBest()),
  );
  const lockRef = useRef(false);

  useEffect(() => {
    saveBest(state.best);
  }, [state.best]);

  const newGame = useCallback(() => {
    lockRef.current = false;
    setState((prev) => createInitialState(prev.best));
  }, []);

  const handleMove = useCallback((direction: Direction) => {
    if (lockRef.current) return;

    setState((prev) => {
      if (prev.status === "lost") return prev;

      const result = move(prev.tiles, direction);
      if (!result.moved) return prev;

      lockRef.current = true;

      const nextScore = prev.score + result.gained;
      const nextBest = Math.max(prev.best, nextScore);

      return {
        ...prev,
        tiles: result.tiles,
        score: nextScore,
        best: nextBest,
      };
    });

    window.setTimeout(() => {
      setState((prev) => {
        const cleaned = cleanupMergedTiles(prev.tiles);
        const withNew: Tile[] = [...cleaned];
        addRandomTileTo(withNew);

        let status: GameStatus = prev.status;
        let hasWonOnce = prev.hasWonOnce;
        if (!hasWonOnce && hasReached(withNew)) {
          hasWonOnce = true;
          status = "won";
        } else if (!canMove(withNew)) {
          status = "lost";
        }

        lockRef.current = false;

        return {
          ...prev,
          tiles: withNew,
          status,
          hasWonOnce,
        };
      });
    }, ANIMATION_MS);
  }, []);

  const continueAfterWin = useCallback(() => {
    setState((prev) => ({ ...prev, status: "playing" }));
  }, []);

  return {
    state,
    newGame,
    handleMove,
    continueAfterWin,
  };
};

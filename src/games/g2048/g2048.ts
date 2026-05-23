import type { Direction, Tile } from "./types";

export const SIZE = 4;
const WIN_VALUE = 2048;

let nextId = 1;
const genId = () => nextId++;

const createTile = (
  row: number,
  col: number,
  value: number,
  isNew = false,
  isMerged = false,
): Tile => ({
  id: genId(),
  value,
  row,
  col,
  isNew,
  isMerged,
});

export const createInitialTiles = (): Tile[] => {
  const tiles: Tile[] = [];
  addRandomTileTo(tiles);
  addRandomTileTo(tiles);
  return tiles;
};

const isCellEmpty = (tiles: Tile[], row: number, col: number): boolean =>
  !tiles.some((t) => t.row === row && t.col === col);

export const addRandomTileTo = (tiles: Tile[]): Tile[] => {
  const empties: { row: number; col: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (isCellEmpty(tiles, r, c)) empties.push({ row: r, col: c });
    }
  }
  if (empties.length === 0) return tiles;
  const target = empties[Math.floor(Math.random() * empties.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  tiles.push(createTile(target.row, target.col, value, true, false));
  return tiles;
};

const transformPoint = (
  row: number,
  col: number,
  direction: Direction,
): { row: number; col: number } => {
  switch (direction) {
    case "left":
      return { row, col };
    case "right":
      return { row, col: SIZE - 1 - col };
    case "up":
      return { row: SIZE - 1 - col, col: row };
    case "down":
      return { row: col, col: SIZE - 1 - row };
  }
};

const inversePoint = (
  row: number,
  col: number,
  direction: Direction,
): { row: number; col: number } => {
  switch (direction) {
    case "left":
      return { row, col };
    case "right":
      return { row, col: SIZE - 1 - col };
    case "up":
      return { row: col, col: SIZE - 1 - row };
    case "down":
      return { row: SIZE - 1 - col, col: row };
  }
};

export const move = (
  tiles: Tile[],
  direction: Direction,
): { tiles: Tile[]; gained: number; moved: boolean } => {
  const cleaned: Tile[] = tiles.map((t) => ({
    ...t,
    isNew: false,
    isMerged: false,
  }));

  const projected = cleaned.map((t) => {
    const p = transformPoint(t.row, t.col, direction);
    return { tile: t, pRow: p.row, pCol: p.col };
  });

  const rows: (typeof projected)[] = Array.from({ length: SIZE }, () => []);
  projected.forEach((p) => rows[p.pRow].push(p));
  rows.forEach((row) => row.sort((a, b) => a.pCol - b.pCol));

  const resultTiles: Tile[] = [];
  let gained = 0;
  let moved = false;

  for (let r = 0; r < SIZE; r++) {
    const lane = rows[r];
    let writeCol = 0;
    let i = 0;
    while (i < lane.length) {
      const current = lane[i];
      const next = lane[i + 1];

      if (next && current.tile.value === next.tile.value) {
        const newValue = current.tile.value * 2;
        gained += newValue;

        const dest = inversePoint(r, writeCol, direction);

        const movedCurrent: Tile = {
          ...current.tile,
          row: dest.row,
          col: dest.col,
        };
        const movedNext: Tile = {
          ...next.tile,
          row: dest.row,
          col: dest.col,
        };

        resultTiles.push(movedCurrent);
        resultTiles.push(movedNext);

        resultTiles.push(createTile(dest.row, dest.col, newValue, false, true));

        moved = true;
        i += 2;
        writeCol += 1;
      } else {
        const dest = inversePoint(r, writeCol, direction);
        const movedTile: Tile = {
          ...current.tile,
          row: dest.row,
          col: dest.col,
        };
        if (
          movedTile.row !== current.tile.row ||
          movedTile.col !== current.tile.col
        ) {
          moved = true;
        }
        resultTiles.push(movedTile);
        i += 1;
        writeCol += 1;
      }
    }
  }

  return {
    tiles: resultTiles,
    gained,
    moved,
  };
};

export const cleanupMergedTiles = (tiles: Tile[]): Tile[] => {
  const survivorIds = new Set<number>();
  const byPosition = new Map<string, Tile[]>();

  tiles.forEach((t) => {
    const key = `${t.row}-${t.col}`;
    if (!byPosition.has(key)) byPosition.set(key, []);
    byPosition.get(key)!.push(t);
  });

  byPosition.forEach((group) => {
    if (group.length === 1) {
      survivorIds.add(group[0].id);
    } else {
      const merged = group.find((t) => t.isMerged);
      if (merged) survivorIds.add(merged.id);
    }
  });

  return tiles
    .filter((t) => survivorIds.has(t.id))
    .map((t) => ({ ...t, isNew: false, isMerged: false }));
};

export const hasReached = (
  tiles: Tile[],
  target: number = WIN_VALUE,
): boolean => tiles.some((t) => t.value >= target);

export const canMove = (tiles: Tile[]): boolean => {
  const grid: number[][] = Array.from({ length: SIZE }, () =>
    Array<number>(SIZE).fill(0),
  );
  tiles.forEach((t) => {
    grid[t.row][t.col] = t.value;
  });

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (r + 1 < SIZE && grid[r + 1][c] === grid[r][c]) return true;
      if (c + 1 < SIZE && grid[r][c + 1] === grid[r][c]) return true;
    }
  }
  return false;
};

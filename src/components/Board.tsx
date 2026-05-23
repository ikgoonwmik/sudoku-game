import type { Board as BoardType, CellPosition } from "../types/sudoku";
import Cell from "./Cell";
import styles from "../styles/Board.module.css";

interface BoardProps {
  board: BoardType;
  initialBoard: BoardType;
  selected: CellPosition | null;
  mistakes: Set<string>;
  onSelect: (pos: CellPosition) => void;
}

const Board = ({
  board,
  initialBoard,
  selected,
  mistakes,
  onSelect,
}: BoardProps) => {
  const selectedValue =
    selected !== null ? board[selected.row][selected.col] : null;

  return (
    <div className={styles.board}>
      {board.map((row, rIdx) =>
        row.map((value, cIdx) => {
          const isSelected =
            selected !== null && selected.row === rIdx && selected.col === cIdx;

          const isHighlighted =
            selected !== null &&
            (selected.row === rIdx ||
              selected.col === cIdx ||
              (Math.floor(selected.row / 3) === Math.floor(rIdx / 3) &&
                Math.floor(selected.col / 3) === Math.floor(cIdx / 3)));

          const isSameNumber =
            !isSelected &&
            selectedValue !== null &&
            value !== null &&
            value === selectedValue;

          return (
            <Cell
              key={`${rIdx}-${cIdx}`}
              value={value}
              row={rIdx}
              col={cIdx}
              isInitial={initialBoard[rIdx][cIdx] !== null}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              isSameNumber={isSameNumber}
              isMistake={mistakes.has(`${rIdx}-${cIdx}`)}
              onClick={() => onSelect({ row: rIdx, col: cIdx })}
            />
          );
        }),
      )}
    </div>
  );
};

export default Board;

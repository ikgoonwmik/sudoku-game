import type { CellValue } from "./types";
import styles from "../../styles/Cell.module.css";

interface CellProps {
  value: CellValue;
  row: number;
  col: number;
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isSameNumber: boolean;
  isMistake: boolean;
  onClick: () => void;
}

const Cell = ({
  value,
  row,
  col,
  isInitial,
  isSelected,
  isHighlighted,
  isSameNumber,
  isMistake,
  onClick,
}: CellProps) => {
  const classes = [styles.cell];

  if (col === 2 || col === 5) classes.push(styles.borderRight);
  if (row === 2 || row === 5) classes.push(styles.borderBottom);
  if (isSelected) classes.push(styles.selected);
  else if (isSameNumber) classes.push(styles.sameNumber);
  else if (isHighlighted) classes.push(styles.highlighted);
  if (isInitial) classes.push(styles.initial);
  if (isMistake) classes.push(styles.mistake);

  return (
    <button type="button" className={classes.join(" ")} onClick={onClick}>
      {value ?? ""}
    </button>
  );
};

export default Cell;

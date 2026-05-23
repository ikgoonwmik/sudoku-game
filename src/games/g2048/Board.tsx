import Tile from "./Tile";
import type { Tile as TileType } from "./types";
import styles from "../../styles/Board2048.module.css";

interface BoardProps {
  tiles: TileType[];
}

const Board = ({ tiles }: BoardProps) => {
  const backgroundCells = Array.from({ length: 16 }, (_, i) => (
    <div key={i} className={styles.bgCell} />
  ));

  return (
    <div className={styles.board}>
      <div className={styles.bgGrid}>{backgroundCells}</div>
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </div>
  );
};

export default Board;

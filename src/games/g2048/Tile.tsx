import type { Tile as TileType } from "./types";
import styles from "../../styles/Tile.module.css";

interface TileProps {
  tile: TileType;
}

const getTileClass = (value: number): string => {
  if (value <= 4) return styles.tile2;
  if (value <= 8) return styles.tile8;
  if (value <= 16) return styles.tile16;
  if (value <= 32) return styles.tile32;
  if (value <= 64) return styles.tile64;
  if (value <= 128) return styles.tile128;
  if (value <= 256) return styles.tile256;
  if (value <= 512) return styles.tile512;
  if (value <= 1024) return styles.tile1024;
  return styles.tile2048;
};

const Tile = ({ tile }: TileProps) => {
  const sizeClass =
    tile.value >= 1024 ? styles.small : tile.value >= 128 ? styles.medium : "";

  const animClass = tile.isNew
    ? styles.appear
    : tile.isMerged
      ? styles.pop
      : "";

  const style = {
    "--row": tile.row,
    "--col": tile.col,
  } as React.CSSProperties;

  return (
    <div
      className={`${styles.tile} ${getTileClass(tile.value)} ${sizeClass} ${animClass}`}
      style={style}
    >
      {tile.value}
    </div>
  );
};

export default Tile;

import type { Difficulty } from "../types/sudoku";
import styles from "../styles/Controls.module.css";

interface ControlsProps {
  difficulty: Difficulty;
  lives: number;
  hints: number;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onHint: () => void;
  onNewGame: () => void;
  hintDisabled: boolean;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "쉬움",
  normal: "보통",
  hard: "어려움",
};

const Controls = ({
  difficulty,
  lives,
  hints,
  onChangeDifficulty,
  onHint,
  onNewGame,
  hintDisabled,
}: ControlsProps) => {
  return (
    <div className={styles.controls}>
      <div className={styles.difficulty}>
        {(["easy", "normal", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            type="button"
            className={
              d === difficulty
                ? `${styles.diffButton} ${styles.diffActive}`
                : styles.diffButton
            }
            onClick={() => onChangeDifficulty(d)}
          >
            {DIFFICULTY_LABEL[d]}
          </button>
        ))}
      </div>

      <div className={styles.status}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>목숨</span>
          <span className={styles.statusValue}>{lives} / 3</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>힌트</span>
          <span className={styles.statusValue}>{hints} / 2</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionButton}
          onClick={onHint}
          disabled={hintDisabled}
        >
          힌트 사용
        </button>
        <button
          type="button"
          className={`${styles.actionButton} ${styles.primary}`}
          onClick={onNewGame}
        >
          새 게임
        </button>
      </div>
    </div>
  );
};

export default Controls;

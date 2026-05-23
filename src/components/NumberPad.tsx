import styles from "../styles/NumberPad.module.css";

interface NumberPadProps {
  onInput: (num: number) => void;
  onErase: () => void;
  disabled: boolean;
}

const NumberPad = ({ onInput, onErase, disabled }: NumberPadProps) => {
  return (
    <div className={styles.pad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button
          key={n}
          type="button"
          className={styles.numButton}
          onClick={() => onInput(n)}
          disabled={disabled}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        className={styles.eraseButton}
        onClick={onErase}
        disabled={disabled}
      >
        지우기
      </button>
    </div>
  );
};

export default NumberPad;

import { useState } from "react";
import { Link } from "react-router-dom";
import Board from "../games/sudoku/Board";
import Controls from "../games/sudoku/Controls";
import NumberPad from "../games/sudoku/NumberPad";
import { useSudoku } from "../games/sudoku/useSudoku";
import type { Difficulty } from "../games/sudoku/types";
import styles from "../styles/App.module.css";

const SudokuPage = () => {
  const { state, newGame, selectCell, inputNumber, eraseCell, useHint } =
    useSudoku("easy");

  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(
    null,
  );

  const handleChangeDifficulty = (difficulty: Difficulty) => {
    if (difficulty === state.difficulty) return;
    setPendingDifficulty(difficulty);
  };

  const confirmNewGame = () => {
    const target = pendingDifficulty ?? state.difficulty;
    newGame(target);
    setPendingDifficulty(null);
  };

  const cancelNewGame = () => {
    setPendingDifficulty(null);
  };

  const isPlaying = state.status === "playing";
  const showResultModal = state.status === "won" || state.status === "lost";
  const showConfirmModal = pendingDifficulty !== null;

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.header}>
          <Link to="/" className={styles.backLink}>
            ← 메인으로
          </Link>
          <h1 className={styles.title}>SUDOKU</h1>
          <p className={styles.subtitle}>숫자를 채워 9x9 보드를 완성하세요</p>
        </header>

        <Controls
          difficulty={state.difficulty}
          lives={state.lives}
          hints={state.hints}
          onChangeDifficulty={handleChangeDifficulty}
          onHint={useHint}
          onNewGame={() => newGame(state.difficulty)}
          hintDisabled={!isPlaying || state.hints <= 0}
        />

        <Board
          board={state.board}
          initialBoard={state.initialBoard}
          selected={state.selected}
          mistakes={state.mistakes}
          onSelect={selectCell}
        />

        <NumberPad
          onInput={inputNumber}
          onErase={eraseCell}
          disabled={!isPlaying || state.selected === null}
        />
      </main>

      {showResultModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {state.status === "won" ? "클리어" : "게임 오버"}
            </h2>
            <p className={styles.modalText}>
              {state.status === "won"
                ? "모든 칸을 정확히 채웠습니다"
                : "목숨을 모두 잃었습니다"}
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalButton}
                onClick={() => newGame(state.difficulty)}
              >
                같은 난이도로 다시
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>난이도 변경</h2>
            <p className={styles.modalText}>
              새 게임을 시작합니다. 진행 중인 게임은 사라집니다
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalButtonSecondary}
                onClick={cancelNewGame}
              >
                취소
              </button>
              <button
                type="button"
                className={styles.modalButton}
                onClick={confirmNewGame}
              >
                시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SudokuPage;

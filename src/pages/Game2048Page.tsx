import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Board from "../games/g2048/Board";
import { use2048 } from "../games/g2048/use2048";
import { useSwipe } from "../games/g2048/useSwipe";
import type { Direction } from "../games/g2048/types";
import styles from "../styles/Game2048.module.css";

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
  W: "up",
  S: "down",
  A: "left",
  D: "right",
};

const Game2048Page = () => {
  const { state, newGame, handleMove, continueAfterWin } = use2048();
  const boardRef = useRef<HTMLDivElement>(null);

  useSwipe(boardRef, handleMove);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const direction = KEY_TO_DIRECTION[e.key];
      if (!direction) return;
      e.preventDefault();
      handleMove(direction);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  const showWonModal = state.status === "won";
  const showLostModal = state.status === "lost";

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.header}>
          <Link to="/" className={styles.backLink}>
            ← 메인으로
          </Link>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>2048</h1>
            <div className={styles.scores}>
              <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>SCORE</div>
                <div className={styles.scoreValue}>{state.score}</div>
              </div>
              <div className={styles.scoreBox}>
                <div className={styles.scoreLabel}>BEST</div>
                <div className={styles.scoreValue}>{state.best}</div>
              </div>
            </div>
          </div>
          <p className={styles.subtitle}>
            같은 숫자를 합쳐 2048 타일을 만드세요
          </p>
        </header>

        <div className={styles.actions}>
          <button type="button" className={styles.newButton} onClick={newGame}>
            새 게임
          </button>
        </div>

        <div ref={boardRef} className={styles.boardWrap}>
          <Board tiles={state.tiles} />
        </div>

        <p className={styles.hint}>
          데스크톱: 방향키 또는 WASD / 모바일: 스와이프
        </p>
      </main>

      {showWonModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>2048 달성</h2>
            <p className={styles.modalText}>
              계속 진행해서 더 큰 숫자를 만들 수 있습니다
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalButtonSecondary}
                onClick={newGame}
              >
                새 게임
              </button>
              <button
                type="button"
                className={styles.modalButton}
                onClick={continueAfterWin}
              >
                계속하기
              </button>
            </div>
          </div>
        </div>
      )}

      {showLostModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>게임 오버</h2>
            <p className={styles.modalText}>더 이상 움직일 수 없습니다</p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalButton}
                onClick={newGame}
              >
                다시 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game2048Page;

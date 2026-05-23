import { Link } from "react-router-dom";
import styles from "../styles/HomePage.module.css";

interface GameItem {
  path: string;
  title: string;
  description: string;
  available: boolean;
}

const GAMES: GameItem[] = [
  {
    path: "/sudoku",
    title: "SUDOKU",
    description: "9x9 보드의 숫자 퍼즐",
    available: true,
  },
  {
    path: "/2048",
    title: "2048",
    description: "같은 숫자를 합쳐 2048을 만들기",
    available: true,
  },
];

const HomePage = () => {
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>MINI GAMES</h1>
          <p className={styles.subtitle}>플레이할 게임을 선택하세요</p>
        </header>

        <ul className={styles.list}>
          {GAMES.map((game) => (
            <li key={game.path}>
              {game.available ? (
                <Link to={game.path} className={styles.card}>
                  <div className={styles.cardTitle}>{game.title}</div>
                  <div className={styles.cardDesc}>{game.description}</div>
                </Link>
              ) : (
                <div className={`${styles.card} ${styles.cardDisabled}`}>
                  <div className={styles.cardTitle}>{game.title}</div>
                  <div className={styles.cardDesc}>준비 중</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default HomePage;

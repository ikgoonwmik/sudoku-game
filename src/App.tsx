import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SudokuPage from "./pages/SudokuPage";
import Game2048Page from "./pages/Game2048Page";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sudoku" element={<SudokuPage />} />
        <Route path="/2048" element={<Game2048Page />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

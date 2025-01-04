import Header from "./components/Header";
import Form from "./components/Form";
import PuzzleBoard from "./components/PuzzleBoard";
import Cards from "./components/Cards";
import { useState } from "react";

export default function App() {
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const setPieces = (newPuzzlePieces) => {
    setPuzzlePieces(newPuzzlePieces);
  };

  return (
    <div className="bg-gray-800">
      <Header />
      <h2 className="text-3xl font-bold text-white pt-10 mx-auto text-center">
        Type in a prompt to get started
      </h2>
      <Form />

      <Cards puzzlePieces={puzzlePieces} setPuzzlePieces={setPuzzlePieces} />
      <PuzzleBoard puzzlePieces={puzzlePieces} setPuzzlePieces={setPieces} />

      <div className="h-20"></div>
    </div>
  );
}

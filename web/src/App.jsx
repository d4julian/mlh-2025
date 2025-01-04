import Header from "./components/Header";
import Form from "./components/Form";
import PuzzleBoard from "./components/PuzzleBoard";
import Cards from "./components/Cards";
import { useState } from "react";

export default function App() {
  const [generatedText, setGeneratedText] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);

  const handleCategorizeSuccess = (data) => {
    setGeneratedText(data);
  };

  return (
    <div className="bg-gray-800">
      <Header />
      <Form onCategorizeSuccess={handleCategorizeSuccess} />
      {generatedText && (
        <Cards
          generatedText={generatedText}
          puzzlePieces={puzzlePieces}
          setPuzzlePieces={setPuzzlePieces}
        />
      )}
      <PuzzleBoard
        puzzlePieces={puzzlePieces}
        setPuzzlePieces={setPuzzlePieces}
      />

      <div className="h-20"></div>
    </div>
  );
}

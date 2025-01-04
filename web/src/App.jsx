import Header from "./components/Header";
import Form from "./components/Form";
import PuzzleBoard from "./components/PuzzleBoard";
import Cards from "./components/Cards";
import Grid from "./components/Grid";
import { useState } from "react";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [generatedText, setGeneratedText] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);

  const handleCategorizeSuccess = (data) => {
    setGeneratedText(data);
  };

  return (
    <div className="bg-gray-800 h-screen overflow-y-scroll">
      <Header />
      <Form onCategorizeSuccess={handleCategorizeSuccess} />
      <AnimatePresence>
        {generatedText && (
          <>
            <Cards
              generatedText={generatedText}
              puzzlePieces={puzzlePieces}
              setPuzzlePieces={setPuzzlePieces}
            />
            <PuzzleBoard
              puzzlePieces={puzzlePieces}
              setPuzzlePieces={setPuzzlePieces}
            />
          </>
        )}
      </AnimatePresence>
      <Grid />
      <div className="h-20"></div>
    </div>
  );
}

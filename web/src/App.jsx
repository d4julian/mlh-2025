import Header from "./components/Header";
import Form from "./components/Form";
import PuzzleBoard from "./components/PuzzleBoard";
import Cards from "./components/Cards";
import { useState } from "react";

export default function App() {
  const [generatedText, setGeneratedText] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [disabledItems, setDisabledItems] = useState([]); // Initialize as empty array

  const handleCategorizeSuccess = (data) => {
    setGeneratedText(data);
  };

  return (
    <div className="bg-gray-800">
      <Header />
      <Form onCategorizeSuccess={handleCategorizeSuccess} />
      <AnimatePresence>
        {generatedText && (
          <>
            <Cards
              generatedText={generatedText}
              puzzlePieces={puzzlePieces}
              disabledItems={disabledItems}
              setDisabledItems={setDisabledItems}
              setPuzzlePieces={setPuzzlePieces}
            />
            <PuzzleBoard
              puzzlePieces={puzzlePieces}
              setPuzzlePieces={setPuzzlePieces}
              disabledItems={disabledItems}
              setDisabledItems={setDisabledItems}
            />
          </>
        )}
      </AnimatePresence>
      <div className="h-20"></div>
    </div>
  );
}

import Form from "./components/Form";
import PuzzleBoard from "./components/PuzzleBoard";
import Cards from "./components/Cards";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Sidebar from "./components/Sidebar";
export default function App() {
  const [generatedText, setGeneratedText] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [disabledItems, setDisabledItems] = useState([]);

  const handleCategorizeSuccess = (data) => {
    setGeneratedText(data);
  };

  return (
    <div className="bg-gray-800 h-screen flex relative">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col w-full">
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
      </div>
    </div>
  );
}

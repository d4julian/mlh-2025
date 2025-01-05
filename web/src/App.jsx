import Form from "./components/Form";
import PuzzleBoard from "./components/PuzzleBoard";
import Cards from "./components/Cards";
import Grid from "./components/Grid";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
export default function App() {
  const [generatedText, setGeneratedText] = useState(null);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});
  const [sentence, setSentence] = useState("");

  const handleStreamedData = (jsonData) => {
    if (jsonData.category && jsonData.update !== undefined) {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        [jsonData.category]:
          (prevDetails[jsonData.category] || "") + jsonData.update,
      }));
    }
  };

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
                  setPuzzlePieces={setPuzzlePieces}
                />
                <PuzzleBoard
                  puzzlePieces={puzzlePieces}
                  setPuzzlePieces={setPuzzlePieces}
                  isDetailsLoading={isDetailsLoading}
                  setIsDetailsLoading={setIsDetailsLoading}
                  handleStreamedData={handleStreamedData}
                  setStreamedData={setProjectDetails}
                  sentence={sentence}
                  setSentence={setSentence}
                />
              </>
            )}
          </AnimatePresence>
          <Grid
            projectDetails={projectDetails}
            sentence={sentence}
            isDetailsLoading={isDetailsLoading}
          />
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
}

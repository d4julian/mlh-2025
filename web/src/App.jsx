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

      <button
        onClick={() => {
          console.log(projectDetails);
        }}
      >
        Test
      </button>

      <div className="h-20"></div>
    </div>
  );
}

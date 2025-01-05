import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import PuzzlePiece from "./PuzzlePiece";

const SNAP_DISTANCE = 50;
const getPieceWidth = () => {
  const piece = document.querySelector(".puzzle-piece svg");
  return (piece?.clientWidth || 400) - 84;
};

export default function PuzzleBoard({
  puzzlePieces,
  setPuzzlePieces,
  isDetailsLoading,
  setIsDetailsLoading,
  handleStreamedData,
  setStreamedData,
  sentence,
  setSentence,
}) {
  const [activePiece, setActivePiece] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleProjectGeneration = async () => {
    setIsDetailsLoading(true);
    setStreamedData({});
    try {
      const response = await fetch(
        "http://localhost:8000/api/analyze/details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: sentence }),
        }
      );

      const reader = response.body.getReader();

      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value).trim();

          const jsonStrings = chunk.match(/\{[^}]+\}/g) || [];

          for (const jsonString of jsonStrings) {
            try {
              const jsonData = JSON.parse(jsonString);
              handleStreamedData(jsonData);
            } catch (innerError) {
              console.error("Error parsing individual JSON:", innerError);
            }
          }
        } catch (error) {
          console.log("ERROR: " + new TextDecoder().decode(value));
          console.error("Error reading streamed data:", error);
          continue;
        }
      }
    } catch (error) {
      console.error("Error generating project details:", error);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const constructOrderedSentence = (pieces) => {
    if (!pieces.length) return "";

    let result = "";
    let currentType = null;
    let isFirstOfType = true;

    pieces.forEach((piece, index) => {
      if (currentType === null) {
        // First piece overall
        if (piece.type === 0) {
          result += `I want ${piece.text.toLowerCase()}`;
        }
        currentType = piece.type;
      } else if (piece.type !== currentType) {
        // New type
        isFirstOfType = true;
        currentType = piece.type;
        switch (piece.type) {
          case 0:
            result += ` and ${piece.text.toLowerCase()}`;
            break;
          case 1:
            result += ` with ${piece.text.toLowerCase()}`;
            break;
          case 2:
            result += ` using ${piece.text.toLowerCase()}`;
            break;
          default:
            break;
        }
      } else {
        // Same type as previous
        result += isFirstOfType
          ? `, ${piece.text.toLowerCase()}`
          : `, ${piece.text.toLowerCase()}`;
      }
      isFirstOfType = false;
    });

    return result;
  };

  useEffect(() => {
    const connectedPieces = findConnectedPieces();
    const newSentence = constructOrderedSentence(connectedPieces);
    setSentence(newSentence);
  }, [puzzlePieces]);

  const findConnectedPieces = () => {
    const pieceWidth = getPieceWidth();
    const connected = [];
    let leftmostPiece = null;

    puzzlePieces.forEach((piece) => {
      if (!leftmostPiece || piece.x < leftmostPiece.x) {
        const hasConnection = puzzlePieces.some(
          (p) =>
            p.id !== piece.id &&
            Math.abs(p.x - (piece.x + pieceWidth)) < SNAP_DISTANCE &&
            Math.abs(p.y - piece.y) < SNAP_DISTANCE
        );
        if (hasConnection) {
          leftmostPiece = piece;
        }
      }
    });

    let currentPiece = leftmostPiece;
    while (currentPiece) {
      connected.push(currentPiece);
      currentPiece = puzzlePieces.find(
        (p) =>
          p.id !== currentPiece.id &&
          Math.abs(p.x - (currentPiece.x + pieceWidth)) < SNAP_DISTANCE &&
          Math.abs(p.y - currentPiece.y) < SNAP_DISTANCE
      );
    }

    return connected;
  };

  const handleMouseDown = (e, piece) => {
    setActivePiece(piece);
    setOffset({
      x: e.clientX - piece.x,
      y: e.clientY - piece.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!activePiece) return;

    let newX = e.clientX - offset.x;
    let newY = e.clientY - offset.y;

    const board = document.querySelector(".relative");
    const BOARD_WIDTH = board?.clientWidth || 1000;
    const BOARD_HEIGHT = board?.clientHeight || 500;

    const pieceWidth = getPieceWidth();
    const PIECE_HEIGHT = pieceWidth * 0.95;

    newX = Math.max(0, Math.min(newX, BOARD_WIDTH - pieceWidth));
    newY = Math.max(0, Math.min(newY, BOARD_HEIGHT - PIECE_HEIGHT));

    puzzlePieces.forEach((piece) => {
      if (piece.id !== activePiece.id) {
        if (
          Math.abs(newX - (piece.x + pieceWidth)) < SNAP_DISTANCE &&
          Math.abs(newY - piece.y) < SNAP_DISTANCE
        ) {
          newX = piece.x + pieceWidth;
          newY = piece.y;
        }
        if (
          Math.abs(newX - (piece.x - pieceWidth)) < SNAP_DISTANCE &&
          Math.abs(newY - piece.y) < SNAP_DISTANCE
        ) {
          newX = piece.x - pieceWidth;
          newY = piece.y;
        }
      }
    });

    setPuzzlePieces(
      puzzlePieces.map((p) =>
        p.id === activePiece.id ? { ...p, x: newX, y: newY } : p
      )
    );
  };
  const handleMouseUp = () => {
    if (activePiece && trashRef.current) {
      const trashBounds = trashRef.current.getBoundingClientRect();
      const pieceBounds = {
        x: activePiece.x,
        y: activePiece.y,
        width: getPieceWidth(),
        height: getPieceWidth() * 0.95,
      };

      // Check if the piece overlaps the TRASH area
      const isOverTrash =
        pieceBounds.x + pieceBounds.width > trashBounds.left &&
        pieceBounds.x < trashBounds.right &&
        pieceBounds.y + pieceBounds.height > trashBounds.top &&
        pieceBounds.y < trashBounds.bottom;

      if (isOverTrash) {
        // Remove the piece
        setPuzzlePieces((prevPieces) =>
          prevPieces.filter((piece) => piece.id !== activePiece.id)
        );

        setDisabledItems((prev) =>
          prev.filter((item) => item !== activePiece.text)
        );
      }
    }

    setActivePiece(null); // Clear active piece
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }} // Delay to appear after cards
      className="border-4 rounded-lg border-gray-900 bg-gray-700 mx-10 striped-background"
      style={{
        background: `repeating-linear-gradient(
          45deg,
          rgba(31, 41, 55, 0.7),
          rgba(31, 41, 55, 0.7) 10px,
          rgba(55, 65, 81, 0.7) 10px,
          rgba(55, 65, 81, 0.7) 20px
        )`,
      }}
    >
      <div
        className="relative w-full h-[80vh]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {puzzlePieces.map((piece) => (
          <PuzzlePiece
            key={piece.id}
            piece={piece}
            isActive={activePiece?.id === piece.id}
            onMouseDown={(e) => handleMouseDown(e, piece)}
          />
        ))}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 text-gray-50 flex justify-between items-center">
          <div>{sentence}</div>
          <button
            type="button"
            className="px-8 py-3 font-semibold rounded bg-violet-600 hover:bg-violet-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDetailsLoading}
            onClick={handleProjectGeneration}
          >
            Generate Project
          </button>
        </div>
      </div>
    </motion.div>
  );
}

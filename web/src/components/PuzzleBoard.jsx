import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import PuzzlePiece from "./PuzzlePiece";

const SNAP_DISTANCE = 50; // Distance in pixels when pieces will snap together

export default function PuzzleBoard({
  puzzlePieces,
  setPuzzlePieces,
  disabledItems,
  setDisabledItems,
}) {
  const [activePiece, setActivePiece] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [sentence, setSentence] = useState("");
  const trashRef = useRef(null);

  useEffect(() => {
    const connectedPieces = findConnectedPieces();
    const newSentence = connectedPieces.map((piece) => piece.text).join(" ");
    setSentence(newSentence);
  }, [puzzlePieces]);

  const findConnectedPieces = () => {
    const connected = [];
    let leftmostPiece = null;

    // Find the leftmost piece
    puzzlePieces.forEach((piece) => {
      if (!leftmostPiece || piece.x < leftmostPiece.x) {
        // Check if this piece is connected to others
        const hasConnection = puzzlePieces.some(
          (p) =>
            p.id !== piece.id &&
            Math.abs(p.x - (piece.x + 200)) < SNAP_DISTANCE &&
            Math.abs(p.y - piece.y) < SNAP_DISTANCE
        );
        if (hasConnection) {
          leftmostPiece = piece;
        }
      }
    });

    // Follow the chain of connections
    let currentPiece = leftmostPiece;
    while (currentPiece) {
      connected.push(currentPiece);
      currentPiece = puzzlePieces.find(
        (p) =>
          p.id !== currentPiece.id &&
          Math.abs(p.x - (currentPiece.x + 200)) < SNAP_DISTANCE &&
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

    // Add boundaries to keep pieces within the board
    // Get board dimensions from the container
    const board = document.querySelector(".relative");
    const BOARD_WIDTH = board?.clientWidth || 1000;
    const BOARD_HEIGHT = board?.clientHeight || 500;

    // Get piece dimensions from first piece (assuming all pieces are same size)
    const piece = document.querySelector(".puzzle-piece");
    const PIECE_WIDTH = piece?.clientWidth || 200;
    const PIECE_HEIGHT = piece?.clientHeight || 100;

    newX = Math.max(0, Math.min(newX, BOARD_WIDTH - PIECE_WIDTH));
    newY = Math.max(0, Math.min(newY, BOARD_HEIGHT - PIECE_HEIGHT));

    // Simplified snapping logic - any piece can connect horizontally
    puzzlePieces.forEach((piece) => {
      if (piece.id !== activePiece.id) {
        // Check right side connection
        if (
          Math.abs(newX - (piece.x + 200)) < SNAP_DISTANCE &&
          Math.abs(newY - piece.y) < SNAP_DISTANCE
        ) {
          newX = piece.x + PIECE_WIDTH;
          newY = piece.y;
        }
        // Check left side connection
        if (
          Math.abs(newX - (piece.x - 200)) < SNAP_DISTANCE &&
          Math.abs(newY - piece.y) < SNAP_DISTANCE
        ) {
          newX = piece.x - PIECE_WIDTH;
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
    <div className="border-4 rounded-lg border-gray-900 bg-gray-700 mx-10">
      <div
        className="relative w-full h-[500px]"
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
        <div
          className="absolute right-0 text-white bg-red-500 w-32 h-12 flex items-center justify-center"
          style={{ bottom: "40px", backgroundColor: "red" }}
          ref={trashRef}
        >
          TRASH
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 text-gray-50">
          {sentence}
        </div>
      </div>
    </div>
  );
}

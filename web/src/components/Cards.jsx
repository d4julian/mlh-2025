import { motion } from "motion/react";
import { useState } from "react";

export default function Cards({
  puzzlePieces,
  setPuzzlePieces,
  generatedText,
}) {
  if (!generatedText) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Reordered categories with desired sequence
  const renamedCategories = [
    ["I want...", generatedText["Purposes"] || []],
    ["With...", generatedText["Functionality/Features"] || []],
    ["Using...", generatedText["Frameworks/Tech Stack"] || []],
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="grid grid-cols-3 gap-4 mx-auto max-w-7xl mb-6"
    >
      {renamedCategories.map(([category, items], index) => (
        <motion.div
          key={index}
          variants={item}
          className="rounded-md shadow-md bg-gray-300 text-gray-800 w-full"
        >
          <div className="flex flex-col justify-between p-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-wide">
                {category}
              </h2>
              <div className="flex flex-col gap-y-1">
                {items.map((item, i) => (
                  <button
                    onClick={(e) => {
                      setPuzzlePieces([
                        ...puzzlePieces,
                        {
                          id: puzzlePieces.length + 1,
                          x: Math.random() * 500,
                          y: Math.random() * 300,
                          type: index,
                          text: item,
                          color:
                            index === 0
                              ? "green"
                              : index === 1
                              ? "red"
                              : index === 2
                              ? "blue"
                              : "white",
                        },
                      ]);
                    }}
                    key={i}
                    className="bg-white border rounded-md py-1 text-center hover:bg-purple-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-2"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

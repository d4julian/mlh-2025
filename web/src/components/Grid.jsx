import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const CircularProgress = ({ percentage }) => {
  return (
    <>
      <div className="relative size-52 my-4 mx-auto">
        <svg
          className="size-full -rotate-90"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-gray-400"
            strokeWidth="2"
          ></circle>
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            className="stroke-current text-blue-600"
            strokeWidth="2"
            strokeDasharray="100"
            strokeDashoffset={100 - percentage}
            strokeLinecap="round"
          ></circle>
        </svg>

        <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
          <span className="text-center text-2xl font-bold text-blue-600">
            {percentage}%
          </span>
        </div>
      </div>
    </>
  );
};

export default function Grid({ projectDetails, sentence, isDetailsLoading }) {
  const [sentimentScore, setSentimentScore] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    const fetchSentiment = async () => {
      if (!sentence) return;

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/analyze/sentiment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: sentence }),
          }
        );

        const data = await response.json();
        setSentimentScore(data.sentiment);
      } catch (error) {
        console.error("Error fetching sentiment:", error);
      }
    };

    fetchSentiment();
  }, [isDetailsLoading]);

  useEffect(() => {
    const fetchImage = async () => {
      if (!sentence) return;

      setIsImageLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: sentence }), // Match the ImageRequest model
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setIsImageLoading(false);
      }
    };

    fetchImage();

    // Cleanup function to revoke object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [isDetailsLoading]);

  return (
    <section className="container grid grid-cols-3 gap-4 p-4 mx-auto">
      <AnimatePresence>
        {/* Project Strength card */}
        {Object.keys(projectDetails).length > 0 && (
          <motion.div
            className="bg-gray-200 p-4 rounded col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-lg font-semibold">Project Sentiment %</span>
            <CircularProgress percentage={sentimentScore} />
          </motion.div>
        )}

        {/* Project details */}
        {Object.entries(projectDetails).map(([key, value], index) => (
          <motion.div
            key={index}
            className={`bg-gray-200 p-4 rounded ${
              index === 0
                ? "col-span-2 row-span-2"
                : index === 2
                ? "col-span-3"
                : "col-span-1"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <span className="text-lg font-semibold">{key}</span>
            <ReactMarkdown className="text-gray-800" children={value} />
          </motion.div>
        ))}

        {/* Preview Section */}
        {Object.keys(projectDetails).length > 0 && (
          <motion.div
            className="bg-gray-200 p-4 rounded col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <span className="text-lg font-semibold">Preview</span>
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                {isImageLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-violet-600 my-8"
                  />
                ) : (
                  imageUrl && (
                    <motion.img
                      key={imageUrl}
                      src={imageUrl}
                      alt="Project wireframe"
                      className="max-w-full h-auto mt-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

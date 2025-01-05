import { useState } from "react";

const useInsertPrompt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsertPrompt = async (endpoint, text) => {
    setLoading(true);
    setError(null);

    console.log("[LOG] Sending prompt to backend");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchInsertPrompt, loading, error }; // Removed generatedText from return
};

export default useInsertPrompt;

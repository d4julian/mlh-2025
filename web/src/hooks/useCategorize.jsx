import { useState } from "react";

const useCategorize = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategorize = async (endpoint, text) => {
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

      const data = await response.json();
      return data; // Just return the data, no need to set local state
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCategorize, loading, error }; // Removed generatedText from return
};

export default useCategorize;

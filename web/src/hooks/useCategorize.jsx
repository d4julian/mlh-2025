import { useState } from "react";

const useCategorize = () => {
  const [generatedText, setGeneratedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategorize = async (endpoint, text) => {
    setLoading(true);
    setError(null);

    console.log("[LOG] Sending prompt to backend"); // Log input

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
      setGeneratedText(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { generatedText, fetchCategorize, loading, error };
};

export default useCategorize;

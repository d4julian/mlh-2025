import { useState, useEffect } from "react";

const useFetchPrompts = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllPrompts = async () => {
    setLoading(true);
    setError(null);

    console.log("[LOG] Fetching all prompts from backend");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/data/query");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      setPrompts(jsonData.results);
    } catch (err) {
      console.error("[ERROR] Failed to fetch prompts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPrompts(); // Fetch all prompts on mount
  }, []);

  return { prompts, loading, error };
};

export default useFetchPrompts;

import React, { useState } from "react";
import Button from "./Button";
import useCategorize from "../hooks/useCategorize";

export default function Form() {
  const [inputText, setInputText] = useState("");
  const { generatedText, fetchCategorize, loading, error } = useCategorize();

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = "http://127.0.0.1:8000/api/categorize";

    try {
      await fetchCategorize(endpoint, inputText);
      console.log("[LOG] fetchCategorize call completed");
    } catch (err) {
      console.error("[ERROR]", err);
    }
  };

  return (
    <section className="p-6 bg-gray-800 text-gray-50">
      <form
        noValidate=""
        action=""
        className="container flex flex-col mx-auto space-y-12"
      >
        <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-gray-900">
          <div className="col-span-full">
            <label htmlFor="prompt" className="text-sm">
              Prompt
            </label>
            <input
              id="prompt"
              type="text"
              placeholder=""
              value={inputText}
              onChange={handleChange}
              className="w-full rounded-md focus:ring focus:ring-opacity-75 text-gray-900 focus:ring-violet-400 border-gray-700"
            />
          </div>

          <Button
            text={loading ? "Generating..." : "Generate"}
            onClick={handleSubmit}
          />
        </fieldset>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {generatedText && (
        <div className="mt-4">
          <h3>Generated JSON:</h3>
          <pre>{JSON.stringify(generatedText, null, 2)}</pre>
        </div>
      )}
    </section>
  );
}

import React, { useState } from "react";
import useCategorize from "../hooks/useCategorize";
import useInsertPrompt from "../hooks/useInsertPrompt";

export default function Form({ onCategorizeSuccess }) {
  const [inputText, setInputText] = useState("");
  const [formError, setFormError] = useState(null);

  const {
    fetchCategorize,
    loading: categorizeLoading,
    error: categorizeError,
  } = useCategorize();
  const {
    fetchInsertPrompt,
    loading: insertLoading,
    error: insertError,
  } = useInsertPrompt();

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Reset form-level error

    const categorizeEndpoint = "http://127.0.0.1:8000/api/categorize";
    const insertDataEndpoint = "http://127.0.0.1:8000/api/data/insert";

    try {
      const data = await fetchCategorize(categorizeEndpoint, inputText);
      console.log("[LOG] fetchCategorize call completed");
      onCategorizeSuccess(data);
    } catch (err) {
      console.error("[ERROR]", err);
    }

    try {
      const insertData  = await fetchInsertPrompt(insertDataEndpoint, inputText);
      console.log("[LOG] insert data call completed");
    } catch (err) {
      console.error("[ERROR]", err);
      setFormError("An error occurred while processing your request.");
    }
  };

  return (
    <section className="p-6 bg-gray-800 text-gray-50">
      <h2 className="text-3xl font-bold text-white pb-10 mx-auto text-center">
        Type in a prompt to get started
      </h2>
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

          <button
            type="button"
            className="px-8 py-3 font-semibold border rounded border-gray-100 text-gray-100 hover:border-violet-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={categorizeLoading || !inputText}
          >
            {categorizeLoading ? "Generating..." : "Generate"}
          </button>

          {categorizeLoading && (
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-violet-600" />
          )}
        </fieldset>
      </form>

      {categorizeError && (
        <p style={{ color: "red" }}>Error: {categorizeError}</p>
      )}
    </section>
  );
}

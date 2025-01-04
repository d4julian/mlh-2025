import React, { useState } from "react";
import Button from "./Button";
import useCategorize from "../hooks/useCategorize";

export default function Form({ onCategorizeSuccess }) {
  const [inputText, setInputText] = useState("");
  const { fetchCategorize, loading, error } = useCategorize();

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = "http://127.0.0.1:8000/api/categorize";

    try {
      const data = await fetchCategorize(endpoint, inputText);
      console.log("[LOG] fetchCategorize call completed");
      onCategorizeSuccess(data);
    } catch (err) {
      console.error("[ERROR]", err);
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

          <Button
            text={loading ? "Generating..." : "Generate"}
            onClick={handleSubmit}
          />
        </fieldset>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </section>
  );
}

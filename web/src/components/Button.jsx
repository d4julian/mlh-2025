import React from "react";

export default function Button({ text, onClick }) {
  return (
    <button
      type="button"
      className="px-8 py-3 font-semibold border rounded border-gray-100 text-gray-100 hover:border-violet-400 transition"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

import React from "react";
import useFetchPrompts from "../hooks/useFetchPrompts";

const Sidebar = () => {
  const { prompts, loading, error } = useFetchPrompts(); // Fetch prompts
  return (
    <aside className="sticky top-0 w-60 h-screen overflow-y-scroll  p-6 sm:w-60 bg-purple-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <nav className="space-y-8 text-sm">
        <div className="space-y-4">
          <h2 className="text-sm font-bold tracking-wide uppercase text-gray-600 dark:text-gray-400">
            History
          </h2>

          {loading && <p>Loading...</p>}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <ul className="space-y-2">
              {prompts.map((prompt) => {
                return (
                  <li key={prompt._id.$oid}>
                    <a
                      href="#"
                      className="block px-3 py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-gray-700 transition"
                    >
                      <p>{prompt.prompt}</p>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

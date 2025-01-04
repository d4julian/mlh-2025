export default function Cards({
  puzzlePieces,
  setPuzzlePieces,
  generatedText,
  disabledItems,
  setDisabledItems,
}) {
  if (!generatedText) return null;

  const categories = Object.entries(generatedText);

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  return (
    <div className="grid grid-cols-3 gap-6 mx-auto max-w-7xl place-items-center mb-6">
      {categories.map(([category, items], index) => (
        <div
          key={index}
          className="max-w-xs rounded-md shadow-md bg-gray-300 text-gray-800"
        >
          <div className="flex flex-col justify-between p-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-wide">
                {category}
              </h2>
              <div className="flex flex-col gap-y-1">
                {items.map((item, itemIndex) => (
                  <button
                    onClick={() => {
                      setPuzzlePieces([
                        ...puzzlePieces,
                        {
                          id: puzzlePieces.length + 1,
                          x: Math.random() * 500, // direct x property
                          y: Math.random() * 300, // direct y property
                          type: "middle", // consistent type
                          text: item,
                          color: getRandomColor(),
                        },
                      ]);
                      setDisabledItems((prev) => [...prev, item]); // Mark as disabled
                      e.target.disabled = true;
                    }}
                    key={i}
                    disabled={disabledItems.includes(item)}
                    className="bg-white border rounded-md py-1 text-center hover:bg-purple-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-2"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

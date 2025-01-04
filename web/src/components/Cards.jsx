export default function Cards({ puzzlePieces, setPuzzlePieces }) {
  const cards = [
    {
      title: "I want...",
      items: [
        "E-Commerce",
        "Social Media",
        "To provide personalized customer experiences through social media and email marketing",
      ],
    },
    {
      title: "With...",
      items: ["User Authentication", "Data Visualization", "API Integration"],
    },
    {
      title: "Using...",
      items: ["React", "Tailwind CSS", "Django"],
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mx-auto max-w-7xl place-items-center mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="max-w-xs rounded-md shadow-md bg-gray-300 text-gray-800"
        >
          <div className="flex flex-col justify-between p-6 space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-wide">
                {card.title}
              </h2>
              <div className="flex flex-col gap-y-1 min-w-52">
                {card.items.map((item, i) => (
                  <button
                    onClick={(e) => {
                      setPuzzlePieces([
                        ...puzzlePieces,
                        {
                          id: puzzlePieces.length + 1,
                          x: Math.random() * 500,
                          y: Math.random() * 300,
                          type: index,
                          text: item,
                          color:
                            index == 0
                              ? "green"
                              : index == 1
                              ? "red"
                              : index == 2
                              ? "blue"
                              : "white",
                        },
                      ]);
                      e.target.disabled = true;
                    }}
                    key={i}
                    className="bg-white border rounded-md py-1 text-center hover:bg-purple-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

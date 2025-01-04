export default function Cards({ puzzlePieces, setPuzzlePieces }) {
    const cards = [
        {
            title: "Frameworks/Tech Stack",
            items: ["React", "Tailwind CSS", "Django"]
        },
        {
            title: "Functionality/Features",
            items: []
        },
        {
            title: "Purpose/Use Case",
            items: []
        }   
    ];
    return (
        <div className="grid grid-cols-3 gap-6 mx-auto max-w-7xl place-items-center mb-6">
            {cards.map((card, index) => (
                <div key={index} className="max-w-xs rounded-md shadow-md bg-gray-300 text-gray-800">
                    <div className="flex flex-col justify-between p-6 space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold tracking-wide">{card.title}</h2>
                            <div className="flex flex-col gap-y-1">
                                {card.items.map((item, index) => (
                                    <button 
                                    onClick={() => {
                                        setPuzzlePieces([...puzzlePieces, {
                                            id: puzzlePieces.length + 1,
                                            x: Math.random() * 500,  // direct x property
                                            y: Math.random() * 300,  // direct y property
                                            type: 'middle',         // consistent type
                                            text: item
                                        }]);
                                    }}
                                    key={index} 
                                    className="bg-white border rounded-md py-1 text-center">
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
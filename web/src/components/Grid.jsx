const CircularProgress = ({ percentage }) => {
    return (
        <>
            <div className="relative size-52 mt-4 mx-auto">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-400" strokeWidth="2"></circle>
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-blue-600" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - percentage} strokeLinecap="round"></circle>
                </svg>

                <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <span className="text-center text-2xl font-bold text-blue-600">{percentage}%</span>
                </div>
                </div>
        </>
    );
  };

export default function Grid() {
    return (
        <section className="container grid grid-cols-3 gap-4 p-4 mx-auto">
            <div className="bg-gray-200 p-4 rounded col-span-2 row-span-2 h-[50vh]">
                <span className="text-lg font-semibold">Grid</span>
            </div>
            <div className="bg-gray-200 p-4 rounded">
                <span className="text-lg font-semibold">Project Strength %</span>
                <CircularProgress percentage={75} />
            </div>
            {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded">
                    Item {index + 1}
                </div>
            ))}

        </section>
    );
}
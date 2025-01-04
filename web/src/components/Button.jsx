export default function Button({ text }) {
    return (
        <button type="button" className="px-8 py-3 font-semibold border rounded border-gray-100 text-gray-100 hover:border-violet-400 transition">
            {text}
        </button>
    )
}
export const FilterButton = ({ value, label, count, setFilter, filter }) => (
    <button
        onClick={() => setFilter(value)}
        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
            filter === value
                ? "bg-emerald-400/10 border-emerald-400/50 text-emerald-400"
                : "bg-transparent border-slate-700 text-slate-500 hover:border-slate-500"
        }`}
    >
        {label} <span className="ml-1 opacity-50">{count}</span>
    </button>
);
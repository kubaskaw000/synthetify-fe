export const SortIcon = ({ k, sortKey, sortDir }) => {
    if (sortKey !== k) return <span className="text-slate-600 ml-1">⇅</span>;
    return <span className="text-emerald-400 ml-1">{sortDir === -1 ? "↓" : "↑"}</span>;
};

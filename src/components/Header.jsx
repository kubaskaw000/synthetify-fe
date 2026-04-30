export const Header = ({
  systemData,
  validators,
  activeValidatorCount,
  lastUpdate,
  loading,
  fetchValidatorData,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-center lg:justify-between lg:mx-[15%] flex-wrap gap-4">
      <div className="flex items-center gap-8">
        {systemData && (
          <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800/50">
            {[
              {
                label: "Epoch",
                value: systemData.epoch,
                color: "text-emerald-400",
              },
              {
                label: "Validators",
                value: validators.length,
                color: "text-white",
              },
              {
                label: "Active",
                value: activeValidatorCount,
                color: "text-emerald-400",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="px-4 py-1 border-r last:border-0 border-slate-800"
              >
                <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                  {label}
                </div>
                <div className={`text-sm font-mono font-semibold ${color}`}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {lastUpdate && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 tracking-wide uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              Live System
            </div>
            <div className="text-[11px] font-mono text-slate-600">
              Last sync: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}

        <button
          onClick={fetchValidatorData}
          disabled={loading}
          className="group relative flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all active:scale-95 disabled:opacity-30"
        >
          <span
            className={
              loading
                ? "animate-spin"
                : "group-hover:rotate-180 transition-transform duration-500"
            }
          >
            {loading ? "⟳" : "↻"}
          </span>
          {loading ? "Syncing" : "Refresh"}
        </button>
      </div>
    </header>
  );
};

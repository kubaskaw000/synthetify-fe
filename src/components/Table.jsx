import { SortIcon } from "./SortIcon.jsx";
import { fmtApy, fmtComm, fmtVp, stakeFormat } from "../helpers.js";

export const Table = ({ display, toggleSort, sortKey, sortDir }) => {
  return (
    <table className="w-full text-sm border-collapse">
      <thead className="sticky top-0 z-10 bg-slate-950">
        <tr className="border-b border-slate-800">
          <th className="text-left px-4 py-2.5 text-slate-500 font-normal tracking-widest text-sm w-8">
            #
          </th>
          <th className="text-left px-4 py-2.5 text-slate-500 font-normal text-sm w-8">
            LOGO
          </th>
          <th className="justify-center px-2 py-2.5 text-slate-500 font-normal text-sm">
            <button
              onClick={() => toggleSort("name")}
              className="hover:text-slate-300 transition-colors flex items-center"
            >
              NAME <SortIcon k="name" sortKey={sortKey} sortDir={sortDir} />
            </button>
          </th>
          <th className="text-center px-2 py-2.5 text-slate-500 font-normal text-sm">
            STATUS
          </th>
          <th className="text-right px-2 py-2.5 text-slate-500 font-normal text-sm">
            <button
              onClick={() => toggleSort("stakingPoolIotaBalance")}
              className="hover:text-slate-300 transition-colors flex items-center ml-auto"
            >
              STAKE{" "}
              <SortIcon
                k="stakingPoolIotaBalance"
                sortKey={sortKey}
                sortDir={sortDir}
              />
            </button>
          </th>
          <th className="text-right px-2 py-2.5 text-slate-500 font-normal text-sm hidden sm:table-cell">
            <button
              onClick={() => toggleSort("apy")}
              className="hover:text-slate-300 transition-colors flex items-center ml-auto"
            >
              APY <SortIcon k="apy" sortKey={sortKey} sortDir={sortDir} />
            </button>
          </th>
          <th className="text-right px-2 py-2.5 text-slate-500 font-normal text-sm hidden md:table-cell">
            <button
              onClick={() => toggleSort("commissionRate")}
              className="hover:text-slate-300 transition-colors flex items-center ml-auto"
            >
              COMM.{" "}
              <SortIcon
                k="commissionRate"
                sortKey={sortKey}
                sortDir={sortDir}
              />
            </button>
          </th>
          <th className="text-right px-2 py-2.5 text-slate-500 font-normal tracking-widest text-sm hidden lg:table-cell">
            <button
              onClick={() => toggleSort("votingPower")}
              className="hover:text-slate-300 transition-colors flex items-center ml-auto"
            >
              VP{" "}
              <SortIcon k="votingPower" sortKey={sortKey} sortDir={sortDir} />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {display.map((v, i) => {
          const isActive = Number(v.votingPower) > 0;
          return (
            <tr
              key={v.iotaAddress ?? i}
              className="border-b border-slate-900 cursor-pointer transition-colors"
            >
              <td className="px-4 py-2.5 text-slate-600 text-sm tabular-nums">
                {i + 1}
              </td>
              <td className="px-4 py-2.5">
                {v.imageUrl && (
                  <img
                    src={v.imageUrl}
                    alt={v.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                )}
              </td>
              <td className="px-2 py-2.5 max-w-[160px]">
                <span className="text-slate-200 truncate block">
                  {v.name ?? "Unknown"}
                </span>
                {v.projectUrl && (
                  <a
                    href={v.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-emerald-400 transition-colors truncate block"
                  >
                    {v.projectUrl.replace(/^https?:\/\//, "").slice(0, 28)}
                  </a>
                )}
              </td>
              <td className="px-2 py-2.5 text-center">
                <span
                  className={`inline-flex items-center gap-1 text-sm px-2 py-0.5 rounded-full border ${isActive ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-red-400/10 border-red-400/20 text-red-400"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-red-400"}`}
                  />
                  {isActive ? "active" : "off"}
                </span>
              </td>
              <td className="px-2 py-2.5 text-right text-amber-300 tabular-nums font-bold">
                {stakeFormat(v.stakingPoolIotaBalance)}
              </td>
              <td className="px-2 py-2.5 text-right text-emerald-400 tabular-nums hidden sm:table-cell">
                {fmtApy(v.apy)}
              </td>
              <td className="px-2 py-2.5 text-right text-slate-400 tabular-nums hidden md:table-cell">
                {fmtComm(v.commissionRate)}
              </td>
              <td className="px-2 py-2.5 text-right text-violet-400 tabular-nums hidden lg:table-cell">
                {fmtVp(v.votingPower)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

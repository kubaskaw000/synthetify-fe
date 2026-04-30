import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Globe from "react-globe.gl";
import { Table } from "./Table.jsx";
import { generateRandomLocation, stakeFormat } from "../helpers.js";
import { FilterButton } from "./FilterButton.jsx";
import { fetchData } from "../services.js";
import { Header } from "./Header.jsx";

const REFRESH_MS = 20_000;

const GlobePage = () => {
  const globeRef = useRef(null);
  const globeContainerRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("stakingPoolIotaBalance");
  const [sortDir, setSortDir] = useState(-1);
  const [globeSize, setGlobeSize] = useState({ w: 0, h: 0 });
  const [{ validators, systemData, lastUpdate, loading }, setFetchState] =
    useState({
      validators: [],
      systemData: null,
      lastUpdate: null,
      loading: true,
    });

  const fetchValidatorData = useCallback(async () => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    try {
      const system = await fetchData("iotax_getLatestIotaSystemState");

      const validators = (system?.activeValidators ?? []).map((v) => ({
        ...v,
        location: generateRandomLocation(),
        apy: null,
      }));

      try {
        const apyData = await fetchData("iotax_getValidatorsApy");
        if (apyData?.apys) {
          const apyByAddress = Object.fromEntries(
            apyData.apys.map(({ address, apy }) => [address, apy]),
          );
          validators.forEach((v) => {
            v.apy = apyByAddress[v.iotaAddress] ?? null;
          });
        }
      } catch (apyError) {
        console.log(apyError.message);
      }

      setFetchState({
        validators,
        systemData: system,
        lastUpdate: new Date(),
        loading: false,
        error: null,
      });
    } catch (fetchError) {
      setFetchState((prev) => ({
        ...prev,
        loading: false,
        error: fetchError.message,
      }));
    }
  }, []);

  const activeValidatorCount = useMemo(
    () => validators.filter((v) => Number(v.votingPower) > 0).length,
    [validators],
  );

  const filteredAndSortedValidators = useMemo(() => {
    return validators
      .filter((v) => {
        const votingPower = Number(v.votingPower);
        if (filter === "active") return votingPower > 0;
        if (filter === "inactive") return votingPower === 0;
        return true;
      })
      .sort((a, b) => {
        const aValue = a[sortKey] ?? 0;
        const bValue = b[sortKey] ?? 0;

        return sortKey === "name"
          ? sortDir * String(aValue).localeCompare(String(bValue))
          : sortDir * (Number(aValue) - Number(bValue));
      });
  }, [validators, filter, sortKey, sortDir]);

  const globePoints = useMemo(
    () =>
      filteredAndSortedValidators
        .filter((v) => v.location)
        .map((v) => ({
          lat: v.location.lat,
          lng: v.location.lng,
          altitude: 0.01,
          radius: 1.5,
          color: Number(v.votingPower) > 0 ? "#34d399" : "#f87171",
          data: v,
        })),
    [filteredAndSortedValidators],
  );

  const globeArcs = useMemo(() => {
    const topActivePoints = globePoints
      .filter((p) => Number(p.data.votingPower) > 0)
      .slice(0, 8);
    const arcs = [];
    for (let i = 0; i < topActivePoints.length; i++) {
      for (let j = i + 1; j < Math.min(i + 3, topActivePoints.length); j++) {
        arcs.push({
          startLat: topActivePoints[i].lat,
          startLng: topActivePoints[i].lng,
          endLat: topActivePoints[j].lat,
          endLng: topActivePoints[j].lng,
          color: ["rgba(52,211,153,0.3)", "rgba(52,211,153,0.05)"],
        });
      }
    }
    return arcs;
  }, [globePoints]);

  const buildPointTooltip = useCallback(
    (point) => `
    <div class="bg-slate-900/95 flex flex-col items-center border border-emerald-500/40 rounded-lg p-3 font-mono text-xs text-slate-200 min-w-[170px] shadow-xl backdrop-blur-sm">
        <div class="text-emerald-400 tracking-widest mb-1 uppercase">Validator</div>
        <div class="font-bold mb-1.5 truncate">${point.data.name ?? "Unknown"}</div>
        <div class="text-[10px] mb-1 gap-1" style="color: ${point.color}">
            ${Number(point.data.votingPower) > 0 ? "ACTIVE" : "INACTIVE"}
        </div>
        <div class="text-[10px] text-slate-400 leading-relaxed">
            ${stakeFormat(point.data.stakingPoolIotaBalance)} IOTA
        </div>
    </div>
`,
    [],
  );

  const handleColumnSort = (key) => {
    if (sortKey === key) setSortDir((dir) => dir * -1);
    else {
      setSortKey(key);
      setSortDir(-1);
    }
  };

  useEffect(() => {
    fetchValidatorData();
    const intervalId = setInterval(fetchValidatorData, REFRESH_MS);
    return () => clearInterval(intervalId);
  }, [fetchValidatorData]);

  useEffect(() => {
    const container = globeContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(([entry]) => {
      setGlobeSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono flex flex-col">
      <Header
        systemData={systemData}
        validators={validators}
        activeValidatorCount={activeValidatorCount}
        lastUpdate={lastUpdate}
        loading={loading}
        fetchValidatorData={fetchValidatorData}
      />
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          ref={globeContainerRef}
          className="w-full h-[350px] lg:h-[600px] lg:min-h-[600px] shrink-0 bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-800"
        >
          <div className="w-full h-full relative">
            <div className="absolute inset-0">
              <Globe
                ref={globeRef}
                width={globeSize.w}
                height={globeSize.h}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                atmosphereColor="#34d399"
                atmosphereAltitude={0.12}
                pointsData={globePoints}
                pointAltitude="altitude"
                pointRadius="radius"
                pointColor="color"
                pointLabel={buildPointTooltip}
                onPointClick={buildPointTooltip}
                arcsData={globeArcs}
                arcColor="color"
                arcAltitude={0.2}
                arcStroke={0.5}
                arcDashLength={0.35}
                arcDashGap={0.15}
                arcDashAnimateTime={2000}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 lg:mx-[15%] flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-800 flex-wrap">
            <FilterButton
              setFilter={setFilter}
              filter={filter}
              value="all"
              label="All"
              count={validators.length}
            />
            <FilterButton
              setFilter={setFilter}
              filter={filter}
              value="active"
              label="Active"
              count={activeValidatorCount}
            />
            <FilterButton
              setFilter={setFilter}
              filter={filter}
              value="inactive"
              label="Inactive"
              count={validators.length - activeValidatorCount}
            />
            <span className="text-slate-600 text-xs ml-auto hidden sm:block">
              {filteredAndSortedValidators.length} shown
            </span>
          </div>
          {loading && validators.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-slate-800 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
                <div className="text-xs text-slate-500 tracking-widest">
                  CONNECTING TO IOTA MAINNET
                </div>
              </div>
            </div>
          )}

          {validators.length > 0 && (
            <div className="flex-1 overflow-auto">
              <Table
                sortKey={sortKey}
                sortDir={sortDir}
                display={filteredAndSortedValidators}
                toggleSort={handleColumnSort}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobePage;

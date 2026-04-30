export const iotaFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const stakeFormat = (nanos) => {
  if (!nanos) return "0";
  try {
    const val = Number(BigInt(nanos) / BigInt(1_000_000_000));
    return iotaFormatter.format(val);
  } catch {
    return "-";
  }
};

export const generateRandomLocation = () => ({
  lat: Math.random() * 180 - 90,
  lng: Math.random() * 360 - 180,
});

export const fmtApy = (v) =>
  v == null ? "-" : (Number(v) * 100).toFixed(2) + "%";
export const fmtVp = (v) => (v ? (Number(v) / 100).toFixed(3) + "%" : "-");
export const fmtComm = (v) => (v ? (Number(v) / 100).toFixed(2) + "%" : "-");

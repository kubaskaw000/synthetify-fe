const IOTA_URL = "https://api.mainnet.iota.cafe";

export const fetchData = async (method, params = []) => {
  const res = await fetch(IOTA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 1, jsonrpc: "2.0", method, params }),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

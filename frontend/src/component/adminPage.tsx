import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createSymbol, getOrderbooks } from "../services/api";

export const AdminPage = () => {
  const [symbolName, setSymbolName] = useState("");
  const [symbols, setSymbols] = useState<string[]>([]);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchSymbols = async () => {
    try {
      const orderbooks = await getOrderbooks();
      console.log("orderbooks", orderbooks);
      setSymbols(Object.keys(orderbooks));
    } catch {
      console.error("Failed to fetch symbols");
    }
  };

  useEffect(() => {
    fetchSymbols();
  }, []);

  const handleCreate = async () => {
    const name = symbolName.trim();
    if (!name) return;
    setCreating(true);
    setMessage(null);
    try {
      await createSymbol(name);
      setMessage({ text: `Symbol "${name}" created successfully`, type: "success" });
      setSymbolName("");
      await fetchSymbols();
    } catch (err: any) {
      setMessage({
        text: err.message || "Failed to create symbol",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Create Symbol */}
        <div className="bg-white rounded-lg shadow p-5 mb-6">
          <h2 className="text-lg font-semibold mb-3">Create Symbol</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={symbolName}
              onChange={(e) => setSymbolName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. BTC_USD_25"
              className="border rounded px-3 py-2 text-sm flex-1"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !symbolName.trim()}
              className="bg-black text-white text-sm font-semibold rounded px-4 py-2 disabled:opacity-50 cursor-pointer"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
          {message && (
            <p
              className={`mt-3 text-sm font-medium ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* Existing Symbols */}
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Existing Symbols</h2>
            <button
              onClick={fetchSymbols}
              className="text-sm text-gray-500 hover:text-black cursor-pointer"
            >
              Refresh
            </button>
          </div>
          {symbols.length === 0 ? (
            <p className="text-sm text-gray-400">No symbols yet</p>
          ) : (
            <ul className="divide-y">
              {symbols.map((sym) => (
                <li key={sym} className="py-2 flex justify-between items-center">
                  <span className="font-mono text-sm">{sym}</span>
                  <Link
                    to={`/event-details/${sym}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

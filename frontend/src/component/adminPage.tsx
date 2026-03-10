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
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-6">Admin Panel</h1>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-800 mb-3">Create Symbol</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={symbolName}
            onChange={(e) => setSymbolName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. BTC_USD_25"
            className="border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all placeholder:text-slate-300"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !symbolName.trim()}
            className="bg-slate-900 text-white text-sm font-semibold rounded-lg px-5 py-2.5 disabled:opacity-40 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            {creating ? "Creating..." : "Create"}
          </button>
        </div>
        {message && (
          <p
            className={`mt-3 text-sm font-medium ${
              message.type === "success" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-slate-800">Existing Symbols</h2>
          <button
            onClick={fetchSymbols}
            className="text-sm text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            Refresh
          </button>
        </div>
        {symbols.length === 0 ? (
          <p className="text-sm text-slate-400">No symbols yet</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {symbols.map((sym) => (
              <li key={sym} className="py-3 flex justify-between items-center">
                <span className="font-mono text-sm text-slate-700">{sym}</span>
                <Link
                  to={`/event-details/${sym}`}
                  className="text-sm text-yes font-medium hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

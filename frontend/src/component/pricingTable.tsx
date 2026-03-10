import type { PriceLevel } from "../types";

interface TableType {
  data: PriceLevel[];
  qty: string;
}

export const PriceTable = ({ data, qty }: TableType) => {
  const maxQty = Math.max(...data.map((r) => r.qty), 1);

  return (
    <table className="w-full mb-4 text-left">
      <thead>
        <tr>
          <th className="py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
          <th className="py-2 px-1 text-xs font-medium text-slate-500 text-right uppercase tracking-wider">
            Qty at{" "}
            <span className={qty === "YES" ? "text-yes font-bold" : "text-no font-bold"}>
              {qty}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          const widthPercent = (row.qty / maxQty) * 100;
          return (
            <tr
              style={{
                background: `linear-gradient(to left, ${
                  qty === "YES" ? "var(--color-yes-mid)" : "var(--color-no-mid)"
                } ${widthPercent}%, transparent ${0}%)`,
              }}
              key={index}
              className="border-t border-slate-100"
            >
              <td className="py-2.5 px-2 text-sm text-slate-700 font-medium">{row.price}</td>
              <td className="py-2.5 px-4 text-sm text-slate-600 text-right">
                <span className="relative z-10">{row.qty}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

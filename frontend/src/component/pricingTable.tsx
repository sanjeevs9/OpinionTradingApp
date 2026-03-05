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
          <th className="py-2 text-md font-semibold text-gray-700">PRICE</th>
          <th className="py-2 px-1 text-md font-light text-gray-700 text-right">
            QTY AT{" "}
            <span
              className={`${
                qty === "YES" ? "text-[#1A7BFE]" : "text-[#DB2706]"
              } `}
            >
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
                  qty === "YES" ? "#BBD8FE" : "#FFDCDB"
                } ${widthPercent}%, #ffffff ${0}%)`,
              }}
              key={index}
              className={`border-t border-gray-200`}
            >
              <td className="py-2 px-2 text-sm text-gray-600">{row.price}</td>
              <td className="py-2 px-4 text-sm text-gray-600 text-right relative">
                <span className="relative z-10">{row.qty}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

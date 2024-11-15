

interface TableType {
    data: any,
    qty: string
}

export const PriceTable = ({data, qty}:TableType)=> {
  return (
    <table className="w-full mb-4 text-left">
      <thead>
        <tr>
          <th className="py-2 text-md font-semibold text-gray-700">PRICE</th>
          <th className="py-2 px-1 text-md font-light text-gray-700 text-right">
            QTY AT <span className={`${qty === 'YES' ? 'text-[#1A7BFE]' : 'text-[#DB2706]'} `}>{qty}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, index: number) => {
          let qut = row.qty.toString().length * Math.floor(Math.random() * 11);
          return <tr 
          style={{
            background: `linear-gradient(to left, ${qty === 'YES' ? '#BBD8FE' : '#FFDCDB'} ${row.qty !== 0 ? qut : 0}%, #ffffff ${0}%)`
          }}
           key={index} className={`border-t border-gray-200`}>
            <td className="py-2 px-2 text-sm text-gray-600">{row.price}</td>
            <td className="py-2 px-4 text-sm text-gray-600 text-right relative">
              
              <span className="relative z-10">{row.qty}</span>
            </td>
          </tr>
})}
      </tbody>
    </table>
  );
}

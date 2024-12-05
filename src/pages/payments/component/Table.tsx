// import React from "react";

// interface TableRow {
//   image?: React.ReactNode;
//   data: React.ReactNode[];
// }

// interface TableProps {
//   headers: React.ReactNode[];
//   rows: TableRow[];
//   className?: string;
//   onRowSelect?: (selectedRows: number[]) => void;
//   emptyState?: React.ReactNode;
// }

// const Table: React.FC<TableProps> = ({
//   headers,
//   rows,
//   className,
//   emptyState,
// }) => {
//   return (
//     <div className={`overflow-x-auto ${className}`}>
//       <table className="w-full table-auto border-collapse border border-grey-100">
//         <thead>
//           <tr className="rounded-[16px] bg-grey-25 text-xs font-[500] text-grey-400">
//             {headers?.map((header, index) => (
//               <th
//                 key={index}
//                 className="border border-grey-100 px-4 py-[11px] text-left"
//               >
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {rows.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={headers.length + 1}
//                 className="border border-grey-100 px-4 py-[11px] text-center"
//               >
//                 {emptyState || "No data available"}{" "}
//               </td>
//             </tr>
//           ) : (
//             rows?.map((row, rowIndex) => (
//               <tr
//                 key={rowIndex}
//                 className="hover:bg-grey-50 bg-white text-xs font-[500] text-grey-900"
//               >
//                 {row?.data.map((cell, cellIndex) => (
//                   <td
//                     key={cellIndex}
//                     className="border border-grey-100 px-4 py-[20px] text-start"
//                   >
//                     {cell}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Table;

import React from "react";

interface TableRow {
  image?: React.ReactNode;
  data: React.ReactNode[];
}

interface TableProps {
  headers?: React.ReactNode[];
  rows?: TableRow[];
  className?: string;
  onRowSelect?: (selectedRows: number[]) => void;
  emptyState?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({
  headers = [],
  rows = [],
  className = "",
  emptyState = "No data available",
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full table-auto border-collapse border border-grey-100">
        <thead>
          <tr className="rounded-[16px] bg-grey-25 text-xs font-[500] text-grey-400">
            {headers.map((header, index) => (
              <th
                key={index}
                className="border border-grey-100 px-4 py-[11px] text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length + 1}
                className="border border-grey-100 px-4 py-[11px] text-center"
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-grey-50 bg-white text-xs font-[500] text-grey-900"
              >
                {row.data.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-grey-100 px-4 py-[20px] text-start"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

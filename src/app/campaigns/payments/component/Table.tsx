import React from "react";

interface TableCell {
  content: React.ReactNode;
  className?: string;
}

interface TableRow {
  image?: React.ReactNode;
  data: TableCell[];
}

interface TableProps {
  headers?: React.ReactNode[];
  rows?: TableRow[];
  className?: string;
  emptyState?: React.ReactNode;
  highlightFirstCell?: boolean;
}

const Table: React.FC<TableProps> = ({
  headers = [],
  rows = [],
  className = "",
  emptyState = "No data available",
  highlightFirstCell = false,
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full table-auto">
        <thead>
          <tr className="rounded-[16px] bg-[#31bc86] text-[16px] font-[700] text-[#ffffff] text-center">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-[11px] text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="border border-grey-100 px-4 py-[11px] text-center"
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#d9f1e7] bg-white text-[16px] font-[400] text-grey-900 text-center"
              >
                {row.data.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-grey-100 px-4 py-[4px] text-center ${
                      cellIndex === 0 && highlightFirstCell
                        ? "bg-[#2ea879] border-none text-[#ffffff]"
                        : ""
                    } ${cell.className || "bg-[#f5f5f5] border-none"}`}
                  >
                    {cell.content}
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

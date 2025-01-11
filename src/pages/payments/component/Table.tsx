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
          <tr className="rounded-[16px] bg-[#31bc86] text-xs font-[500] text-[#ffffff]">
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-[11px] text-left">
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
                className="hover:bg-grey-50 bg-white text-xs font-[500] text-grey-900"
              >
                {row.data.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-grey-100 px-4 py-[20px] text-start ${
                      highlightFirstCell && cellIndex === 0
                        ? "bg-[#31bc86] border-none text-[#ffffff]"
                        : ""
                    }`}
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

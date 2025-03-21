import React from "react";

interface TableRow {
  image?: React.ReactNode;
  data: React.ReactNode[];
}

interface Header {
  content: React.ReactNode;
  align?: "left" | "center" | "right";
}

interface TableProps {
  headers?: Header[];
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
          <tr className="rounded-[16px] bg-[#31bc86] text-[16px] font-[700] text-[#ffffff]">
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-4 py-[11px] ${
                  header.align === "center"
                    ? "text-center"
                    : header.align === "right"
                      ? "text-right"
                      : "text-left"
                }`}
              >
                {header.content}
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
                className="text-[16px] font-[400] text-grey-900"
              >
                {row.data.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-grey-100 px-4 py-[4px] ${
                      highlightFirstCell && cellIndex === 0
                        ? "bg-[#2ea879] text-[#ffffff] border-none"
                        : "bg-[#f5f5f5] text-[#212529]"
                    } ${
                      headers[cellIndex]?.align === "center"
                        ? "text-center"
                        : headers[cellIndex]?.align === "right"
                          ? "text-right"
                          : "text-left"
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

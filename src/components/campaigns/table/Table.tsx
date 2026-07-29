import React from "react";
import { cn } from "@/lib/utils";

export interface TableHeader {
  content: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface TableRow {
  id?: string | number;
  data: React.ReactNode[];
  className?: string;
}

interface TableProps {
  headers?: TableHeader[];
  rows?: TableRow[];
  className?: string;
  emptyState?: React.ReactNode;
  highlightFirstCell?: boolean;
  "aria-label"?: string;
}

const getAlignmentClass = (align?: TableHeader["align"]) => {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
};

const Table: React.FC<TableProps> = ({
  headers = [],
  rows = [],
  className = "",
  emptyState = "No data available",
  highlightFirstCell = false,
  "aria-label": ariaLabel,
}) => {
  const columnCount = Math.max(headers.length, 1);

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full table-auto" aria-label={ariaLabel}>
        <thead>
          <tr className="rounded-[16px] bg-[#31bc86] text-[16px] font-bold text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  "px-4 py-[11px]",
                  getAlignmentClass(header.align),
                  header.className,
                )}
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
                colSpan={columnCount}
                className="border border-grey-100 px-4 py-[11px] text-center"
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                className={cn(
                  "text-[16px] font-normal text-grey-900",
                  row.className,
                )}
              >
                {row.data.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "border border-grey-100 px-4 py-[4px]",
                      highlightFirstCell && cellIndex === 0
                        ? "border-none bg-[#2ea879] text-white"
                        : "bg-[#f5f5f5] text-[#212529]",
                      getAlignmentClass(headers[cellIndex]?.align),
                    )}
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

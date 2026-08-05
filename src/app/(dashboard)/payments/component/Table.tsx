import React from "react";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "overflow-x-auto rounded-[8px] border border-border bg-card",
        className,
      )}
    >
      <table className="w-full table-auto text-foreground">
        <thead>
          <tr className="rounded-2xl bg-[#31bc86] text-center text-[16px] text-white dark:bg-[#17954c]">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-[11px] font-medium text-center"
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
                colSpan={headers.length}
                className="border border-border px-4 py-[11px] text-center text-muted-foreground"
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-card text-center text-[16px] font-[400] text-foreground hover:bg-muted/70"
              >
                {row.data.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`border border-border px-4 py-[4px] text-center ${
                      cellIndex === 0 && highlightFirstCell
                        ? "border-none bg-[#2ea879] text-white dark:bg-[#17954c]"
                        : ""
                    } ${cell.className || "border-none bg-muted/60 text-foreground"}`}
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

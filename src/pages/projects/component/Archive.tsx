import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Table from "./Table";
import { BsCurrencyDollar } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";

interface ProjectsProps {
  filterVisible: boolean;
}

const Archive: React.FC<ProjectsProps> = ({ filterVisible }) => {
  const headers = [
    "Title",
    "Vendor",
    "Subvendor",
    "Date",
    "Code",
    "Pin",
    "Manage",
    "Action",
  ];

  const rows = [
    {
      data: [
        "Arroweye",
        "Johnson",
        "John",
        "21/06/2024",
        "Cult Wife Inc",
        "	334343",
        "Delete",

        <div key="action-buttons-1" className="flex justify-center gap-2">
          <div className="p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full">
            <BsCurrencyDollar />
          </div>
        </div>,
      ],
    },
  ];

  return (
    <div className="rounded-[16px] border bg-grey-25 p-[16px]">
      {filterVisible && (
        <div className="flex items-end gap-[10px] my-[10px]">
          <div className="max-w-[200px] w-full rounded-full">
            <SelectInput
              options={[
                { value: "", label: "Investment" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <div className="max-w-[200px] w-full rounded-full">
            <SelectInput
              options={[
                { value: "", label: "Revenue" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <p className="cursor-pointer rounded-[4px] px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}

      <Table
        headers={headers}
        rows={rows}
        emptyState={
          <div className="flex h-[50vh] flex-col items-center justify-center text-center">
            <Image
              src="/product/emptyState.svg"
              width={100}
              height={100}
              alt="empty state"
            />
            <div className="my-[32px]">
              <p className="text-[20px] font-[600] text-grey-400">
                You have not created any Product
              </p>

              <p className="text-[16px] font-[400] text-grey-400">
                Start your selling journey by creating your first product
              </p>
            </div>

            <Link href="/products/add-product">
              <Button label="Add Product" />
            </Link>
          </div>
        }
      />
    </div>
  );
};
export default Archive;

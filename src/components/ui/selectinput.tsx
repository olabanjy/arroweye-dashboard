// import React, { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { FiInfo } from "react-icons/fi";
// import { GoArrowDown } from "react-icons/go";

// interface SelectInputProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   label?: string;
//   options: { value: string | number; label: string }[];
//   error?: string;
//   info?: string;
//   labelText?: string;
//   value?: string | number;
//   onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   name?: string;
//   rounded?: boolean;
// }

// const SelectInput = React.forwardRef<HTMLDivElement, SelectInputProps>(
//   (
//     {
//       label,
//       options,
//       className,
//       error,
//       info,
//       labelText,
//       value,
//       onChange,
//       name,
//       rounded,
//     },
//     ref
//   ) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedValue, setSelectedValue] = useState<string | number>(
//       value || ""
//     );

//     useEffect(() => {
//       if (value !== undefined) {
//         setSelectedValue(value);
//       }
//     }, [value]);

//     const handleSelect = (newValue: string | number) => {
//       setSelectedValue(newValue);
//       setIsOpen(false);

//       if (onChange && name) {
//         const syntheticEvent = {
//           target: {
//             name: name,
//             value: newValue.toString(),
//           },
//         } as React.ChangeEvent<HTMLSelectElement>;

//         onChange(syntheticEvent);
//       }
//     };

//     const selectedLabel = options.find(
//       (opt) => opt.value === selectedValue
//     )?.label;

//     return (
//       <div className="flex flex-col space-y-2" ref={ref}>
//         <div className="flex items-center space-x-2">
//           {label && (
//             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//               {label}
//             </label>
//           )}
//           {info && (
//             <div className="relative group">
//               <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
//               <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden w-48 p-2 text-xs text-white bg-black rounded-lg group-hover:block">
//                 {info}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="relative">
//           <div
//             onClick={() => setIsOpen(!isOpen)}
//             className={cn(
//               "block w-full  border border-black bg-white px-4  pr-10 text-sm text-gray-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-300",
//               rounded ? "rounded-full py-[4px]" : "rounded-[8px] py-[12px]",
//               error && "border-red-500 focus:ring-red-500",
//               className
//             )}
//           >
//             <span>{selectedLabel || labelText || "Select an option"}</span>
//             <GoArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
//           </div>

//           {isOpen && (
//             <div className="absolute left-0  mt-1 bg-white shadow-lg rounded-[8px] z-10 dark:bg-gray-900 max-w-[120px] w-full">
//               {options.map((option) => (
//                 <div
//                   key={option.value}
//                   onClick={() => handleSelect(option.value)}
//                   className="px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
//                 >
//                   {option.label}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {error && <p className="text-sm text-red-500">{error}</p>}
//       </div>
//     );
//   }
// );

// SelectInput.displayName = "SelectInput";

// export { SelectInput };

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import { FiInfo } from "react-icons/fi";
import { GoArrowDown } from "react-icons/go";

interface DropdownInputProps {
  label?: string;
  options: { value: string | number; label: string }[];
  error?: string;
  info?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  name?: string;
  icon?: boolean;
  placeholder?: string;
  rounded?: boolean;
}

const SelectInput: React.FC<DropdownInputProps> = ({
  label,
  options,
  error,
  info,
  value,
  onChange,
  icon,
  placeholder = "Select an option",
  rounded,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number>(
    value || ""
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (newValue: string | number) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onChange) {
      onChange(newValue);
    }
  };

  const selectedLabel = options.find(
    (opt) => opt.value === selectedValue
  )?.label;

  return (
    <div className="flex flex-col space-y-2 font-IBM">
      <div className="flex items-center space-x-2">
        {label && (
          <label className="tracking-[.1rem] text-[12px] font-[400] text-[#212529] leading-[18px]">
            {label}
          </label>
        )}
        {info && (
          <div className="relative group">
            <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden w-48 p-2 text-xs text-white bg-black rounded-lg group-hover:block">
              {info}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "relative block w-full border border-gray-300 bg-white pl-4 pr-10 text-sm text-gray-900 shadow-sm cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-300",
            rounded ? "rounded-full py-[5px]" : "rounded-[8px] py-[12px]",
            error && "border-red-500 focus:ring-red-500"
          )}
        >
          <div className="flex items-center">
            <span>{selectedLabel || placeholder}</span>
          </div>

          <div className="absolute inset-y-0 right-3 flex items-center space-x-2 pointer-events-none">
            {icon === true ? (
              <GoArrowDown />
            ) : (
              <HiMiniChevronUpDown className="text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute left-0 mt-1 bg-white shadow-lg rounded-[8px] z-10 dark:bg-gray-900 w-full max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "px-[16px] py-2 text-sm font-IBM text-gray-900 cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
                  selectedValue === option.value &&
                    "bg-gray-100 dark:bg-gray-700"
                )}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export { SelectInput };

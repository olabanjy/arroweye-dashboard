import { Input } from "@/components/ui/input";
import React, { useState, useRef, useEffect } from "react";

interface EmailInputWithSuggestionsProps {
  staffDetails: any[];
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStaffSelect: (staff: any) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  inputClassName?: string;
}

const EmailInputWithSuggestions: React.FC<EmailInputWithSuggestionsProps> = ({
  staffDetails,
  value,
  name,
  onChange,
  onStaffSelect,
  error,
  placeholder,
  required,
  inputClassName,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const inputRef = useRef<HTMLDivElement>(null);

  // Filter staff members based on the input value
  useEffect(() => {
    if (value.trim() === "") {
      setFilteredStaff(staffDetails);
    } else {
      const filtered = staffDetails.filter(
        (staff) =>
          staff.staff_email &&
          staff.staff_email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  }, [value, staffDetails]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (staff: any) => {
    // Create a synthetic event to update the email field
    if (staff.staff_email) {
      const syntheticEvent = {
        target: {
          name,
          value: staff.staff_email,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }

    // Update the fullname and role fields through the parent component
    onStaffSelect(staff);
    setShowSuggestions(false);
  };

  return (
    <div className="relative" ref={inputRef}>
      <Input
        type="email"
        placeholder={placeholder || "Add email"}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        error={error}
        autoComplete="off"
        className={inputClassName}
      />

      {showSuggestions && filteredStaff.length > 0 && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-[6px] border border-zinc-300 bg-white shadow-none dark:border-zinc-600 dark:bg-zinc-800">
          {filteredStaff.map(
            (staff) =>
              staff.staff_email && (
                <div
                  key={staff.id}
                  className="flex cursor-pointer flex-col px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  onClick={() => handleSuggestionClick(staff)}
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {staff.staff_email}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {staff.fullname} - {staff.role}
                  </span>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default EmailInputWithSuggestions;

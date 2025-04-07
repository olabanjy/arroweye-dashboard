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
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Initialize search text on component mount
  useEffect(() => {
    if (value) {
      setSearchText(value);
      // Find if this value matches a staff member
      const matchingStaff = staffDetails.find(
        (staff) => staff.staff_email === value
      );
      if (matchingStaff) {
        setSelectedStaff(matchingStaff);
      }
    }
  }, []);

  // Filter staff members based on the search text
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredStaff(staffDetails);
    } else {
      const filtered = staffDetails.filter(
        (staff) =>
          staff.staff_email &&
          staff.staff_email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  }, [searchText, staffDetails]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);

        // Reset to the last valid selection if the input doesn't match any staff
        if (selectedStaff && selectedStaff.staff_email !== searchText) {
          setSearchText(selectedStaff.staff_email || "");
        } else if (!selectedStaff && searchText) {
          // Clear the input if there's no valid selection
          setSearchText("");

          // Send an empty value through onChange
          const syntheticEvent = {
            target: {
              name,
              value: "",
            },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedStaff, searchText, name, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow typing to search but don't update the actual form value yet
    setSearchText(e.target.value);

    // Clear selected staff when user changes input
    if (selectedStaff && selectedStaff.staff_email !== e.target.value) {
      setSelectedStaff(null);
    }

    // Show suggestions as user types
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (staff: any) => {
    if (staff.staff_email) {
      // Update the search text
      setSearchText(staff.staff_email);

      // Store the selected staff
      setSelectedStaff(staff);

      // Update the form field through onChange
      const syntheticEvent = {
        target: {
          name,
          value: staff.staff_email,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);

      // Update other fields through parent
      onStaffSelect(staff);

      // Hide suggestions
      setShowSuggestions(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear selection on backspace or delete
    if ((e.key === "Backspace" || e.key === "Delete") && selectedStaff) {
      setSelectedStaff(null);
      setSearchText("");

      // Update form with empty value
      const syntheticEvent = {
        target: {
          name,
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="relative" ref={inputRef}>
      <Input
        type="email"
        placeholder={placeholder || "Add email"}
        name={name}
        required={required}
        value={searchText}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        autoComplete="off"
        className={selectedStaff ? "bg-blue-50" : undefined}
        error={error}
      />

      {showSuggestions && filteredStaff.length > 0 && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
          {filteredStaff.map(
            (staff) =>
              staff.staff_email && (
                <div
                  key={staff.id}
                  className={`px-4 py-5 cursor-pointer hover:bg-gray-100 flex flex-col ${selectedStaff && selectedStaff.id === staff.id ? "bg-blue-50" : ""}`}
                  onClick={() => handleSuggestionClick(staff)}
                >
                  <span className="text-lg font-semibold text-black mb-2">
                    {staff.fullname}
                  </span>
                  <span className="text-sm text-gray-600">
                    {staff.staff_email}
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

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input"; // Adjust import path as needed

interface AutocompleteInputProps {
  name: string;
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  type?: string;
  minChars?: number;
  maxSuggestions?: number;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  type = "text",
  minChars = 2,
  maxSuggestions = 5,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only generate suggestions if we have enough characters
    if (value && value.length >= minChars) {
      // Generate suggestions based on the input
      const generatedSuggestions = generateSuggestions(value, maxSuggestions);
      setSuggestions(generatedSuggestions);
      setShowOptions(generatedSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowOptions(false);
    }
  }, [value, minChars, maxSuggestions]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleOptionClick = (option: string) => {
    // Create an event object compatible with handleFormChange
    const syntheticEvent = {
      target: {
        name,
        value: option,
      },
    };

    onChange(syntheticEvent);
    setShowOptions(false);
  };

  // Advanced function to generate contextual suggestions
  const generateSuggestions = (input: string, max: number): string[] => {
    const baseInput = input.trim();
    const words = baseInput.split(/\s+/);
    const lastWord = words[words.length - 1].toLowerCase();
    const allButLastWord = words.slice(0, words.length - 1).join(" ");

    // For event titles, generate more sophisticated completions
    if (name === "title") {
      const suggestions = new Set<string>();

      // 1. Common event type completions
      const eventTypes = [
        "Workshop",
        "Conference",
        "Symposium",
        "Summit",
        "Webinar",
        "Seminar",
        "Forum",
        "Meetup",
        "Hackathon",
        "Roundtable",
        "Masterclass",
        "Training",
        "Expo",
        "Convention",
      ];

      // 2. Industry-specific prefixes
      const industries = [
        "Tech",
        "Healthcare",
        "Finance",
        "Marketing",
        "Leadership",
        "Design",
        "Innovation",
        "Product",
        "Strategy",
        "AI",
      ];

      // 3. Event modifiers
      const modifiers = [
        "Annual",
        "Quarterly",
        "Virtual",
        "Global",
        "Regional",
        "International",
        "Executive",
        "Interactive",
        "Hands-on",
      ];

      // 4. Time-based phrases
      const timePhrases = [
        "2025",
        "Spring",
        "Summer",
        "Fall",
        "Winter",
        "Q1",
        "Q2",
        "Q3",
        "Q4",
      ];

      // If we're completing a type
      if (lastWord.length >= 2) {
        // Complete the current word being typed
        [...eventTypes, ...industries].forEach((type) => {
          if (type.toLowerCase().startsWith(lastWord)) {
            if (allButLastWord) {
              suggestions.add(`${allButLastWord} ${type}`);
            } else {
              suggestions.add(type);
            }
          }
        });
      }

      // Always add some full suggestions
      suggestions.add(`${baseInput} Workshop`);
      suggestions.add(`${baseInput} Conference`);

      // Add industry-specific event suggestions
      industries.forEach((industry) => {
        if (baseInput.toLowerCase().includes(industry.toLowerCase())) {
          suggestions.add(`${baseInput} Summit`);
          suggestions.add(`Annual ${baseInput}`);
        } else if (Math.random() > 0.7) {
          // Randomly add some industry suggestions
          suggestions.add(`${industry} ${baseInput}`);
        }
      });

      // Add time-based suggestions
      if (!baseInput.match(/\b(20\d{2}|q[1-4]|spring|summer|fall|winter)\b/i)) {
        const randomTime =
          timePhrases[Math.floor(Math.random() * timePhrases.length)];
        suggestions.add(`${baseInput} ${randomTime}`);
      }

      // Add modifier-based suggestions
      modifiers.forEach((modifier) => {
        if (
          !baseInput.toLowerCase().includes(modifier.toLowerCase()) &&
          Math.random() > 0.7
        ) {
          suggestions.add(`${modifier} ${baseInput}`);
        }
      });

      // Generate some advanced contextual suggestions based on keywords
      if (
        baseInput.toLowerCase().includes("tech") ||
        baseInput.toLowerCase().includes("technology")
      ) {
        suggestions.add(`${baseInput}: Innovation in Action`);
        suggestions.add(`Future of Tech: ${baseInput}`);
      }

      if (
        baseInput.toLowerCase().includes("leadership") ||
        baseInput.toLowerCase().includes("manage")
      ) {
        suggestions.add(`Leadership Summit: ${baseInput}`);
        suggestions.add(`Executive Roundtable: ${baseInput}`);
      }

      if (
        baseInput.toLowerCase().includes("training") ||
        baseInput.toLowerCase().includes("learn")
      ) {
        suggestions.add(`${baseInput} Masterclass`);
        suggestions.add(`Hands-on Training: ${baseInput}`);
      }

      // Filter out duplicates and ones matching the original input
      return Array.from(suggestions)
        .filter((s) => s.toLowerCase() !== baseInput.toLowerCase())
        .slice(0, max);
    }

    // For other input types, customize as needed
    return [];
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type={type}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
      />

      {showOptions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-[14px] font-IBM"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;

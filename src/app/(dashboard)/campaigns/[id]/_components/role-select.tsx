import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_OPTIONS = [
  { value: "Manager", label: "Manager" },
  { value: "Supervisor", label: "Supervisor" },
  { value: "Agent", label: "Agent" },
];

interface RoleSelectProps {
  value?: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function RoleSelect({
  value,
  onChange,
  placeholder = "Choose Role",
  error,
}: RoleSelectProps) {
  return (
    <div className="space-y-2 font-SansFlex">
      <Select
        value={value !== undefined && value !== null ? String(value) : ""}
        onValueChange={onChange}
      >
        <SelectTrigger
          className={cn(
            "h-[51px] rounded-[8px] border-black bg-white px-4 text-[14px] text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white",
            error && "border-red-500 focus:ring-red-500",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

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
            "h-11 w-full rounded-[6px] border-zinc-300 bg-white px-4 text-[14px] text-zinc-950 shadow-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 [&>span]:line-clamp-1",
            error && "border-red-500 focus:ring-red-500",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="overflow-hidden rounded-[8px] border-zinc-200 bg-white p-1 text-zinc-950 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 [&_[data-radix-select-viewport]]:rounded-[6px]">
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

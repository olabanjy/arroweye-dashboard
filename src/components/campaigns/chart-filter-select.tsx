import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartFilterSelectProps {
  options: Array<{ value: string | number; label: string }>;
  value?: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const EMPTY_SELECT_VALUE = "__chart_filter_empty__";

export function ChartFilterSelect({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  className,
}: ChartFilterSelectProps) {
  const selectValue =
    value === undefined
      ? undefined
      : String(value) === ""
        ? EMPTY_SELECT_VALUE
        : String(value);

  return (
    <Select
      value={selectValue}
      onValueChange={(nextValue) =>
        onChange?.(nextValue === EMPTY_SELECT_VALUE ? "" : nextValue)
      }
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const optionValue = String(option.value);

          return (
            <SelectItem
              key={`${optionValue}-${option.label}`}
              value={optionValue === "" ? EMPTY_SELECT_VALUE : optionValue}
            >
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

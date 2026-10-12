import { format, isValid, parse } from "date-fns";

const TIME_STEP_MINUTES = 15;

export const DEFAULT_START_TIME = "09:00";
export const DEFAULT_END_TIME = "10:00";

export type TimeOption = { value: string; label: string };

// Form values use the local "YYYY-MM-DDTHH:mm" shape.
export const splitDateTime = (value?: string) => {
  const [date = "", time = ""] = (value ?? "").split("T");
  return { date, time: time.slice(0, 5) };
};

export const joinDateTime = (date: string, time: string) =>
  date && time ? `${date}T${time}` : "";

export const toDateKey = (date: Date) => format(date, "yyyy-MM-dd");

export const parseDateKey = (dateKey: string) => {
  const date = parse(dateKey, "yyyy-MM-dd", new Date());
  return isValid(date) ? date : undefined;
};

export const formatDateLabel = (dateKey: string) => {
  const date = parseDateKey(dateKey);
  return date ? format(date, "EEE, MMM d, yyyy") : "";
};

const formatTimeLabel = (time: string) =>
  format(parse(time, "HH:mm", new Date()), "h:mm a");

const BASE_TIME_OPTIONS: TimeOption[] = Array.from(
  { length: (24 * 60) / TIME_STEP_MINUTES },
  (_, index) => {
    const minutes = index * TIME_STEP_MINUTES;
    const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    return { value, label: formatTimeLabel(value) };
  },
);

export const formatTimeRange = (
  startDateTime?: string,
  endDateTime?: string,
) => {
  const start = splitDateTime(startDateTime);
  const end = splitDateTime(endDateTime);
  if (!start.time) return "";
  if (!end.time) return formatTimeLabel(start.time);

  const endLabel =
    end.date && end.date !== start.date
      ? `${formatDateLabel(end.date)}, ${formatTimeLabel(end.time)}`
      : formatTimeLabel(end.time);
  return `${formatTimeLabel(start.time)} – ${endLabel}`;
};

// Existing events can sit off the 15-minute grid; keep their time selectable.
export const getTimeOptions = (current?: string): TimeOption[] => {
  if (!current || BASE_TIME_OPTIONS.some((o) => o.value === current)) {
    return BASE_TIME_OPTIONS;
  }

  return [
    ...BASE_TIME_OPTIONS,
    { value: current, label: formatTimeLabel(current) },
  ].sort((a, b) => a.value.localeCompare(b.value));
};

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WEEK_KEYS = ["week_1", "week_2", "week_3", "week_4"] as const;

const inputClassName =
  "!h-11 !rounded-[6px] !border-zinc-300 !bg-white !px-3 !text-[14px] !text-zinc-950 !shadow-none focus-visible:!ring-2 focus-visible:!ring-violet-500/25 dark:!border-zinc-600 dark:!bg-zinc-800 dark:!text-zinc-100";

const selectTriggerClassName =
  "h-11 rounded-[6px] border-zinc-300 bg-white px-4 text-[14px] text-zinc-950 shadow-none focus:ring-2 focus:ring-violet-500/25 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100";

const selectContentClassName =
  "overflow-hidden rounded-[8px] border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 [&_[data-radix-select-viewport]]:rounded-[6px]";

export type WeekKey = (typeof WEEK_KEYS)[number];

export interface DataEditorOption {
  id: number;
  label: string;
}

export interface DataEditorRow {
  key: string;
  statId?: number;
  optionId: number;
  label: string;
  persisted: boolean;
  week_1: string;
  week_2: string;
  week_3: string;
  week_4: string;
}

export interface DataEditorSource {
  id: number;
  label: string;
  options: DataEditorOption[];
  rows: DataEditorRow[];
}

interface CampaignDataEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemLabel: string;
  sources: DataEditorSource[];
  onCreateOption?: (source: DataEditorSource) => void;
  onSubmit: (source: DataEditorSource, rows: DataEditorRow[]) => Promise<void>;
}

const rowsFromSources = (sources: DataEditorSource[]) =>
  Object.fromEntries(
    sources.map((source) => [
      String(source.id),
      source.rows.map((row) => ({ ...row })),
    ]),
  );

const rowHasChanges = (row: DataEditorRow, originalRow?: DataEditorRow) => {
  if (!row.persisted) return true;
  if (!originalRow) return true;

  return WEEK_KEYS.some(
    (week) => Number(row[week]) !== Number(originalRow[week]),
  );
};

export default function CampaignDataEditor({
  open,
  onOpenChange,
  title,
  description,
  itemLabel,
  sources,
  onCreateOption,
  onSubmit,
}: CampaignDataEditorProps) {
  const [activeSourceId, setActiveSourceId] = useState("");
  const [rowsBySource, setRowsBySource] = useState<
    Record<string, DataEditorRow[]>
  >({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || sources.length === 0) return;

    setActiveSourceId((current) =>
      sources.some((source) => String(source.id) === current)
        ? current
        : String(sources[0].id),
    );
    setRowsBySource(rowsFromSources(sources));
    setErrors({});
  }, [open, sources]);

  const activeSource =
    sources.find((source) => String(source.id) === activeSourceId) ??
    sources[0];
  const activeRows = activeSource
    ? (rowsBySource[String(activeSource.id)] ?? [])
    : [];

  const availableOptions = useMemo(() => {
    const usedIds = new Set(activeRows.map((row) => row.optionId));
    return (
      activeSource?.options.filter((option) => !usedIds.has(option.id)) ?? []
    );
  }, [activeRows, activeSource]);

  const updateRows = (updater: (rows: DataEditorRow[]) => DataEditorRow[]) => {
    if (!activeSource) return;
    const sourceKey = String(activeSource.id);
    setRowsBySource((current) => ({
      ...current,
      [sourceKey]: updater(current[sourceKey] ?? []),
    }));
  };

  const addRow = (optionId: string) => {
    const option = availableOptions.find(
      (item) => item.id === Number(optionId),
    );
    if (!option) return;

    updateRows((rows) => [
      ...rows,
      {
        key: `new-${activeSource.id}-${option.id}`,
        optionId: option.id,
        label: option.label,
        persisted: false,
        week_1: "",
        week_2: "",
        week_3: "",
        week_4: "",
      },
    ]);
  };

  const updateWeek = (rowKey: string, week: WeekKey, value: string) => {
    updateRows((rows) =>
      rows.map((row) => (row.key === rowKey ? { ...row, [week]: value } : row)),
    );
    setErrors((current) => {
      const next = { ...current };
      delete next[`${rowKey}-${week}`];
      return next;
    });
  };

  const removeNewRow = (rowKey: string) => {
    updateRows((rows) => rows.filter((row) => row.key !== rowKey));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeSource || activeRows.length === 0) return;

    const nextErrors: Record<string, string> = {};
    activeRows.forEach((row) => {
      WEEK_KEYS.forEach((week) => {
        const value = row[week].trim();
        if (
          value === "" ||
          !Number.isFinite(Number(value)) ||
          Number(value) < 0
        ) {
          nextErrors[`${row.key}-${week}`] = "Enter a value of 0 or more.";
        }
      });
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const changedRows = activeRows.filter((row) =>
      rowHasChanges(
        row,
        activeSource.rows.find((sourceRow) => sourceRow.key === row.key),
      ),
    );

    if (changedRows.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(activeSource, changedRows);
    } catch {
      // The API layer displays the server error; keep the editor open.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-[920px]">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.16rem] text-zinc-500 dark:text-zinc-400">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>

        {sources.length > 0 ? (
          <form className="contents" onSubmit={handleSubmit}>
            <Tabs
              value={activeSourceId}
              onValueChange={(value) => {
                setActiveSourceId(value);
                setErrors({});
              }}
              className="mt-4 border-b border-zinc-200 dark:border-zinc-700"
            >
              <TabsList className="h-auto max-w-full justify-start overflow-x-auto rounded-none p-0">
                {sources.map((source) => (
                  <TabsTrigger
                    key={source.id}
                    value={String(source.id)}
                    className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-normal text-zinc-500 data-[state=active]:border-zinc-950 data-[state=active]:font-medium data-[state=active]:text-zinc-950 dark:text-zinc-400 dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:text-zinc-100"
                  >
                    {source.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex min-h-0 flex-1 flex-col gap-5 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <Field className="max-w-sm gap-1.5">
                  <FieldLabel className="text-[12px] font-medium text-zinc-600 dark:text-zinc-300">
                    Add {itemLabel.toLowerCase()}
                  </FieldLabel>
                  <Select onValueChange={addRow} value="">
                    <SelectTrigger
                      disabled={availableOptions.length === 0}
                      className={selectTriggerClassName}
                    >
                      <SelectValue
                        placeholder={
                          availableOptions.length > 0
                            ? `Select ${itemLabel.toLowerCase()}`
                            : `All ${itemLabel.toLowerCase()}s have been added`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className={selectContentClassName}>
                      {availableOptions.map((option) => (
                        <SelectItem key={option.id} value={String(option.id)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                {onCreateOption && activeSource && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-full border-zinc-300 px-5 text-sm hover:bg-zinc-100 active:scale-[0.97] dark:border-zinc-600 dark:hover:bg-zinc-800"
                    onClick={() => onCreateOption(activeSource)}
                  >
                    <Plus className="size-4" />
                    Create new {itemLabel.toLowerCase()}
                  </Button>
                )}
              </div>

              <ScrollArea className="h-[min(48vh,28rem)] rounded-xl border border-zinc-200 dark:border-zinc-700">
                <Table className="min-w-[760px]">
                  <TableHeader className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-800">
                    <TableRow className="border-zinc-200 hover:bg-transparent dark:border-zinc-700">
                      <TableHead className="h-11 w-[220px] px-4 text-[12px] font-medium text-zinc-500">
                        {itemLabel}
                      </TableHead>
                      {WEEK_KEYS.map((week, index) => (
                        <TableHead
                          key={week}
                          className="h-11 text-[12px] font-medium text-zinc-500"
                        >
                          Week {index + 1}
                        </TableHead>
                      ))}
                      <TableHead className="w-12">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-32 text-center text-muted-foreground"
                        >
                          No data added for {activeSource?.label}.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeRows.map((row) => (
                        <TableRow
                          key={row.key}
                          className="border-zinc-200 hover:bg-zinc-50/60 dark:border-zinc-700 dark:hover:bg-zinc-800/40"
                        >
                          <TableCell className="px-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {row.label}
                          </TableCell>
                          {WEEK_KEYS.map((week, index) => {
                            const error = errors[`${row.key}-${week}`];
                            return (
                              <TableCell
                                key={week}
                                className="min-w-36 align-top"
                              >
                                <Field data-invalid={Boolean(error)}>
                                  <FieldLabel
                                    htmlFor={`${row.key}-${week}`}
                                    className="sr-only"
                                  >
                                    {row.label}, week {index + 1}
                                  </FieldLabel>
                                  <Input
                                    id={`${row.key}-${week}`}
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    value={row[week]}
                                    aria-invalid={Boolean(error)}
                                    className={inputClassName}
                                    onChange={(event) =>
                                      updateWeek(
                                        row.key,
                                        week,
                                        event.target.value,
                                      )
                                    }
                                  />
                                  <FieldError>{error}</FieldError>
                                </Field>
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            {!row.persisted && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-full text-zinc-500 hover:bg-red-50 hover:text-red-600 active:scale-[0.94]"
                                onClick={() => removeNewRow(row.key)}
                                aria-label={`Remove ${row.label}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-full border-zinc-300 px-5 text-sm hover:bg-zinc-100 active:scale-[0.97] dark:border-zinc-600 dark:hover:bg-zinc-800"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || activeRows.length === 0}
                className="h-9 rounded-full bg-[#5300d7] px-5 text-sm text-white hover:bg-[#4700b8] active:scale-[0.97]"
              >
                <Save className="size-4" />
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No data sources are available.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

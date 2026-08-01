"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";

import { CreateMetric } from "@/services";
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

const inputClassName =
  "!h-11 !rounded-[6px] !border-zinc-300 !bg-white !text-[14px] !text-zinc-950 !shadow-none focus-visible:!ring-2 focus-visible:!ring-violet-500/25 dark:!border-zinc-600 dark:!bg-zinc-800 dark:!text-zinc-100";

interface CreateMetricDialogProps {
  open: boolean;
  contextLabel: string;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<void>;
}

export default function CreateMetricDialog({
  open,
  contextLabel,
  onOpenChange,
  onCreated,
}: CreateMetricDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a metric name.");
      return;
    }

    setIsCreating(true);
    try {
      await CreateMetric({ name: name.trim() });
      await onCreated();
      setName("");
      setError("");
      onOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.16rem] text-zinc-500 dark:text-zinc-400">
              Create metric
            </DialogTitle>
            <DialogDescription className="sr-only">
              Add a metric that can be selected for {contextLabel}.
            </DialogDescription>
          </DialogHeader>
          <Field className="py-5" data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="new-metric-name">Metric name</FieldLabel>
            <Input
              id="new-metric-name"
              value={name}
              aria-invalid={Boolean(error)}
              className={inputClassName}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
            />
            <FieldError>{error}</FieldError>
          </Field>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-full border-zinc-300 px-5 text-sm active:scale-[0.97]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="h-9 rounded-full bg-[#5300d7] px-5 text-sm text-white hover:bg-[#4700b8] active:scale-[0.97]"
            >
              <Plus className="size-4" />
              {isCreating ? "Creating..." : "Create metric"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

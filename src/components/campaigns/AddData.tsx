"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";

import { AddAirplayData, CreateChannel, getChannel } from "@/services";
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
import CampaignDataEditor, {
  DataEditorRow,
  DataEditorSource,
} from "./CampaignDataEditor";

interface AddDataProps {
  visible: boolean;
  onHide: () => void;
  onAddDataSuccess: () => void;
  existingAirPlayData: any[];
}

interface Channel {
  id?: string | number;
  name?: string;
  channel?: string;
}

const AIRPLAY_SOURCES = [
  { id: 1, label: "Radio" },
  { id: 2, label: "TV" },
];

const emptyChannel = { name: "", audience: "", impressions: "" };

const inputClassName =
  "!h-11 !rounded-[6px] !border-zinc-300 !bg-white !text-[14px] !text-zinc-950 !shadow-none focus-visible:!ring-2 focus-visible:!ring-violet-500/25 dark:!border-zinc-600 dark:!bg-zinc-800 dark:!text-zinc-100";

const getRows = (items: any[] = [], channel: string): DataEditorRow[] => {
  const rows = new Map<number, DataEditorRow>();

  items
    .filter((item) => item?.airplay?.channel === channel)
    .forEach((item) => {
      const optionId = Number(item.airplay.id);
      const current = rows.get(optionId) ?? {
        key: `saved-${channel}-${optionId}`,
        optionId,
        label: item.airplay.name,
        persisted: true,
        week_1: "0",
        week_2: "0",
        week_3: "0",
        week_4: "0",
      };

      item.airplay_data?.forEach((metric: any) => {
        current.week_1 = String(
          Number(current.week_1) + Number(metric.week_1 || 0),
        );
        current.week_2 = String(
          Number(current.week_2) + Number(metric.week_2 || 0),
        );
        current.week_3 = String(
          Number(current.week_3) + Number(metric.week_3 || 0),
        );
        current.week_4 = String(
          Number(current.week_4) + Number(metric.week_4 || 0),
        );
      });
      rows.set(optionId, current);
    });

  return [...rows.values()];
};

export default function AddData({
  visible,
  onHide,
  onAddDataSuccess,
  existingAirPlayData,
}: AddDataProps) {
  const { id } = useParams<{ id: string }>();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [createSource, setCreateSource] = useState<DataEditorSource | null>(
    null,
  );
  const [channelForm, setChannelForm] = useState(emptyChannel);
  const [channelErrors, setChannelErrors] = useState<Record<string, string>>(
    {},
  );
  const [isCreating, setIsCreating] = useState(false);

  const loadChannels = async () => {
    const result = await getChannel();
    setChannels(Array.isArray(result) ? result : []);
  };

  useEffect(() => {
    void loadChannels();
  }, []);

  const sources = useMemo<DataEditorSource[]>(
    () =>
      AIRPLAY_SOURCES.map((source) => ({
        ...source,
        options: channels
          .filter((channel) => channel.channel === source.label && channel.id)
          .map((channel) => ({
            id: Number(channel.id),
            label: channel.name || "Unnamed channel",
          })),
        rows: getRows(existingAirPlayData, source.label),
      })),
    [channels, existingAirPlayData],
  );

  const handleSave = async (
    source: DataEditorSource,
    rows: DataEditorRow[],
  ) => {
    await AddAirplayData(
      {
        air_play_data: rows.map((row) => ({
          airplay_id: row.optionId,
          metric_id: source.id,
          week_1: Number(row.week_1),
          week_2: Number(row.week_2),
          week_3: Number(row.week_3),
          week_4: Number(row.week_4),
        })),
      },
      Number(id),
    );
    onAddDataSuccess();
    onHide();
  };

  const handleCreateChannel = async (event: FormEvent) => {
    event.preventDefault();
    if (!createSource) return;

    const nextErrors: Record<string, string> = {};
    if (!channelForm.name.trim()) nextErrors.name = "Enter a channel name.";
    if (channelForm.audience === "" || Number(channelForm.audience) < 0)
      nextErrors.audience = "Enter an audience of 0 or more.";
    if (channelForm.impressions === "" || Number(channelForm.impressions) < 0)
      nextErrors.impressions = "Enter impressions of 0 or more.";
    setChannelErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsCreating(true);
    try {
      await CreateChannel({
        name: channelForm.name.trim(),
        audience: Number(channelForm.audience),
        impressions: Number(channelForm.impressions),
        channel: createSource.label,
        metric_ids: [createSource.id],
      });
      await loadChannels();
      setCreateSource(null);
      setChannelForm(emptyChannel);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <CampaignDataEditor
        open={visible}
        onOpenChange={(open) => !open && onHide()}
        title="Airplay data"
        description="Edit saved weekly values or add another channel. Saved channels are removed from the add list."
        itemLabel="Channel"
        sources={sources}
        onCreateOption={setCreateSource}
        onSubmit={handleSave}
      />

      <Dialog
        open={Boolean(createSource)}
        onOpenChange={(open) => !open && setCreateSource(null)}
      >
        <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 sm:max-w-md">
          <form onSubmit={handleCreateChannel}>
            <DialogHeader>
              <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.16rem] text-zinc-500 dark:text-zinc-400">
                Create {createSource?.label} channel
              </DialogTitle>
              <DialogDescription className="sr-only">
                The channel will become available in the add channel list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-5">
              <Field data-invalid={Boolean(channelErrors.name)}>
                <FieldLabel htmlFor="channel-name">Name</FieldLabel>
                <Input
                  id="channel-name"
                  value={channelForm.name}
                  aria-invalid={Boolean(channelErrors.name)}
                  className={inputClassName}
                  onChange={(event) =>
                    setChannelForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
                <FieldError>{channelErrors.name}</FieldError>
              </Field>
              {(["audience", "impressions"] as const).map((field) => (
                <Field key={field} data-invalid={Boolean(channelErrors[field])}>
                  <FieldLabel
                    htmlFor={`channel-${field}`}
                    className="capitalize"
                  >
                    {field}
                  </FieldLabel>
                  <Input
                    id={`channel-${field}`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    value={channelForm[field]}
                    aria-invalid={Boolean(channelErrors[field])}
                    className={inputClassName}
                    onChange={(event) =>
                      setChannelForm((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                  />
                  <FieldError>{channelErrors[field]}</FieldError>
                </Field>
              ))}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-full border-zinc-300 px-5 text-sm active:scale-[0.97]"
                onClick={() => setCreateSource(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="h-9 rounded-full bg-[#5300d7] px-5 text-sm text-white hover:bg-[#4700b8] active:scale-[0.97]"
              >
                <Plus className="size-4" />
                {isCreating ? "Creating..." : "Create channel"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

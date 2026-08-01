"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { CreateDspStats, getDsp, UpdateDspStat } from "@/services";
import CampaignDataEditor, {
  DataEditorRow,
  DataEditorSource,
} from "./CampaignDataEditor";
import CreateMetricDialog from "./CreateMetricDialog";

interface AddDataDspProps {
  visible: boolean;
  onHide: () => void;
  onAddDataSuccess: () => void;
  existingDSPData: any[];
}

interface DspSource {
  id?: string | number;
  name?: string;
  metrics?: Array<{ id?: string | number; name?: string }>;
}

const getRows = (items: any[] = [], sourceName: string): DataEditorRow[] => {
  const rows: DataEditorRow[] = [];

  items
    .filter((item) => item?.dsp?.name === sourceName)
    .forEach((item) => {
      item.dsp_data?.forEach((metric: any) => {
        const statId = Number(metric.id);
        const optionId = Number(metric.metric);
        if (!Number.isFinite(statId) || !Number.isFinite(optionId)) return;

        rows.push({
          key: `saved-${sourceName}-${optionId}-${statId}`,
          statId,
          optionId,
          label: metric.metric_name || "Unnamed metric",
          persisted: true,
          week_1: String(metric.week_1 ?? 0),
          week_2: String(metric.week_2 ?? 0),
          week_3: String(metric.week_3 ?? 0),
          week_4: String(metric.week_4 ?? 0),
        });
      });
    });

  return rows;
};

export default function AddDataDsp({
  visible,
  onHide,
  onAddDataSuccess,
  existingDSPData,
}: AddDataDspProps) {
  const { id } = useParams<{ id: string }>();
  const [catalog, setCatalog] = useState<DspSource[]>([]);
  const [createSource, setCreateSource] = useState<DataEditorSource | null>(
    null,
  );

  const loadCatalog = async () => {
    const result = await getDsp();
    setCatalog(Array.isArray(result) ? result : []);
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const sources = useMemo<DataEditorSource[]>(
    () =>
      catalog
        .filter((source) => source.id)
        .map((source) => ({
          id: Number(source.id),
          label: source.name || "Unnamed DSP",
          options: (source.metrics ?? [])
            .filter((metric) => metric.id)
            .map((metric) => ({
              id: Number(metric.id),
              label: metric.name || "Unnamed metric",
            })),
          rows: getRows(existingDSPData, source.name || ""),
        })),
    [catalog, existingDSPData],
  );

  const handleSave = async (
    source: DataEditorSource,
    rows: DataEditorRow[],
  ) => {
    const existingRows = rows.filter((row) => row.persisted && row.statId);
    const newRows = rows.filter((row) => !row.persisted);

    await Promise.all(
      existingRows.map((row) =>
        UpdateDspStat(
          Number(row.statId),
          {
            metric: row.optionId,
            week_1: Number(row.week_1),
            week_2: Number(row.week_2),
            week_3: Number(row.week_3),
            week_4: Number(row.week_4),
          },
          { showToast: false },
        ),
      ),
    );

    if (newRows.length > 0) {
      await CreateDspStats(
        Number(id),
        {
          dsp_id: source.id,
          dsp_data: newRows.map((row) => ({
            metric_id: row.optionId,
            week_1: Number(row.week_1),
            week_2: Number(row.week_2),
            week_3: Number(row.week_3),
            week_4: Number(row.week_4),
          })),
        },
        { showToast: false },
      );
    }

    toast.success("DSP data saved.");
    onAddDataSuccess();
    onHide();
  };

  return (
    <>
      <CampaignDataEditor
        open={visible}
        onOpenChange={(open) => !open && onHide()}
        title="DSP data"
        description="Edit saved weekly values or add another metric. Saved metrics are removed from the add list."
        itemLabel="Metric"
        sources={sources}
        onCreateOption={setCreateSource}
        onSubmit={handleSave}
      />
      <CreateMetricDialog
        open={Boolean(createSource)}
        contextLabel={createSource?.label || "this DSP"}
        onOpenChange={(open) => !open && setCreateSource(null)}
        onCreated={loadCatalog}
      />
    </>
  );
}

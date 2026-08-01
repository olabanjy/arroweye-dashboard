"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { CreateDspStats, getDsp } from "@/services";
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
  const rows = new Map<number, DataEditorRow>();

  items
    .filter((item) => item?.dsp?.name === sourceName)
    .forEach((item) => {
      item.dsp_data?.forEach((metric: any) => {
        const optionId = Number(metric.metric);
        const current = rows.get(optionId) ?? {
          key: `saved-${sourceName}-${optionId}`,
          optionId,
          label: metric.metric_name,
          persisted: true,
          week_1: "0",
          week_2: "0",
          week_3: "0",
          week_4: "0",
        };
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
        rows.set(optionId, current);
      });
    });

  return [...rows.values()];
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
    await CreateDspStats(Number(id), {
      dsp_id: source.id,
      dsp_data: rows.map((row) => ({
        metric_id: row.optionId,
        week_1: Number(row.week_1),
        week_2: Number(row.week_2),
        week_3: Number(row.week_3),
        week_4: Number(row.week_4),
      })),
    });
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

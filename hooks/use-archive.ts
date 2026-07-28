import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects, archiveProject } from "@/services";

interface UseArchiveProps {
  searchValue: string;
}

export const useArchive = ({ searchValue }: UseArchiveProps) => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [isArchiving, setIsArchiving] = useState<string | null>(null);
  const [copiedPin, setCopiedPin] = useState<string | null>(null);

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const content = projectsData || null;

  const filteredContent = (content || [])
    .filter((item) => item.archived === true)
    .filter((item) =>
      item.title?.toLowerCase().includes(searchValue.toLowerCase()),
    );

  const handleArchiveSubmit = async (projectId: string, archive: boolean) => {
    try {
      setIsArchiving(projectId);
      await archiveProject(Number(projectId), { archived: archive });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditMode(false);
    } catch (error) {
      console.error(
        `Error ${archive ? "archiving" : "unarchiving"} project ${projectId}:`,
        error,
      );
    } finally {
      setIsArchiving(null);
    }
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  return {
    editMode,
    setEditMode,
    isArchiving,
    setIsArchiving,
    copiedPin,
    isLoading,
    filteredContent,
    handleArchiveSubmit,
    handleCopyPin,
  };
};

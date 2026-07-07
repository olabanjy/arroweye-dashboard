import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects, getCreatedCampaigns, archiveProject } from "@/services/api";
import { ContentItem } from "@/types/contents";

import { useAuth } from "@/context/auth-context";

interface UseCampaignsProps {
  searchValue: string;
}

export const useCampaigns = ({ searchValue }: UseCampaignsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdvertiser, userProfile, isLoading: isAuthLoading } = useAuth();
  const userRole = userProfile?.role || "";

  const [editMode, setEditMode] = useState(false);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false);

  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [campaignList, setCampaignList] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isArchiving, setIsArchiving] = useState<number | null>(null);

  const [investmentFilter, setInvestmentFilter] = useState<any>("");
  const [revenueFilter, setRevenueFilter] = useState<any>("");

  const PAGE_SIZE = 10;

  // restore page from URL (e.g. returning from /campaigns/[id])
  useEffect(() => {
    if (!router.isReady) return;
    const p = parseInt(router.query.page as string, 10);
    if (!isNaN(p) && p > 0) setCurrentPage(p);
  }, [router.isReady]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    router.push(
      { pathname: router.pathname, query: { ...router.query, page } },
      undefined,
      { shallow: true },
    );
  };

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: isAuthLoading === false && isAdvertiser === false,
  });

  const isLoading = isAuthLoading
    ? true
    : (isAdvertiser ? isCampaignsLoading : isProjectsLoading);

  const content = isAdvertiser ? [] : (projectsData || null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAdvertiser) {
      return;
    }

    const fetchCampaigns = async () => {
      setIsCampaignsLoading(true);
      try {
        const fetchedContent = await getCreatedCampaigns(
          currentPage,
          PAGE_SIZE,
        );
        setCampaignList(fetchedContent?.results ?? []);
        setTotalPages(fetchedContent?.pages ?? 1);
        setTotalCount(fetchedContent?.count ?? 0);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsCampaignsLoading(false);
      }
    };

    fetchCampaigns();
  }, [isAuthLoading, isAdvertiser, currentPage]);

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const handleArchiveSubmit = async (projectId: number) => {
    try {
      setIsArchiving(projectId);
      await archiveProject(projectId, { archived: true });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setEditMode(false);
    } catch (error) {
      console.error(`Error archiving project ${projectId}:`, error);
    } finally {
      setIsArchiving(null);
    }
  };

  const filteredContent = (content || [])
    .filter(
      (item) =>
        !item.archived &&
        (item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.vendor?.organization_name
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          item.subvendor?.organization_name
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())),
    )
    .sort((a: any, b: any) => {
      if (investmentFilter === "htl") {
        return b.total_investment - a.total_investment;
      } else if (investmentFilter === "lth") {
        return a.total_investment - b.total_investment;
      }
      return 0;
    })
    .sort((a: any, b: any) => {
      if (revenueFilter === "htl") {
        return b.total_revenue - a.total_revenue;
      } else if (revenueFilter === "lth") {
        return a.total_revenue - b.total_revenue;
      }
      return 0;
    });

  const filteredCampaignList = (campaignList || [])
    .filter(
      (item) =>
        item.status === "active" &&
        (item.song_title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.song_artist?.toLowerCase().includes(searchValue.toLowerCase())),
    )
    .sort((a: any, b: any) => {
      if (investmentFilter === "htl") return b.total_tokens - a.total_tokens;
      if (investmentFilter === "lth") return a.total_tokens - b.total_tokens;
      return 0;
    });

  return {
    isLoading,
    isAdvertiser,
    userRole,
    copiedPin,
    currentPage,
    totalPages,
    totalCount,
    isArchiving,
    setIsArchiving,
    investmentFilter,
    setInvestmentFilter,
    revenueFilter,
    setRevenueFilter,
    goToPage,
    handleCopyPin,
    handleArchiveSubmit,
    editMode,
    setEditMode,
    filteredContent,
    filteredCampaignList,
  };
};

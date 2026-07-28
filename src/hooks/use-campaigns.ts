import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects, getCreatedCampaigns, archiveProject } from "@/services";
import { ContentItem } from "@/types/contents";

import { useAuth } from "@/context/auth-session";

interface UseCampaignsProps {
  searchValue: string;
}

interface CampaignListItem {
  id?: number | string;
  song_title?: string;
  song_artist?: string;
  start_date?: string;
  status?: string;
  total_tokens?: number | string;
}

const toNumber = (value: unknown) => {
  const number = Number(value ?? 0);

  return Number.isFinite(number) ? number : 0;
};

export const useCampaigns = ({ searchValue }: UseCampaignsProps) => {
  const router = useRouter();
  const pathname = usePathname() || "/campaigns";
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";
  const queryClient = useQueryClient();
  const { isAdvertiser, userProfile, isLoading: isAuthLoading } = useAuth();
  const userRole = userProfile?.role || "";

  const [editMode, setEditMode] = useState(false);
  const [isCampaignsLoading, setIsCampaignsLoading] = useState(false);

  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [campaignList, setCampaignList] = useState<CampaignListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isArchiving, setIsArchiving] = useState<number | null>(null);

  const [investmentFilter, setInvestmentFilter] = useState<any>("");
  const [revenueFilter, setRevenueFilter] = useState<any>("");

  const PAGE_SIZE = 10;
  const normalizedSearchValue = searchValue.trim().toLowerCase();

  // restore page from URL (e.g. returning from /campaigns/[id])
  useEffect(() => {
    const pageParam = new URLSearchParams(searchParamsString).get("page");
    const page = Number.parseInt(pageParam ?? "", 10);

    if (!Number.isNaN(page) && page > 0) {
      setCurrentPage(page);
    }
  }, [searchParamsString]);

  const goToPage = (page: number) => {
    setCurrentPage(page);

    const params = new URLSearchParams(searchParamsString);
    params.set("page", String(page));

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const { data: projectsData, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: isAuthLoading === false && isAdvertiser === false,
  });

  const isLoading = isAuthLoading
    ? true
    : isAdvertiser
      ? isCampaignsLoading
      : isProjectsLoading;

  const content: ContentItem[] = isAdvertiser ? [] : (projectsData ?? []);

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

  const filteredContent = content
    .filter(
      (item) =>
        !item.archived &&
        (item.title?.toLowerCase().includes(normalizedSearchValue) ||
          item.vendor?.organization_name
            ?.toLowerCase()
            .includes(normalizedSearchValue) ||
          item.subvendor?.organization_name
            ?.toLowerCase()
            .includes(normalizedSearchValue)),
    )
    .sort((a, b) => {
      if (investmentFilter === "htl") {
        return toNumber(b.total_investment) - toNumber(a.total_investment);
      } else if (investmentFilter === "lth") {
        return toNumber(a.total_investment) - toNumber(b.total_investment);
      }
      return 0;
    })
    .sort((a, b) => {
      if (revenueFilter === "htl") {
        return toNumber(b.total_revenue) - toNumber(a.total_revenue);
      } else if (revenueFilter === "lth") {
        return toNumber(a.total_revenue) - toNumber(b.total_revenue);
      }
      return 0;
    });

  const filteredCampaignList = campaignList
    .filter(
      (item) =>
        item.status === "active" &&
        (item.song_title?.toLowerCase().includes(normalizedSearchValue) ||
          item.song_artist?.toLowerCase().includes(normalizedSearchValue)),
    )
    .sort((a, b) => {
      if (investmentFilter === "htl") {
        return toNumber(b.total_tokens) - toNumber(a.total_tokens);
      }
      if (investmentFilter === "lth") {
        return toNumber(a.total_tokens) - toNumber(b.total_tokens);
      }
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

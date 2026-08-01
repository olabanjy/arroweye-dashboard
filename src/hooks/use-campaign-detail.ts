import { useCallback, useEffect, useState } from "react";
import ls from "localstorage-slim";
import {
  getBusinessStaff,
  getSingleCampaign,
  getSingleProject,
  getStoredSingleCampaign,
  getStoredSingleProject,
} from "@/services";
import { ContentItem } from "@/types/contents";

const isNetworkError = (err: any) =>
  !err.response ||
  err.code === "ERR_NETWORK" ||
  err.code === "ECONNABORTED" ||
  err.message?.includes("timeout");

export function useCampaignDetail(id?: string) {
  const [content, setContent] = useState<any | null>(null);
  const [subvendorStaff, setSubVendorStaff] = useState<ContentItem[] | null>(
    null,
  );
  const [staffSuggestions, setStaffSuggestions] = useState<any[]>([]);
  const [userLoggedInProfile, setUserLoggedInProfile] = useState<any>({});
  const [isAdvertiser, setIsAdvertiser] = useState<boolean | null>(null);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  const refreshContent = useCallback(
    (advertiser: boolean | null = isAdvertiser) => {
      if (advertiser === null || !id) return;

      setHasNetworkError(false);

      if (advertiser) {
        getSingleCampaign(Number(id))
          .then((fetchedContent) => {
            setContent(fetchedContent);
          })
          .catch((err) => {
            if (isNetworkError(err)) {
              setHasNetworkError(true);
            }
          });
        return;
      }

      getSingleProject(Number(id))
        .then((fetchedContent) => {
          setSubVendorStaff(fetchedContent?.watchers);
          setContent(fetchedContent);
        })
        .catch((err) => {
          if (isNetworkError(err)) {
            setHasNetworkError(true);
          }
        });
    },
    [id, isAdvertiser],
  );

  useEffect(() => {
    if (!id) return;

    const profile: any = ls.get("Profile", { decrypt: true });
    setUserLoggedInProfile(profile?.user?.user_profile);

    const advertiser = profile?.user?.user_type === "Advertiser";
    setIsAdvertiser(advertiser);

    const cached = advertiser
      ? getStoredSingleCampaign(Number(id))
      : getStoredSingleProject();

    if (cached) {
      setContent(cached);
      if (!advertiser) setSubVendorStaff((cached as any)?.watchers);
    }

    refreshContent(advertiser);
  }, [id, refreshContent]);

  useEffect(() => {
    if (content?.subvendor?.id) {
      getBusinessStaff(Number(content.subvendor.id)).then(
        (fetchedStaffs: any) => {
          setStaffSuggestions(fetchedStaffs);
        },
      );
    }
  }, [content?.subvendor?.id]);

  return {
    content,
    setContent,
    subvendorStaff,
    staffSuggestions,
    userLoggedInProfile,
    isAdvertiser,
    hasNetworkError,
    refreshContent,
  };
}

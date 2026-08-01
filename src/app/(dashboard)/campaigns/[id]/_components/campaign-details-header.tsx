import React from "react";
import { CheckCircle2, PencilLine, UserPlus, XCircle } from "lucide-react";
import { ContentItem } from "@/types/contents";
import { hasAccess } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProjectSingleInsight from "@/components/campaigns/ProjectSingleInsight";

interface CampaignDetailsHeaderProps {
  content: any;
  setContent: React.Dispatch<React.SetStateAction<any | null>>;
  subvendorStaff: ContentItem[] | null;
  predefinedColors: string[];
  userLoggedInProfile: any;
  isAdvertiser: boolean | null;
  toggleNotifications: boolean;
  showIcons: boolean;
  originalTitle: string;
  onShowIconsChange: (show: boolean) => void;
  onAddMemberClick: () => void;
  onUserClick: (user: any) => void;
  onRequestEditModeChange: (enabled: boolean) => void;
}

export function CampaignDetailsHeader({
  content,
  setContent,
  subvendorStaff,
  predefinedColors,
  userLoggedInProfile,
  isAdvertiser,
  toggleNotifications,
  showIcons,
  originalTitle,
  onShowIconsChange,
  onAddMemberClick,
  onUserClick,
  onRequestEditModeChange,
}: CampaignDetailsHeaderProps) {
  const canUseEditMode = hasAccess(userLoggedInProfile, [
    "Manager",
    "Supervisor",
  ]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-[5px] text-[0.875rem] text-[#919393]">
        <p className="uppercase tracking-[.1rem] text-primary">
          {content?.vendor?.organization_name || content?.campaign?.mode}
        </p>
        <Badge variant="outline" className="uppercase">
          {content?.subvendor?.organization_name ||
            content?.campaign?.song_artist}
        </Badge>
      </div>

      <div className="mb-5 pr-[40px]">
        {toggleNotifications ? (
          <div className="flex items-center">
            <div>
              <Input
                type="text"
                className="h-auto border-0 px-0 py-0 text-[45px] font-[900] text-primary shadow-none focus-visible:ring-0"
                value={content?.title || ""}
                onChange={(event) => {
                  setContent({ ...content, title: event.target.value });
                  onShowIconsChange(true);
                }}
              />
              {showIcons && (
                <div className="my-[20px] flex items-center gap-[5px]">
                  <Button
                    type="button"
                    size="icon-lg"
                    variant="ghost"
                    className="text-blue-500"
                    onClick={() => onShowIconsChange(false)}
                  >
                    <CheckCircle2 />
                    <span className="sr-only">Save title</span>
                  </Button>
                  <Button
                    type="button"
                    size="icon-lg"
                    variant="ghost"
                    className="text-red-500"
                    onClick={() => {
                      setContent({ ...content, title: originalTitle });
                      onShowIconsChange(false);
                    }}
                  >
                    <XCircle />
                    <span className="sr-only">Cancel title edit</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="flex-grow text-[45px] font-[700] text-primary">
            {content?.title || content?.campaign?.song_title}
          </p>
        )}

        <div className="my-[20px] flex flex-wrap items-center justify-between gap-[20px]">
          <TooltipProvider>
            <div className="flex space-x-[5px]">
              {subvendorStaff?.map((user: any, index: number) => (
                <Tooltip key={user?.id || index}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon-lg"
                      variant="ghost"
                      className="size-[50px] rounded-full p-0"
                      onClick={() => onUserClick(user)}
                    >
                      <Avatar className="size-[50px]">
                        <AvatarFallback
                          className={`${predefinedColors[index % predefinedColors.length]} text-xs font-bold text-white`}
                        >
                          {user?.user_profile?.fullname
                            ?.slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="sr-only">
                        View {user?.user_profile?.fullname}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {user?.user_profile?.fullname}
                  </TooltipContent>
                </Tooltip>
              ))}

              {hasAccess(userLoggedInProfile, ["Manager"]) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon-lg"
                      variant="secondary"
                      className="size-[50px] rounded-full"
                      onClick={onAddMemberClick}
                    >
                      <UserPlus />
                      <span className="sr-only">Add member</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add member</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>

          {canUseEditMode && (
            <div className="relative">
              {toggleNotifications && (
                <div className="fixed left-0 top-0 z-[9999999] flex h-[50px] w-full items-center justify-center bg-blue-500 font-SansFlex text-[15px] font-[500] text-white">
                  Edit mode
                </div>
              )}

              <Button
                type="button"
                aria-pressed={toggleNotifications}
                className="h-auto rounded-full bg-black px-4 py-2 font-SansFlex text-[16px] font-[400] text-white hover:bg-orange-500"
                onClick={() => onRequestEditModeChange(!toggleNotifications)}
              >
                {toggleNotifications ? (
                  <XCircle className="size-4" />
                ) : (
                  <PencilLine className="size-4" />
                )}
                {toggleNotifications ? "Exit edit mode" : "Edit mode"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {(hasAccess(userLoggedInProfile, ["Manager"]) || isAdvertiser) && (
        <ProjectSingleInsight isAdvertiser={isAdvertiser} content={content} />
      )}
    </div>
  );
}

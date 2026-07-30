"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { CSSProperties, FC, ReactNode, useState } from "react";
import {
  MdAddCircleOutline,
  MdCalendarMonth,
  MdCampaign,
  MdComputer,
  MdDarkMode,
  MdGavel,
  MdHelpOutline,
  MdKeyboardArrowRight,
  MdLightMode,
  MdLogout,
  MdPayment,
  MdPersonOutline,
  MdSchool,
  MdSettings,
  MdWaterDrop,
} from "react-icons/md";

import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-session";

type NavItemProps = {
  href?: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  tooltip?: string;
  onClick?: () => void;
};

const SIDEBAR_ICON_SIZE = 18;
const SIDEBAR_SUB_ICON_SIZE = 16;
const SIDEBAR_COLLAPSED_WIDTH = "4.75rem";

const SidebarLogo = () => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "group flex w-full items-center justify-center border-b border-sidebar-border outline-none transition-all",
        isCollapsed ? "p-6" : "p-[50px]",
      )}
    >
      <span className="relative inline-flex items-center justify-center">
        <span className="block transition-opacity group-hover:opacity-0">
          <Image
            src="https://res.cloudinary.com/dyueswnzk/image/upload/v1758701294/21_elj38n_jljfio.svg"
            alt="Logo"
            width={isCollapsed ? 36 : 50}
            height={isCollapsed ? 36 : 50}
            priority
          />
        </span>

        <span className="absolute inset-0 flex items-center justify-center text-[#17954c] opacity-0 transition-opacity group-hover:opacity-100">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,8V16H10V8H6Z" />
          </svg>
        </span>
      </span>
    </button>
  );
};

const NavItem = ({
  href,
  label,
  icon,
  active,
  tooltip,
  onClick,
}: NavItemProps) => {
  const button = (
    <SidebarMenuButton
      tooltip={tooltip ?? label}
      isActive={active}
      onClick={onClick}
      className={cn(
        "h-10 text-lg text-sidebar-foreground hover:bg-sidebar-accent",
        "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2.5!",
        active && "font-[500]",
      )}
    >
      <span
        className={cn(
          "size-1 rounded-full cursor-pointer bg-transparent group-data-[collapsible=icon]:hidden",
          active && "bg-[#17954c]",
        )}
      />
      <span className="flex size-7 shrink-0 items-center justify-center [&>svg]:size-[18px]!">
        {icon}
      </span>
      <span className="group-data-[collapsible=icon]:hidden">{label}</span>
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem>
      {href ? (
        <SidebarMenuButton
          asChild
          tooltip={tooltip ?? label}
          isActive={active}
          className={cn(
            "h-10 text-lg text-sidebar-foreground hover:bg-sidebar-accent",
            "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2.5!",
            active && "font-[500]",
          )}
        >
          <Link href={href}>
            <span
              className={cn(
                "size-1 rounded-full cursor-pointer bg-transparent group-data-[collapsible=icon]:hidden",
                active && "bg-[#17954c]",
              )}
            />
            <span className="flex size-7 shrink-0 items-center justify-center [&>svg]:size-[18px]!">
              {icon}
            </span>
            <span className="group-data-[collapsible=icon]:hidden">
              {label}
            </span>
          </Link>
        </SidebarMenuButton>
      ) : (
        button
      )}
    </SidebarMenuItem>
  );
};

const externalResources = [
  {
    label: "FAQs",
    href: "https://arroweye.substack.com/",
    icon: <MdHelpOutline size={SIDEBAR_SUB_ICON_SIZE} className="size-[16px]!" />,
  },
  {
    label: "Learn",
    href: "https://butta.cocoa.house/",
    icon: <MdSchool size={SIDEBAR_SUB_ICON_SIZE} className="size-[16px]!" />,
  },
  {
    label: "Legal",
    href: "http://arroweye.pro/legal",
    icon: <MdGavel size={SIDEBAR_SUB_ICON_SIZE} className="size-[16px]!" />,
  },
];

const themeOptions = [
  {
    label: "Light",
    value: "light",
    icon: MdLightMode,
  },
  {
    label: "Dark",
    value: "dark",
    icon: MdDarkMode,
  },
  {
    label: "System",
    value: "system",
    icon: MdComputer,
  },
];

const CampaignsSidebarContent = () => {
  const { state, setOpen } = useSidebar();
  const pathname = usePathname();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const { isAdvertiser, user, userProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const userRole = userProfile?.role || "";
  const displayName =
    userProfile?.fullname || user?.email || userProfile?.role || "Account";

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleResourcesClick = () => {
    if (state === "collapsed") {
      setOpen(true);
      setIsResourcesOpen(true);
      return;
    }

    setIsResourcesOpen((open) => !open);
  };

  return (
    <>
      <SidebarTrigger className="fixed left-3 top-3 z-50 text-[#17954c] md:hidden" />

      <UISidebar
        collapsible="icon"
        className="z-40 border-sidebar-border bg-sidebar text-sidebar-foreground"
      >
        <SidebarHeader className="p-0">
          <SidebarLogo />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="font-semibold text-[#03a835]">
              MENU
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="gap-4">
                <NavItem
                  href="/campaigns"
                  label="Campaigns"
                  active={isActive("/campaigns")}
                  icon={<MdCampaign size={SIDEBAR_ICON_SIZE} />}
                />

                {isActive("/campaigns") && isAdvertiser && (
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive("/campaigns/setup")}
                      >
                        <Link href="/campaigns/setup">
                          <MdAddCircleOutline
                            size={SIDEBAR_SUB_ICON_SIZE}
                            className="text-sidebar-foreground/70 size-[16px]!"
                          />
                          <span>Setup Campaign</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}

                {!isAdvertiser && (
                  <NavItem
                    href="/drops"
                    label="Drops"
                    active={isActive("/drops")}
                    icon={<MdWaterDrop size={SIDEBAR_ICON_SIZE} />}
                  />
                )}

                {["Supervisor", "Manager"].includes(userRole) && (
                  <NavItem
                    href="/payments"
                    label="Payments"
                    active={isActive("/payments")}
                    icon={<MdPayment size={SIDEBAR_ICON_SIZE} />}
                  />
                )}

                {!isAdvertiser && (
                  <NavItem
                    href="/schedule"
                    label="Schedule"
                    active={isActive("/schedule")}
                    icon={<MdCalendarMonth size={SIDEBAR_ICON_SIZE} />}
                  />
                )}

                {!isAdvertiser && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Resources"
                      aria-controls="resources-sidebar-menu"
                      aria-expanded={isResourcesOpen}
                      data-open={isResourcesOpen}
                      onClick={handleResourcesClick}
                      className="h-10 text-[14px] text-sidebar-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2.5!"
                    >
                      <span className="size-1 rounded-full bg-transparent group-data-[collapsible=icon]:hidden" />
                      <span className="flex size-7 shrink-0 items-center justify-center [&>svg]:size-[18px]!">
                        <MdSchool size={SIDEBAR_ICON_SIZE} />
                      </span>
                      <span className="flex-1 group-data-[collapsible=icon]:hidden">
                        Resources
                      </span>
                      <MdKeyboardArrowRight
                        size={18}
                        className={cn(
                          "ml-auto transition-transform duration-300 ease-out group-data-[collapsible=icon]:hidden",
                          isResourcesOpen && "rotate-90",
                        )}
                      />
                    </SidebarMenuButton>

                    <SidebarMenuSub
                      id="resources-sidebar-menu"
                      aria-hidden={!isResourcesOpen}
                      className={cn(
                        "overflow-hidden transition-[max-height,opacity,padding,border-color] duration-300 ease-out",
                        isResourcesOpen
                          ? "max-h-32 opacity-100"
                          : "max-h-0 border-transparent py-0 opacity-0 pointer-events-none",
                      )}
                    >
                      {externalResources.map((resource) => (
                        <SidebarMenuSubItem key={resource.label}>
                          <SidebarMenuSubButton
                            asChild
                            tabIndex={isResourcesOpen ? 0 : -1}
                            onClick={() =>
                              window.open(
                                resource.href,
                                "_blank",
                                "noopener,noreferrer",
                              )
                            }
                          >
                            <button type="button">
                              {resource.icon}
                              <span>{resource.label}</span>
                            </button>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                )}

                <NavItem
                  href="/settings"
                  label="Settings"
                  active={isActive("/settings")}
                  icon={<MdSettings size={SIDEBAR_ICON_SIZE} />}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Account"
                    className="h-11 rounded-[8px] text-sidebar-foreground hover:bg-sidebar-accent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2.5!"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center [&>svg]:size-[18px]!">
                      <MdPersonOutline size={SIDEBAR_ICON_SIZE} className="size-[18px]!" />
                    </span>
                    <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                      {displayName}
                    </span>
                    <MdKeyboardArrowRight
                      size={18}
                      className="ml-auto size-[18px]! transition-transform duration-200 group-data-[state=open]/menu-button:rotate-[-90deg] group-data-[collapsible=icon]:hidden"
                    />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="w-[--radix-popper-anchor-width] min-w-56 rounded-[8px] p-1.5"
                >
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="rounded-[6px]">
                      <MdLightMode size={SIDEBAR_ICON_SIZE} className="size-[18px]!" />
                      <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent
                      sideOffset={8}
                      className="min-w-40 rounded-[8px] p-1.5"
                    >
                      <DropdownMenuRadioGroup
                        value={theme ?? "system"}
                        onValueChange={setTheme}
                      >
                        {themeOptions.map((option) => {
                          const Icon = option.icon;

                          return (
                            <DropdownMenuRadioItem
                              key={option.value}
                              value={option.value}
                              className="rounded-[6px]"
                            >
                              <Icon size={SIDEBAR_ICON_SIZE} className="size-[18px]!" />
                              <span>{option.label}</span>
                            </DropdownMenuRadioItem>
                          );
                        })}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    variant="destructive"
                    className="rounded-[6px]"
                  >
                    <MdLogout size={SIDEBAR_ICON_SIZE} className="size-[18px]!" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </UISidebar>
    </>
  );
};

const Sidebar: FC = () => {
  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width-icon": SIDEBAR_COLLAPSED_WIDTH,
        } as CSSProperties
      }
    >
      <CampaignsSidebarContent />
    </SidebarProvider>
  );
};

export default Sidebar;

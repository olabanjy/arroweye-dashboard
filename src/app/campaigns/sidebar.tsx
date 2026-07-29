"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useState } from "react";
import {
  MdAddCircleOutline,
  MdCalendarMonth,
  MdCampaign,
  MdGavel,
  MdHelpOutline,
  MdKeyboardArrowRight,
  MdLogout,
  MdPayment,
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
        isCollapsed ? "p-4" : "p-[50px]",
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
        "h-10 text-[14px] text-black hover:bg-sidebar-accent",
        active && "font-[500]",
      )}
    >
      <span
        className={cn(
          "size-1 rounded-full cursor-pointer bg-transparent group-data-[collapsible=icon]:hidden",
          active && "bg-[#17954c]",
        )}
      />
      {icon}
      <span>{label}</span>
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
            "h-10 text-[14px] text-black hover:bg-sidebar-accent",
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
            {icon}
            <span>{label}</span>
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
    icon: <MdHelpOutline size={22} className="text-black" />,
  },
  {
    label: "Learn",
    href: "https://butta.cocoa.house/",
    icon: <MdSchool size={22} className="text-black" />,
  },
  {
    label: "Legal",
    href: "http://arroweye.pro/legal",
    icon: <MdGavel size={22} className="text-black" />,
  },
];

const CampaignsSidebarContent = () => {
  const pathname = usePathname();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const { isAdvertiser, userProfile, logout } = useAuth();
  const userRole = userProfile?.role || "";

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <SidebarTrigger className="fixed left-3 top-3 z-50 text-[#17954c] md:hidden" />

      <UISidebar
        collapsible="icon"
        className="z-40 border-slate-100 bg-white text-black"
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
                  icon={<MdCampaign size={22} className="text-black" />}
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
                            size={18}
                            className="text-gray-500"
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
                    icon={<MdWaterDrop size={22} className="text-black" />}
                  />
                )}

                {["Supervisor", "Manager"].includes(userRole) && (
                  <NavItem
                    href="/payments"
                    label="Payments"
                    active={isActive("/payments")}
                    icon={<MdPayment size={22} className="text-black" />}
                  />
                )}

                {!isAdvertiser && (
                  <NavItem
                    href="/schedule"
                    label="Schedule"
                    active={isActive("/schedule")}
                    icon={<MdCalendarMonth size={22} className="text-black" />}
                  />
                )}

                {!isAdvertiser && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Resources"
                      aria-controls="resources-sidebar-menu"
                      aria-expanded={isResourcesOpen}
                      data-open={isResourcesOpen}
                      onClick={() => setIsResourcesOpen((open) => !open)}
                      className="h-10 text-[14px] text-black hover:bg-sidebar-accent"
                    >
                      <span className="size-1 rounded-full bg-transparent group-data-[collapsible=icon]:hidden" />
                      <MdSchool size={22} className="text-black" />
                      <span className="flex-1">Resources</span>
                      <MdKeyboardArrowRight
                        size={18}
                        className={cn(
                          "ml-auto text-black transition-transform duration-300 ease-out group-data-[collapsible=icon]:hidden",
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
                  icon={<MdSettings size={22} className="text-black" />}
                />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <NavItem
              label="Logout"
              onClick={logout}
              icon={<MdLogout size={22} className="text-black" />}
            />
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </UISidebar>
    </>
  );
};

const Sidebar: FC = () => {
  return (
    <SidebarProvider defaultOpen>
      <CampaignsSidebarContent />
    </SidebarProvider>
  );
};

export default Sidebar;

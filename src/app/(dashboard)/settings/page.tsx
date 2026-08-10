"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { LuCopy } from "react-icons/lu";
import { useSettings } from "@/hooks/use-settings";

const Setting = () => {
  const {
    userName,
    setUserName,
    email,
    setEmail,
    phone,
    setPhone,
    toggleNotifications,
    handleCopy,
  } = useSettings();

  const renderCopyInput = (
    label: string,
    value: string,
    editable: boolean = false,
    type: string = "text",
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    info?: string,
    extraElement?: React.ReactNode,
  ) => (
    <Card className="relative w-full rounded-[12px] border-border bg-card p-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex w-full items-end gap-2">
          <div className="w-full flex-1">
            <div className="mb-2 flex items-center gap-2">
              <p className="text-[12px] font-[400] leading-[18px] tracking-[.1rem] text-muted-foreground">
                {label}
              </p>
              {info && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="rounded-full text-muted-foreground hover:text-primary"
                    >
                      <Info />
                      <span className="sr-only">More information</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-60">
                    {info}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <Input
              rounded={true}
              type={type}
              value={value}
              onChange={onChange}
              readOnly={!editable}
              placeholder=""
              className="w-full border-border bg-background text-center text-[16px] text-foreground"
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="h-12 w-12 rounded-full"
              onClick={() => handleCopy(value)}
              aria-label={`Copy ${label}`}
            >
              <LuCopy />
            </Button>
          </div>
        </div>
        {extraElement && (
          <div className="absolute right-[-60px] top-0 flex h-full items-center">
            {extraElement}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div>
        <div className="mt-10 min-h-screen space-y-[20px] px-4 py-10 text-foreground">
          <div className="grid items-end gap-6 md:grid-cols-2 lg:grid-cols-3">
            {renderCopyInput(
              "USER DETAILS",
              userName,
              toggleNotifications,
              "text",
              (e) => setUserName(e.target.value),
              "This is the full name of the user and will appear across all campaigns as such. Please contact your admin for any required changes.",
            )}
            {renderCopyInput(
              "USER EMAIL",
              email,
              toggleNotifications,
              "email",
              (e) => setEmail(e.target.value),
              "This is the email that will receive all notifications concerning your campaign and account security. Please contact your admin for any required changes.",
            )}
            {/* {renderCopyInput(
            "VENDOR",
            labelName,
            toggleNotifications,
            "text",
            (e) => setLabelName(e.target.value),
            "This is the name of the organization your account belongs to. Please contact your admin for any required changes.sss"
          )} */}
            {renderCopyInput(
              "UNIQUE ID",
              phone,
              toggleNotifications,
              "text",
              (e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15)),
              "",
            )}

            {/* <div className="flex gap-[10px] items-end flex-1">
            <div className="mb-[4px]">
              <InputSwitch
                id="phone"
                checked={toggleNotifications}
                onChange={(e) => setToggleNotifications(e.value)}
                className="custom-switch"
              />
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;

"use client";

import React, { useState } from "react";
import InsightChart from "@/components/campaigns/campaign-insights";
import MomentCard from "@/components/campaigns/MomentCard";
import MomentSliderCard from "@/components/campaigns/MomentSliderCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const users = [
  { initials: "JJ", fullName: "John Jerome", email: "john@example.com" },
  { initials: "EO", fullName: "Emily O'Connor", email: "emily@example.com" },
  { initials: "MD", fullName: "Michael Douglas", email: "michael@example.com" },
  { initials: "SO", fullName: "Sarah O'Neil", email: "sarah@example.com" },
];

interface User {
  initials: string;
  fullName: string;
  email: string;
}

const ProjectDetailsPublic = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <>
    
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <p className="text-sm">KHAID</p>
          <Badge variant="outline">NEVILLE RECORDS</Badge>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground">Jolie</h1>
            <div className="mt-[20px] flex items-center gap-[10px]">
              <TooltipProvider>
                {users.map((user) => (
                  <Tooltip key={user.email}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-lg"
                        className="size-11 rounded-full p-0"
                        onClick={() => handleUserClick(user)}
                      >
                        <Avatar className="size-11">
                          <AvatarFallback className="bg-red-500 font-medium text-white">
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="sr-only">View {user.fullName}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{user.fullName}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div className=" ">
          <InsightChart />
          <div className=" grid md:grid-cols-3 gap-[20px] place-items-center">
            <MomentCard
              videoUrls={["https://www.youtube.com/embed/L_kVchHsCYM"]}
              reportUrls={[]}
              videoTitle="How to use Chat GPT to generate social media captions"
              watchButtonText="Watch Now"
              downloadButtonText="Download Data"
              radioButtonText="Radio Monitor"
            />
            <MomentCard
              videoUrls={["https://www.youtube.com/embed/L_kVchHsCYM"]}
              reportUrls={[]}
              videoTitle="How to use Chat GPT to generate social media captions"
              watchButtonText="Watch Now"
              downloadButtonText="Download Data"
            />
            <MomentSliderCard
              images={[
                "https://via.placeholder.com/600x300",
                "https://via.placeholder.com/600x300/111",
                "https://via.placeholder.com/600x300/222",
              ]}
              watchButtonText="Watch Now"
              downloadButtonText="Download Data"
              radioButtonText="Option 1"
              downloadIcon={true}
              outline={true}
              subText="Additional Information"
              MomentsTitle="Moments"
              assetsButton="Download Assets"
            />
          </div>
        </div>
      </div>

      <Dialog
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent>
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedUser.fullName}</DialogTitle>
                <DialogDescription>Member information</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-semibold">Agent</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Member since</p>
                  <p className="font-semibold">July 20, 2021</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last login</p>
                  <p className="font-semibold">May 2, 2024</p>
                </div>
              </div>
              <DialogFooter showCloseButton />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDetailsPublic;

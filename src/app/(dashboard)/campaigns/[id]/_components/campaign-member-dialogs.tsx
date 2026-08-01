import React from "react";
import {
  CirclePlus,
  LoaderCircle,
  Plus,
  SlidersHorizontal,
  UserMinus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { hasAccess } from "@/lib/utils";
import EmailInputWithSuggestions from "@/components/campaigns/EmailInputWithSuggestions";
import { RoleSelect } from "./role-select";
import {
  AddCampaignUserErrors,
  AddCampaignUserFormData,
  CampaignDetailUser,
} from "@/types/campaign-detail";

interface AddMemberDialogProps {
  open: boolean;
  staffSuggestions: any[];
  formData: AddCampaignUserFormData;
  errors: AddCampaignUserErrors;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
  onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleChange: (value: string) => void;
  onAddContactClick: () => void;
  onStaffSelect: (staff: any) => void;
}

export function AddMemberDialog({
  open,
  staffSuggestions,
  formData,
  errors,
  isLoading,
  onOpenChange,
  onSubmit,
  onEmailChange,
  onRoleChange,
  onAddContactClick,
  onStaffSelect,
}: AddMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.1rem] text-[#212529]">
            + Add Members
          </DialogTitle>
          <DialogDescription className="sr-only">
            Add a campaign collaborator by email and role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <p className="text-4xl font-bold text-[#000]">Collaborate</p>
          <EmailInputWithSuggestions
            staffDetails={staffSuggestions}
            value={formData.email}
            name="email"
            onChange={(event) => {
              const modifiedEvent = {
                ...event,
                target: {
                  ...event.target,
                  name: "email",
                },
              } as React.ChangeEvent<HTMLInputElement>;
              onEmailChange(modifiedEvent);
            }}
            onStaffSelect={onStaffSelect}
            error={errors.email}
            placeholder="Add email"
            required
          />

          <Button
            type="button"
            variant="ghost"
            className="h-auto gap-[5px] px-0 py-0 text-[14px] text-foreground hover:bg-transparent"
            onClick={onAddContactClick}
          >
            <CirclePlus />
            <span>Add Contact</span>
          </Button>
          {errors.fullname && (
            <p className="font-SansFlex text-sm text-red-500">
              {errors.fullname}
            </p>
          )}

          <div className="flex items-end gap-[10px]">
            <div className="w-full">
              <RoleSelect
                value={formData.role}
                onChange={onRoleChange}
                error={errors.role}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-[51px] w-full rounded-full bg-black px-[12px] py-[15px] text-[14px] text-white hover:bg-orange-500"
            >
              {isLoading ? <LoaderCircle className="animate-spin" /> : <Plus />}
              <span>{isLoading ? "Adding" : "Add"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ContactNameDialogProps {
  open: boolean;
  formData: AddCampaignUserFormData;
  errors: AddCampaignUserErrors;
  onOpenChange: (open: boolean) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactNameDialog({
  open,
  formData,
  errors,
  onOpenChange,
  onInputChange,
}: ContactNameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.1rem] text-[#212529]">
            Contact Name
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter the full name for the new campaign contact.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            required
            name="fullname"
            label="Enter Full Name"
            value={formData.fullname}
            onChange={onInputChange}
            error={errors.fullname}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
              disabled={!formData.fullname}
            >
              Submit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MemberInfoDialogProps {
  selectedUser: CampaignDetailUser | null;
  userLoggedInProfile: any;
  onOpenChange: (open: boolean) => void;
  onRemoveClick: () => void;
  onAccessClick: () => void;
}

export function MemberInfoDialog({
  selectedUser,
  userLoggedInProfile,
  onOpenChange,
  onRemoveClick,
  onAccessClick,
}: MemberInfoDialogProps) {
  return (
    <Dialog
      open={selectedUser !== null}
      onOpenChange={(open) => onOpenChange(open)}
    >
      <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-border bg-primary p-6 font-SansFlex text-zinc-950 shadow-2xl sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-[12px] font-[400] uppercase tracking-[.1rem] text-[#7c7e81]">
            Member Information
          </DialogTitle>
          <DialogDescription className="sr-only">
            Campaign member profile and access information.
          </DialogDescription>
        </DialogHeader>

        {selectedUser && (
          <div className="space-y-4">
            <p className="text-[30px] font-[600] text-[#212529]">
              {selectedUser.fullname}
            </p>
            <div>
              <p className="text-[16px] font-[400] text-[#212529]">Email</p>
              <p className="text-[16px] font-[600] text-[#212529]">
                {selectedUser.staff_email}
              </p>
            </div>
            <div className="text-[16px] font-[400]">
              <p className="text-[#212529]">Role</p>
              <p className="font-[600] text-[#01a733]">{selectedUser.role}</p>
            </div>
            <div className="text-[16px] font-[400] text-[#212529]">
              <p>Member since</p>
              <p className="font-[600]">{selectedUser.member_since}</p>
            </div>
            <div className="text-[16px] font-[400] text-[#212529]">
              <p>Last Login</p>
              <p className="font-[600]">{selectedUser.last_login}</p>
            </div>

            {hasAccess(userLoggedInProfile, ["Manager"]) && (
              <div>
                <Button
                  type="button"
                  size="icon"
                  className="mr-2 rounded bg-black text-white"
                  onClick={onRemoveClick}
                >
                  <UserMinus />
                  <span className="sr-only">Remove member</span>
                </Button>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-black"
                  onClick={onAccessClick}
                >
                  <SlidersHorizontal />
                  <span className="sr-only">Adjust member access</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface MemberAccessDialogProps {
  open: boolean;
  role: string | number;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (value: string) => void;
  onSave: () => void;
}

export function MemberAccessDialog({
  open,
  role,
  onOpenChange,
  onRoleChange,
  onSave,
}: MemberAccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-border bg-background p-6 text-zinc-950 shadow-2xl sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-[12px] font-[400] uppercase tracking-[.1rem] text-[#7c7e81]">
            Member Access
          </DialogTitle>
          <DialogDescription className="sr-only">
            Update this campaign member's role.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 font-SansFlex">
          <RoleSelect value={role} onChange={onRoleChange} />
          <DialogFooter>
            <Button
              type="button"
              className="rounded-full bg-blue-500 px-[16px] py-[8px] text-white hover:bg-blue-600"
              onClick={onSave}
            >
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmActionDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmActionDialog({
  open,
  title,
  description,
  confirmLabel = "Yes",
  cancelLabel = "No",
  confirmVariant = "default",
  onOpenChange,
  onConfirm,
  onCancel,
}: ConfirmActionDialogProps) {
  const confirmButtonClassName =
    confirmVariant === "destructive"
      ? "h-9 rounded-full px-5 text-sm font-medium shadow-none active:scale-[0.97]"
      : "h-9 rounded-full bg-[#5300d7] px-5 text-sm font-medium !text-white shadow-none hover:bg-[#4700b8] hover:!text-white active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-500/25";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] rounded-2xl border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-[12px] font-[500] uppercase tracking-[.16rem] text-zinc-500">
            {title}
          </DialogTitle>
          <DialogDescription className="text-[16px] font-[400] text-zinc-950">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant={confirmVariant}
            className={confirmButtonClassName}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full border-zinc-300 px-5 text-sm font-medium !text-zinc-950 shadow-none hover:bg-zinc-100 hover:!text-zinc-950 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-500/25"
            onClick={onCancel || (() => onOpenChange(false))}
          >
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

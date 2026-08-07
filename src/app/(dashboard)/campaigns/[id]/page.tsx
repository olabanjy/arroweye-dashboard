"use client";

import React from "react";
import { useParams } from "next/navigation";
import { hasAccess } from "@/lib/utils";
import NoNetwork from "@/components/no-network";
import ScheduleProject from "@/components/campaigns/schedule/component/ScheduleProject";
import CampaignInsightAdvertiser from "@/components/campaigns/CampaignInsightAdvertiser";
import CampaignInsights from "@/components/campaigns/campaign-insights";
import { useCampaignDetail } from "@/hooks/use-campaign-detail";
import { useCampaignEditMode } from "@/hooks/use-campaign-edit-mode";
import { useCampaignExports } from "@/hooks/use-campaign-exports";
import { useCampaignMemberActions } from "@/hooks/use-campaign-member-actions";
import { CampaignDetailsHeader } from "./_components/campaign-details-header";
import {
  AddMemberDialog,
  ConfirmActionDialog,
  ContactNameDialog,
  MemberAccessDialog,
  MemberInfoDialog,
} from "./_components/campaign-member-dialogs";
import DropsList from "@/components/campaigns/DropsList";

const predefinedColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-gray-500",
];

const ProjectDetails = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const {
    content,
    setContent,
    subvendorStaff,
    staffSuggestions,
    userLoggedInProfile,
    isAdvertiser,
    hasNetworkError,
    refreshContent,
  } = useCampaignDetail(id);
  const {
    toggleNotifications,
    editMode,
    editModeOff,
    showIcons,
    setEditMode,
    setEditModeOff,
    setShowIcons,
    requestEditModeChange,
    confirmEditMode,
    cancelEditMode,
    confirmEditModeOff,
    cancelEditModeOff,
  } = useCampaignEditMode();
  const {
    visible,
    setVisible,
    nameDialogVisible,
    setNameDialogVisible,
    selectedUser,
    setSelectedUser,
    adjustmentModalVisible,
    setAdjustmentModalVisible,
    deleteModal,
    setDeleteModal,
    isAddUserLoading,
    addUserFormData,
    addUserErrors,
    setUseWatchersEndpoint,
    handleAddUserInputChange,
    handleAddUserRoleChange,
    handleAddUserSubmit,
    handleCampaignActionRemove,
    handleCampaignActionUpdate,
    handleUserClick,
    handleStaffSelect,
  } = useCampaignMemberActions({
    id,
    content,
    refreshContent,
  });
  const { handleDownloadPDF, handleExportCSV } = useCampaignExports(content);

  const originalTitle = content?.title || "";
  const campaignTitle = content?.title || content?.campaign?.song_title;

  React.useEffect(() => {
    if (!campaignTitle) return;

    const previousTitle = document.title;
    document.title = campaignTitle;

    return () => {
      document.title = previousTitle;
    };
  }, [campaignTitle]);

  return (
    <>
      {hasNetworkError ? (
        <NoNetwork onReconnect={refreshContent} />
      ) : (
        <div
          id="pdf-content"
          className="relative mx-auto w-full max-w-7xl"
          style={{ marginBottom: "80px" }}
        >
          <CampaignDetailsHeader
            content={content}
            setContent={setContent}
            subvendorStaff={subvendorStaff}
            predefinedColors={predefinedColors}
            userLoggedInProfile={userLoggedInProfile}
            isAdvertiser={isAdvertiser}
            toggleNotifications={toggleNotifications}
            showIcons={showIcons}
            originalTitle={originalTitle}
            onShowIconsChange={setShowIcons}
            onAddMemberClick={() => setVisible(true)}
            onUserClick={handleUserClick}
            onRequestEditModeChange={requestEditModeChange}
          />

          <AddMemberDialog
            open={visible}
            staffSuggestions={staffSuggestions}
            formData={addUserFormData}
            errors={addUserErrors}
            isLoading={isAddUserLoading}
            onOpenChange={setVisible}
            onSubmit={handleAddUserSubmit}
            onEmailChange={(event) => {
              setUseWatchersEndpoint(false);
              handleAddUserInputChange(event);
            }}
            onRoleChange={handleAddUserRoleChange}
            onAddContactClick={() => setNameDialogVisible(true)}
            onStaffSelect={handleStaffSelect}
          />

          <ContactNameDialog
            open={nameDialogVisible}
            formData={addUserFormData}
            errors={addUserErrors}
            onOpenChange={setNameDialogVisible}
            onInputChange={handleAddUserInputChange}
          />

          {hasAccess(userLoggedInProfile, ["Manager", "Supervisor"]) && (
            <>
              <CampaignInsights
                editMode={toggleNotifications}
                handleDownloadPage={handleDownloadPDF}
                handleDownloadData={handleExportCSV}
                isAdvertiser={isAdvertiser}
                content={content}
                refreshContent={refreshContent}
              />
              {/* <ScheduleProject
                filterIcon={false}
                isDateClickEnabled={false}
                isProjectPage={true}
              /> */}
            </>
          )}

          {isAdvertiser && <CampaignInsightAdvertiser content={content} />}
          {/* <DropsList isAdvertiser={isAdvertiser} content={content} /> */}

          <MemberInfoDialog
            selectedUser={selectedUser}
            userLoggedInProfile={userLoggedInProfile}
            onOpenChange={(open) => {
              if (!open) setSelectedUser(null);
            }}
            onRemoveClick={() => setDeleteModal(true)}
            onAccessClick={() => setAdjustmentModalVisible(true)}
          />

          <MemberAccessDialog
            open={adjustmentModalVisible}
            role={addUserFormData.role}
            onOpenChange={setAdjustmentModalVisible}
            onRoleChange={handleAddUserRoleChange}
            onSave={handleCampaignActionUpdate}
          />

          <ConfirmActionDialog
            open={deleteModal}
            title="Remove member"
            description="Are you sure you want to remove this profile from this project?"
            confirmLabel="OK"
            cancelLabel="Cancel"
            onOpenChange={setDeleteModal}
            onConfirm={handleCampaignActionRemove}
          />

          <ConfirmActionDialog
            open={editMode}
            title="Enable edit mode"
            description="Do you want to switch to edit mode?"
            onOpenChange={setEditMode}
            onConfirm={confirmEditMode}
            onCancel={cancelEditMode}
          />

          <ConfirmActionDialog
            open={editModeOff}
            title="Disable edit mode"
            description="Make sure all your changes are saved before you proceed. Please note that any unsaved changes will be lost permanently."
            onOpenChange={setEditModeOff}
            onConfirm={confirmEditModeOff}
            onCancel={cancelEditModeOff}
          />
        </div>
      )}
    </>
  );
};

export default ProjectDetails;

import { useState } from "react";

export function useCampaignEditMode() {
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editModeOff, setEditModeOff] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  const requestEditModeChange = (enabled: boolean) => {
    if (enabled) {
      setEditMode(true);
    } else {
      setEditModeOff(true);
    }
  };

  const confirmEditMode = () => {
    setEditMode(false);
    setToggleNotifications(true);
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setToggleNotifications(false);
  };

  const confirmEditModeOff = () => {
    setEditModeOff(false);
    setToggleNotifications(false);
  };

  const cancelEditModeOff = () => {
    setEditModeOff(false);
    setToggleNotifications(true);
  };

  return {
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
  };
}

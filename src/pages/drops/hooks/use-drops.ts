import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getDropZones, deleteDropZones, getBusiness } from "@/services/api";
import { useAuth } from "@/context/auth-context";

export const useDrops = () => {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { userProfile: userLoggedInProfile } = useAuth();

  const [filters, setFilters] = useState({
    search: "",
    year: "",
    month: "",
    vendor: "",
    subvendor: "",
    platform: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [projectPin, setProjectPin] = useState("");
  const [pinEntered, setPinEntered] = useState("");
  const [pinError, setPinError] = useState(false);
  const [dropIdToBeDeleted, setDropIdToBeDeleted] = useState<any>("");

  const updateFilters = (key: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 2000);
    return () => clearTimeout(handler);
  }, [filters.search]);

  // Fetch business options
  const { data: businessData = [] } = useQuery({
    queryKey: ["business"],
    queryFn: getBusiness,
  });

  const vendorOptions = businessData
    .filter((business: any) => business.type === "Vendor")
    .map((business: any) => ({
      value: business.id,
      label: business.organization_name,
    }));

  const subVendorOptions = businessData
    .filter((business: any) => business.type === "SubVendor")
    .map((business: any) => ({
      value: business.id,
      label: business.organization_name,
    }));

  // Fetch Drop Zones using react-query
  const { data: dropZonesData, isLoading: isDropZonesLoading } = useQuery({
    queryKey: [
      "dropzones",
      currentPage,
      debouncedSearch,
      filters.year,
      filters.month,
      filters.vendor,
      filters.subvendor,
      filters.platform,
    ],
    queryFn: () =>
      getDropZones({
        page: currentPage,
        search: debouncedSearch,
        year: filters.year,
        month: filters.month,
        vendor: filters.vendor,
        subvendor: filters.subvendor,
        platform: filters.platform,
      }),
  });

  const content = dropZonesData?.results || [];
  const totalPages = dropZonesData?.count ? Math.ceil(dropZonesData.count / 10) : 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUserClick = (item: any) => {
    setSelectedUser(item);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link has been copied!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };

  // Delete Drop Zone mutation
  const deleteMutation = useMutation({
    mutationFn: deleteDropZones,
    onMutate: () => {
      setDeleteLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropzones"] });
      setDeleteDialog(false);
      setPinEntered("");
      toast.success("Deleted successfully");
    },
    onError: (err) => {
      console.error("Error deleting dropzone:", err);
      toast.error("Failed to delete dropzone");
    },
    onSettled: () => {
      setDeleteLoading(false);
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return {
    content,
    currentPage,
    totalPages,
    filter,
    setFilter,
    selectedUser,
    setSelectedUser,
    userLoggedInProfile,
    filters,
    setFilters,
    updateFilters,
    vendorOptions,
    subVendorOptions,
    deleteLoading,
    deleteDialog,
    setDeleteDialog,
    projectPin,
    setProjectPin,
    pinEntered,
    setPinEntered,
    pinError,
    setPinError,
    dropIdToBeDeleted,
    setDropIdToBeDeleted,
    handlePageChange,
    handleUserClick,
    handleCopyLink,
    handleDelete,
    isLoading: isDropZonesLoading,
  };
};

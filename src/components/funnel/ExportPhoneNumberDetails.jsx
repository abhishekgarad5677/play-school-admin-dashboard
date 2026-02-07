import { Modal, Box, Typography, Button } from "@mui/material";
import {
  useGetChildDetailsDataMutation,
  useGetPhoneNumberDetailsMutation,
} from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";

const ExportPhoneNumberDetails = ({
  exportModalOpen,
  onClose,
  selectedLabel,
  filterDate,
  startDate,
  endDate,
}) => {
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 3,
    width: 420,
    maxWidth: "92vw",
  };

  const [postDashboardData, { isLoading }] = useGetPhoneNumberDetailsMutation();

  const downloadCsv = (users, filename = "phone-number-added.csv") => {
    const safeUsers = Array.isArray(users) ? users : [];

    const headers = ["Name", "Email", "Phone Number"];

    const rows = safeUsers.map((u) => [
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${(u.email || "").replace(/"/g, '""')}"`,
      `"${(u.phoneNumber || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleConfirmExport = async () => {
    try {
      const formData = new FormData();

      if (filterDate !== "custom") {
        formData.append("FilterType", filterDate);
      } else {
        formData.append("FilterType", "custom");
        if (startDate)
          formData.append("FromDate", formatDateToReadableString(startDate));
        if (endDate)
          formData.append("ToDate", formatDateToReadableString(endDate));
      }

      // ✅ wait for API response
      const res = await postDashboardData(formData).unwrap();

      // ✅ your response shape: { status, message, data: { users: [...] } }
      const emails = res?.data?.users || [];

      downloadCsv(emails, `${selectedLabel || "ChildDetails"}_Emails.csv`);
    } catch (err) {
      console.error("Export failed:", err);
      // optional: show a toast/snackbar
    } finally {
      onClose();
    }
  };

  return (
    <Modal open={exportModalOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Export Data
        </Typography>

        <Typography sx={{ mb: 2 }}>
          Are you sure you want to export data for{" "}
          <b>{selectedLabel || "Child Details"}</b>?
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmExport}
            disabled={isLoading}
          >
            {isLoading ? "Exporting..." : "Yes, Export"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ExportPhoneNumberDetails;

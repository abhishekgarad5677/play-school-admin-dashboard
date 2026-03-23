import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import DatePicker from "react-datepicker";
import {
  dateFilterOptions,
  freeTrialClickedButNotStarted,
  getLeadReasonLabel,
  phoneNumberAddedButFreeTrialNotClicked,
  subscriptionCancelled,
} from "../../utils/constant";
import { useCallCenterReportsMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";

// ─── CSV Export Helper (no external library) ──────────────────────────────────

const exportSectionToCSV = ({
  sectionTitle,
  summaryItem,
  rows,
  reasonLabels,
  fileName,
}) => {
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;

  const csvRows = [
    [escape(sectionTitle)],
    [],
    [escape("Call Summary")],
    [escape("Call Type"), escape("Count")],
    [escape("Total Calls Made"), escape(summaryItem?.totalCallDone ?? 0)],
    [escape("Calls Connected"), escape(summaryItem?.connected ?? 0)],
    [escape("Calls Not Connected"), escape(summaryItem?.notConnected ?? 0)],
    [escape("Conversions"), escape(summaryItem?.converted ?? 0)],
    [escape("Conversion Rate %"), escape(summaryItem?.conversionRate ?? 0)],
    [],
    [escape("Outcome Breakdown")],
    [escape("Outcome Reason"), escape("Occurrences")],
    ...(rows ?? []).map((item) => [
      escape(getLeadReasonLabel(item.reason, reasonLabels)),
      escape(item.count),
    ]),
  ];

  const csvContent = csvRows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

// ─── OtherNotesModal ──────────────────────────────────────────────────────────

const OtherNotesModal = ({ open, onClose, notes = [], title }) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pb: 1,
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        {title || "Other Remarks"}
      </Typography>
      <IconButton onClick={onClose} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
    <Divider />
    <DialogContent sx={{ pt: 1, pb: 2 }}>
      {notes.length === 0 ? (
        <Typography color="text.secondary">No remarks available.</Typography>
      ) : (
        <List disablePadding>
          {notes.map((note, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemText
                  primary={<Typography variant="body2">{note}</Typography>}
                />
              </ListItem>
              {index < notes.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} variant="outlined" size="small">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

// ─── ReasonTable ──────────────────────────────────────────────────────────────

const ReasonTable = ({ rows, reasonLabels, sectionTitle }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);

  return (
    <>
      <Card sx={{ width: "64%" }}>
        <CardContent sx={{ padding: "0 !important" }}>
          <Table size="small" sx={{ width: "100%", mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Outcome Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Occurrences</TableCell>
                <TableCell sx={{ fontWeight: 600 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {getLeadReasonLabel(item.reason, reasonLabels)}
                  </TableCell>
                  <TableCell>{item.count}</TableCell>
                  <TableCell sx={{ width: 40, pr: 1 }}>
                    {item.reason === 5 && item.other?.length > 0 && (
                      <Tooltip title="View remarks">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSelectedNotes(item.other);
                            setModalOpen(true);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OtherNotesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        notes={selectedNotes}
        title={`${sectionTitle} — Other Remarks`}
      />
    </>
  );
};

// ─── CallSummaryStats ─────────────────────────────────────────────────────────

const CallSummaryStats = ({ summaryItem }) => (
  <Box sx={{ display: "flex", gap: 2, justifyContent: "start", mb: 2 }}>
    {[
      { value: summaryItem?.totalCallDone ?? 0, label: "Total Calls Made" },
      { value: summaryItem?.connected ?? 0, label: "Calls Connected" },
      { value: summaryItem?.notConnected ?? 0, label: "Calls Not Connected" },
      { value: summaryItem?.converted ?? 0, label: "Conversions" },
      { value: summaryItem?.conversionRate ?? 0, label: "Conv. Rate %" },
    ].map(({ value, label }) => (
      <Box
        key={label}
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>
          <b>{value}</b>
        </p>
        <Typography sx={{ color: "#9ca3af" }}>{label}</Typography>
      </Box>
    ))}
  </Box>
);

// ─── ReportSection (title + export button + stats + table) ───────────────────

const ReportSection = ({
  title,
  summaryItem,
  rows,
  reasonLabels,
  exportFileName,
}) => (
  <Box mb={5}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "end",
        gap: 6,
      }}
    >
      {/* Title + export icon */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6" fontWeight={500} color="primary">
            {title}
          </Typography>
          <Tooltip title="Export to CSV">
            <IconButton
              size="small"
              color="info"
              onClick={() =>
                exportSectionToCSV({
                  sectionTitle: title,
                  summaryItem,
                  rows,
                  reasonLabels,
                  fileName: exportFileName,
                })
              }
            >
              <FileDownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <CallSummaryStats summaryItem={summaryItem} />
      </Box>
    </Box>

    <ReasonTable rows={rows} reasonLabels={reasonLabels} sectionTitle={title} />
  </Box>
);

// ─── Main Reports Page ────────────────────────────────────────────────────────

const Reports = () => {
  const [data, setData] = useState();
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  const [postCallCenterData, { isLoading, data: callCenterData }] =
    useCallCenterReportsMutation();

  useEffect(() => {
    const storedDate = sessionStorage.getItem("selectedDate");
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");

    if (storedDate) setDate(storedDate);
    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]);
    }
    setIsSessionLoaded(true);
  }, []);

  useEffect(() => {
    if (!isSessionLoaded) return;
    if (date === "custom" && (!startDate || !endDate)) return;

    const formData = new FormData();
    if (date !== "custom") {
      formData.append("FilterType", date);
    } else {
      formData.append("FilterType", date);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }
    formData.append("isFreeActive", false);
    postCallCenterData(formData);
  }, [date, startDate, endDate, isSessionLoaded]);

  useEffect(() => {
    if (callCenterData) setData(callCenterData?.data);
  }, [callCenterData]);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    if (selectedDate === "custom") {
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.setItem("startDate", startDate);
      sessionStorage.setItem("endDate", endDate);
    } else {
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.removeItem("startDate");
      sessionStorage.removeItem("endDate");
      setDateRange([null, null]);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "Call Center Reports",
              href: "/reports",
              icon: <AssignmentIcon fontSize="small" />,
            },
          ]}
        />
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <CustomRangeSelect
            value={date}
            label={"Date"}
            onChange={handleDateChange}
            options={dateFilterOptions}
          />
          {date === "custom" && (
            <DatePicker
              maxDate={new Date()}
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
                const [start, end] = update;
                sessionStorage.setItem("startDate", start);
                sessionStorage.setItem("endDate", end);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date range"
              customInput={
                <TextField
                  size="small"
                  fullWidth
                  label="Custom Date Range"
                  sx={{ width: 250 }}
                />
              }
            />
          )}
        </Box>
      </Box>

      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <ReportSection
              title="Subscription Cancelled"
              summaryItem={data?.callSummary[0]}
              rows={data?.cancelled}
              reasonLabels={subscriptionCancelled}
              exportFileName="Subscription_Cancelled"
            />
            {/* <ReportSection
              title="Trial Clicked - Not Started"
              summaryItem={data?.callSummary[1]}
              rows={data?.trialNotStarted}
              reasonLabels={freeTrialClickedButNotStarted}
              exportFileName="Trial_Clicked_Not_Started"
            />
            <ReportSection
              title="Phone Added - Trial Not Clicked"
              summaryItem={data?.callSummary[2]}
              rows={data?.trialNotClicked}
              reasonLabels={phoneNumberAddedButFreeTrialNotClicked}
              exportFileName="Phone_Added_Trial_Not_Clicked"
            /> */}
          </>
        )}
      </Paper>
    </>
  );
};

export default Reports;

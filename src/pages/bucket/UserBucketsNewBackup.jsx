import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  Paper,
  FormControl,
  Typography,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import DatePicker from "react-datepicker";
import {
  bucketCategory,
  dateFilterOptions,
  freeTrialClickedButNotStarted,
  getLeadOutcomeValue,
  getLeadReasonLabel,
  getLeadReasonValue,
  getLeadTypeValue,
  phoneNumberAddedButFreeTrialNotClicked,
  subscriptionCancelled,
} from "../../utils/constant";
import {
  useAddFeedbackMutation,
  useCheckPaymentStatusMutation,
  useFreeTrialClickedButNotStartedMutation,
  usePhoneNumberAddedFreeTrialNotClickedMutation,
  useSendPaymentLinkMutation,
  useSubscriptionCancelledMutation,
} from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { TableWithExport } from "../../components/table/TableWithExport";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LoopIcon from "@mui/icons-material/Loop";

const UserBucketsNewBackup = () => {
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [bucket, setbucket] = useState("Subscription Cancelled");
  const [selectOption, setSelectOption] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [showPaymentStatusBtn, setShowPaymentStatusBtn] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [otherModalOpen, setOtherModalOpen] = useState(false);
  const [otherRow, setOtherRow] = useState(null);
  const [otherText, setOtherText] = useState("");
  const [callbackModalOpen, setCallbackModalOpen] = useState(false);
  const [callbackRow, setCallbackRow] = useState(null);
  const [callbackDateTime, setCallbackDateTime] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [sendingLinkRow, setSendingLinkRow] = useState({});

  useEffect(() => {
    setPaginationModel((prev) => ({
      ...prev,
      page: 0,
    }));
  }, [statusFilter]);

  useEffect(() => {
    const storedDate = sessionStorage.getItem("selectedDate");
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");
    const storedBucket = sessionStorage.getItem("selectedBucket");

    if (storedBucket) {
      setbucket(storedBucket);
    }

    if (storedDate) {
      setDate(storedDate);
    }
    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]);
    }
  }, []);

  const [postDataStudent, { isLoading, data: studentsData }] =
    usePhoneNumberAddedFreeTrialNotClickedMutation();
  const [
    postFreeTrialCliked,
    { isLoading: freeTrialClikedLoading, data: freeTrialClikedData },
  ] = useFreeTrialClickedButNotStartedMutation();
  const [
    postSubCancelled,
    { isLoading: subCancelledLoading, data: subCancelledData },
  ] = useSubscriptionCancelledMutation();
  const [postSendPaymentLink] = useSendPaymentLinkMutation();

  const [postCheckPaymentStatus] = useCheckPaymentStatusMutation();

  const [addFeedback] = useAddFeedbackMutation();

  useEffect(() => {
    const formData = new FormData();
    if (date !== "custom") {
      formData.append("FilterType", date);
    } else if (date === "custom" && startDate && endDate) {
      formData.append("FilterType", date);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }

    formData.append("PageSize", paginationModel.pageSize);
    formData.append("PageNumber", paginationModel.page + 1);
    formData.append("leadOutcome", getLeadOutcomeValue(statusFilter));

    if (bucket === "Phone Added – Trial Not Clicked") {
      postDataStudent(formData);
    } else if (bucket === "Trial Clicked – Not Started") {
      postFreeTrialCliked(formData);
    } else if (bucket === "Subscription Cancelled") {
      postSubCancelled(formData);
    }
  }, [date, startDate, endDate, paginationModel, bucket, statusFilter]);

  const getRowCountByStatus = (data, status) => {
    if (status === "All") {
      return data?.allUsers;
    } else if (status === "Pending") {
      return data?.pendingUsers;
    } else if (status === "Called") {
      return data?.calledUsers;
    } else if (status === "Scheduled") {
      return data?.followUpUsers;
    } else if (status === "Converted") {
      return data?.convertedUsers;
    } else if (status === "Link Sent") {
      return data?.paymentLinkSentUsers;
    }

    return data?.allUsers;
  };

  useEffect(() => {
    if (studentsData && bucket === "Phone Added – Trial Not Clicked") {
      setData(studentsData?.data?.users);
      setSummaryData(studentsData?.data);
      setRowCount(getRowCountByStatus(studentsData?.data, statusFilter));
      setSelectOption(phoneNumberAddedButFreeTrialNotClicked);
    } else if (
      freeTrialClikedData &&
      bucket === "Trial Clicked – Not Started"
    ) {
      setData(freeTrialClikedData?.data?.users);
      setSummaryData(freeTrialClikedData?.data);
      setRowCount(getRowCountByStatus(freeTrialClikedData?.data, statusFilter));
      setSelectOption(freeTrialClickedButNotStarted);
    } else if (subCancelledData && bucket === "Subscription Cancelled") {
      setData(subCancelledData?.data?.users);
      setSummaryData(subCancelledData?.data);
      setRowCount(getRowCountByStatus(subCancelledData?.data, statusFilter));
      setSelectOption(subscriptionCancelled);
    }
  }, [studentsData, freeTrialClikedData, subCancelledData, statusFilter]);

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
    }
  };

  const handleBucketChange = (event) => {
    const selectedBucket = event.target.value;
    setbucket(selectedBucket);
    sessionStorage.setItem("selectedBucket", selectedBucket);
  };

  const openOtherModal = (row, textToPrefill = "") => {
    setOtherRow(row);
    setOtherText(textToPrefill || "");
    setOtherModalOpen(true);
  };

  const handleOtherSubmit = async () => {
    const text = otherText.trim();
    if (!text) {
      toast.error("Please enter feedback");
      return;
    }

    await handleSubmit(otherRow, "Other (please specify)", text);

    setOtherModalOpen(false);
    setOtherRow(null);
    setOtherText("");
  };

  const handleGetUpdateData = async () => {
    const formDataForFetch = new FormData();

    if (date !== "custom") {
      formDataForFetch.append("FilterType", date);
    } else {
      formDataForFetch.append("FilterType", date);
      formDataForFetch.append(
        "FromDate",
        formatDateToReadableString(startDate),
      );
      formDataForFetch.append("ToDate", formatDateToReadableString(endDate));
    }

    formDataForFetch.append("PageSize", paginationModel.pageSize);
    formDataForFetch.append("PageNumber", paginationModel.page + 1);
    formDataForFetch.append("leadOutcome", getLeadOutcomeValue(statusFilter));

    try {
      if (bucket === "Phone Added – Trial Not Clicked") {
        await postDataStudent(formDataForFetch).unwrap();
      } else if (bucket === "Trial Clicked – Not Started") {
        await postFreeTrialCliked(formDataForFetch).unwrap();
      } else {
        await postSubCancelled(formDataForFetch).unwrap();
      }
    } catch (error) {
      console.error("Error fetching updated data:", error);
      throw error;
    }
  };

  const handleSubmit = async (
    row,
    selectedValue,
    messageOverride,
    followUpOverride,
  ) => {
    const formData = new FormData();

    formData.append("UserId", row?.userId);

    const reasonValue = getLeadReasonValue(selectedValue, selectOption);

    if (reasonValue !== null) {
      formData.append("LeadReason", reasonValue);
    }

    if (selectedValue === "Other (please specify)") {
      formData.append("message", messageOverride);
    }

    formData.append("LeadType", getLeadTypeValue(bucket));

    if (followUpOverride) {
      formData.append("FollowUp", followUpOverride);
    }

    try {
      const res = await addFeedback(formData).unwrap();

      if (res?.status === true) {
        toast.success(res?.message || "Feedback saved");
        await handleGetUpdateData();
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting feedback");
    }
  };

  const isEditMode = otherText?.trim()?.length > 0;

  const handleSendLinkUI = async (row) => {
    const formData = new FormData();

    formData.append("UserId", row?.userId);
    formData.append("PlanId", 110); // test plan id
    // formData.append("PlanId", 124);
    formData.append("LeadType", getLeadTypeValue(bucket));

    try {
      setSendingLinkRow((prev) => ({
        ...prev,
        [row?.userId]: true,
      }));

      const res = await postSendPaymentLink(formData).unwrap();

      if (res?.status === true) {
        toast.success("payment link sent");
        await handleGetUpdateData();
      } else {
        toast.error("Error sending payment link");
      }
    } catch (error) {
      toast.error("Error sending payment link");
    } finally {
      setSendingLinkRow((prev) => ({
        ...prev,
        [row?.userId]: false,
      }));
    }
  };

  const handlePaymentStatus = async (row) => {
    const formData = new FormData();
    formData.append("UserId", row?.userId);

    try {
      const res = await postCheckPaymentStatus(formData).unwrap();

      if (res?.status === true) {
        toast.success("payment verfified");
        await handleGetUpdateData();
      } else {
        console.log("==== 1st");

        toast.info(res?.message);
      }
    } catch (error) {
      console.log("==== 1st");
      toast.error("Error while checking payment status");
    }
  };

  // code for the schedule callback

  const isSameDay = (a, b) => a && b && a.isSame(b, "day");

  // Disable hours that are already passed (only if selected date is today)
  const shouldDisableTime = (value, view) => {
    if (!callbackDateTime) return false;

    const selected = callbackDateTime;
    const current = dayjs();

    // Only restrict time when selecting "today"
    if (!isSameDay(selected, current)) return false;

    if (view === "hours") {
      return value < current.hour();
    }

    if (view === "minutes") {
      // block minutes in the current hour that are already passed
      if (selected.hour() !== current.hour()) return false;
      return value < current.minute();
    }

    return false;
  };

  const openCallbackModal = (row, prefill = "") => {
    setCallbackRow(row);

    if (prefill) {
      setCallbackDateTime(dayjs(prefill));
    } else {
      setCallbackDateTime(null);
    }

    setCallbackModalOpen(true);
  };

  const handleCallbackSubmit = async () => {
    if (!callbackDateTime) {
      toast.error("Please select date & time");
      return;
    }

    const formattedDate = callbackDateTime.format("YYYY-MM-DDTHH:mm:ss+05:30");

    await handleSubmit(
      callbackRow,
      "Callback Scheduled",
      undefined,
      formattedDate,
    );

    setCallbackModalOpen(false);
    setCallbackRow(null);
    setCallbackDateTime(null);
  };

  const scheduledDateColumn = {
    field: "followUpAt",
    headerName: "Scheduled Date",
    width: 220,
    renderCell: (params) => {
      const v = params?.row?.followUpAt;

      if (!v) return "-";

      return dayjs(v).format("DD MMM YYYY, hh:mm A");
    },
  };

  const lastCalledDateColumn = {
    field: "lastCalledAt",
    headerName: "Last Called Date",
    width: 220,
    renderCell: (params) => {
      const v = params?.row?.lastCalledAt;

      if (!v) return "-";

      return dayjs(v).format("DD MMM YYYY, hh:mm A");
    },
  };

  const convertedDateColumn = {
    field: "convertedAt",
    headerName: "Converted On",
    width: 220,
    renderCell: (params) => {
      const v = params?.row?.convertedAt;

      if (!v) return "-";

      return dayjs(v).format("DD MMM YYYY");
    },
  };

  const baseColumns = [
    { field: "name", headerName: "Parent's Name", width: 250 },
    { field: "childName", headerName: "Child name", width: 200 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 180,
      renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    },
    {
      field: "action",
      headerName: "Call Center Feedback",
      width: 700,
      renderCell: (params) => {
        const reasonValue = Number(params?.row?.reason ?? 0); // API number
        const selectedValue = getLeadReasonLabel(reasonValue, selectOption); // label string
        const feedback = params?.row?.message ? params?.row?.message : "";
        const isConverted = selectedValue === "Converted - Paid";
        const isPaymentsent = selectedValue === "Payment link sent";
        const isCallbackScheduled = selectedValue === "Callback Scheduled";
        const isOtherSelected = selectedValue === "Other (please specify)";

        return (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              justifyContent: "start",
              margin: "5px 0",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 300 }}>
              <Select
                value={selectedValue}
                onChange={(e) => {
                  const val = e.target.value;

                  if (val === "Other (please specify)") {
                    // reason is numeric from API; no prefill text unless backend provides it separately
                    openOtherModal(params?.row, "");
                    return;
                  }

                  if (val === "Callback Scheduled") {
                    // open scheduler (no prefill unless followUpAt exists)
                    openCallbackModal(
                      params?.row,
                      params?.row?.followUpAt || "",
                    );
                    return;
                  }

                  handleSubmit(params?.row, val);
                }}
                displayEmpty
                disabled={isConverted}
              >
                <MenuItem value="Select Status" disabled>
                  Select Status
                </MenuItem>

                {selectOption?.map((ele, index) => (
                  <MenuItem
                    key={index}
                    value={ele.label}
                    disabled={
                      (!isConverted && ele.label === "Converted - Paid") ||
                      (!isConverted && ele.label === "Payment link sent")
                    }
                  >
                    {ele.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isCallbackScheduled && (
              <Button
                size="small"
                variant="contained"
                color="info"
                onClick={() =>
                  openCallbackModal(params?.row, params?.row?.followUpAt || "")
                }
              >
                View/Edit Callback
              </Button>
            )}

            {isOtherSelected && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => openOtherModal(params?.row, feedback || "")}
              >
                View/Edit Feedback
              </Button>
            )}

            {!isConverted && (
              <>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<WhatsAppIcon />}
                  disabled={sendingLinkRow?.[params?.row?.userId]}
                  onClick={() => handleSendLinkUI(params?.row)}
                >
                  {sendingLinkRow?.[params?.row?.userId]
                    ? "Sending..."
                    : "Send Link"}
                </Button>
              </>
            )}
            {!isConverted && isPaymentsent && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => handlePaymentStatus(params?.row)}
              >
                Check Payment Status
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  let columns = baseColumns;

  if (statusFilter === "Scheduled") {
    columns = [
      baseColumns[0],
      baseColumns[1],
      baseColumns[2],
      // lastCalledDateColumn,
      scheduledDateColumn,
      baseColumns[3],
      baseColumns[4],
    ];
  }

  if (statusFilter === "Converted") {
    columns = [
      baseColumns[0],
      baseColumns[1],
      baseColumns[2],
      convertedDateColumn,
      baseColumns[3],
      baseColumns[4],
    ];
  }

  const convertToCSV = (
    array,
    keys = ["name", "phoneNumber", "childName", "callCenterFeedback"],
  ) => {
    const header = keys.join(",");
    const rows = array.map((row) =>
      keys
        .map((key) => `"${String(row?.[key] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    return [header, ...rows].join("\n");
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleBatchedExport = async () => {
    setIsExporting(true);
    const allData = [];
    const batchSize = 100;
    let page = 1;
    let keepFetching = true;

    while (keepFetching) {
      const formData = new FormData();

      formData.append("FilterType", date);

      if (date === "custom" && startDate && endDate) {
        formData.append("FromDate", formatDateToReadableString(startDate));
        formData.append("ToDate", formatDateToReadableString(endDate));
      }

      formData.append("PageSize", batchSize);
      formData.append("PageNumber", page);
      //   formData.append("statusType", value);

      try {
        let res;
        if (bucket === "Phone Added – Trial Not Clicked") {
          res = await postDataStudent(formData).unwrap();
        } else if (bucket === "Trial Clicked – Not Started") {
          res = await postFreeTrialCliked(formData).unwrap();
        } else if (bucket === "Subscription Cancelled") {
          res = await postSubCancelled(formData).unwrap();
        }

        const currentBatch = res?.data?.users || [];

        allData.push(...currentBatch);

        if (currentBatch.length < batchSize) {
          keepFetching = false;
        } else {
          page += 1;
          await new Promise((r) => setTimeout(r, 200)); // avoid API spam
        }
      } catch (err) {
        console.error("Error fetching batch:", err);
        break;
      }
    }

    if (allData.length) {
      const csv = convertToCSV(allData);

      // 🔥 BOM prefix ensures correct UTF-8 rendering in Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

      saveAs(blob, "data.csv");
    } else {
      alert("No data available to export.");
    }
    setIsExporting(false);
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
              label: "User Buckets",
              href: "/user-buckets",
              icon: <ListAltIcon fontSize="small" />,
            },
          ]}
        />
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <CustomRangeSelect
            value={bucket}
            label={"Select Bucket"}
            onChange={handleBucketChange}
            options={bucketCategory}
            minWidth={300}
          />
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
          {data?.length >= 1 && (
            <Button
              variant="contained"
              onClick={handleBatchedExport}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export All Data"}
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Tabs */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "end",
          }}
        >
          {[
            // "All",
            "Pending",
            "Called",
            "Link Sent",
            "Scheduled",
            "Converted",
          ].map((t) => (
            <Button
              key={t}
              size="small"
              variant={statusFilter === t ? "contained" : "outlined"}
              onClick={() => setStatusFilter(t)}
            >
              {t}
            </Button>
          ))}
        </Box>
        {/* Summary */}
        {!(isLoading || freeTrialClikedLoading || subCancelledLoading) && (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "end",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                <b>
                  {summaryData
                    ? summaryData?.pendingUsers +
                      summaryData?.calledUsers +
                      summaryData?.paymentLinkSentUsers +
                      summaryData?.followUpUsers +
                      summaryData?.convertedUsers
                    : 0}
                </b>
              </p>
              <Typography sx={{ color: "#9ca3af" }}>Total Leads</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                <b>
                  {summaryData?.pendingUsers ? summaryData?.pendingUsers : 0}
                </b>
              </p>
              <Typography sx={{ color: "#9ca3af" }}>Pending</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                <b>{summaryData?.calledUsers ? summaryData?.calledUsers : 0}</b>
              </p>
              <Typography sx={{ color: "#9ca3af" }}>Called</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                <b>
                  {summaryData?.paymentLinkSentUsers
                    ? summaryData?.paymentLinkSentUsers
                    : 0}
                </b>
              </p>
              <Typography sx={{ color: "#9ca3af" }}>Link Sent</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                <b>
                  {summaryData?.followUpUsers ? summaryData?.followUpUsers : 0}
                </b>
              </p>
              <Typography sx={{ color: "#9ca3af" }}>schedule</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                <b>
                  {summaryData?.convertedUsers
                    ? summaryData?.convertedUsers
                    : 0}
                </b>
              </p>
              <Typography sx={{ color: "#9ca3af" }}>Converted</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                <b>
                  {summaryData
                    ? (() => {
                        const total =
                          summaryData?.pendingUsers +
                          summaryData?.calledUsers +
                          summaryData?.paymentLinkSentUsers +
                          summaryData?.followUpUsers +
                          summaryData?.convertedUsers;

                        return total > 0
                          ? (
                              (summaryData?.convertedUsers / total) *
                              100
                            ).toFixed(2)
                          : 0;
                      })()
                    : 0}
                  %
                </b>
              </p>
              <Typography sx={{ color: "#9ca3af" }}>Conv. Rate</Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {isLoading || freeTrialClikedLoading || subCancelledLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <TableWithExport
            userTableData={data?.map((d) => ({ ...d, id: d?.userId }))}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </Paper>
      <Dialog
        open={otherModalOpen}
        onClose={() => setOtherModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditMode ? "View / Edit Feedback" : "Add Feedback"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={4}
            maxRows={8}
            label="Enter feedback"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOtherModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleOtherSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={callbackModalOpen}
        // open={open}
        onClose={() => setCallbackModalOpen(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
            mt: 10, // adjust this value (smaller = higher, larger = lower)
          },
        }}
      >
        <DialogTitle>Schedule Callback</DialogTitle>

        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select date & time"
              value={callbackDateTime}
              onChange={(newValue) => setCallbackDateTime(newValue)}
              minDateTime={dayjs()} // blocks past date+time
              disablePast // extra safety
              shouldDisableTime={shouldDisableTime} // ✅ blocks past hours/minutes for today
              minutesStep={5} // optional: cleaner UX
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  margin: "dense",
                },
              }}
            />
          </LocalizationProvider>

          <Typography sx={{ color: "#9ca3af", mt: 1, fontSize: 13 }}>
            Past date/time is not allowed.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setCallbackModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCallbackSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserBucketsNewBackup;

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
  Menu,
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
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, InputAdornment } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StudentDetailsModal from "../../components/common/StudentDetailsModal";
import UserBucketStudentDetailsModal from "../../components/common/UserBucketStudentDetailsModal";

const SalesCommandCenter = () => {
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [bucket, setbucket] = useState("Subscription Cancelled");
  const [selectOption, setSelectOption] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [sendingLinkRow, setSendingLinkRow] = useState({});

  // child details

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const handleOpenModal = (id) => {
    setSelectedStudentId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudentId(null);
  };

  // search users by number
  const [searchPhone, setSearchPhone] = useState("");
  const [debouncedPhone, setDebouncedPhone] = useState("");

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackRow, setFeedbackRow] = useState(null);
  const [feedbackReason, setFeedbackReason] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackDateTime, setFeedbackDateTime] = useState(null);

  // Derived validation flags — set directly when reason changes
  const [scheduleDateRequired, setScheduleDateRequired] = useState(false);
  const [commentRequired, setCommentRequired] = useState(false);

  // action dropdown
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  const [pendingSend, setPendingSend] = useState({
    row: null,
    channel: null,
    label: "",
    isFreeTrial: false,
  });

  const [errors, setErrors] = useState({
    feedbackReasonError: "",
    feedbackMessageError: "",
    dateError: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPhone(searchPhone);
      setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchPhone]);

  // ─── Reset page to 0 whenever filter changes ───────────────────────────────
  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [statusFilter]);

  // ─── Restore persisted filter state from sessionStorage ────────────────────
  useEffect(() => {
    const storedDate = sessionStorage.getItem("selectedDate");
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");
    const storedBucket = sessionStorage.getItem("selectedBucket");

    if (storedBucket) setbucket(storedBucket);
    if (storedDate) setDate(storedDate);
    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]);
    }
  }, []);

  // ─── API mutations ──────────────────────────────────────────────────────────
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

  // ─── Fetch table data whenever filters / pagination change ─────────────────
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

    if (debouncedPhone.trim()) {
      formData.append("phoneNumber", debouncedPhone.trim());
    }

    if (bucket === "Phone Added – Trial Not Clicked") {
      postDataStudent(formData);
    } else if (bucket === "Trial Clicked – Not Started") {
      postFreeTrialCliked(formData);
    } else if (bucket === "Subscription Cancelled") {
      postSubCancelled(formData);
    }
  }, [
    date,
    startDate,
    endDate,
    paginationModel,
    bucket,
    statusFilter,
    debouncedPhone,
  ]);

  // ─── Helper: get row count for current status tab ──────────────────────────
  const getRowCountByStatus = (data, status) => {
    if (status === "All") return data?.allUsers;
    if (status === "Pending") return data?.pendingUsers;
    if (status === "Called") return data?.calledUsers;
    if (status === "Scheduled") return data?.followUpUsers;
    if (status === "Converted") return data?.convertedUsers;
    if (status === "Payment Link Sent") return data?.paymentLinkSentUsers;
    if (status === "Will Sub. Later") return data?.willSubscribeLaterUsers;
    if (status === "FT Link Sent") return data?.freeTrialLinkSentUsers;
    if (status === "FT Extended") return data?.freeTrialExtendedUsers;
    return data?.allUsers;
  };

  // ─── Sync API response into local state ────────────────────────────────────
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

  // ─── Date filter handlers ───────────────────────────────────────────────────
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

  // ─── Re-fetch helper (used after mutations) ────────────────────────────────
  const handleGetUpdateData = async () => {
    const formData = new FormData();

    if (date !== "custom") {
      formData.append("FilterType", date);
    } else {
      formData.append("FilterType", date);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }

    formData.append("PageSize", paginationModel.pageSize);
    formData.append("PageNumber", paginationModel.page + 1);
    formData.append("leadOutcome", getLeadOutcomeValue(statusFilter));

    if (debouncedPhone.trim()) {
      formData.append("phoneNumber", debouncedPhone.trim());
    }

    try {
      if (bucket === "Phone Added – Trial Not Clicked") {
        await postDataStudent(formData).unwrap();
      } else if (bucket === "Trial Clicked – Not Started") {
        await postFreeTrialCliked(formData).unwrap();
      } else {
        await postSubCancelled(formData).unwrap();
      }
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  // ─── Feedback reason change: update label + derive validation flags ─────────
  // FIX: previously selectedStatus was never set, so scheduleDateRequired /
  //      commentRequired were always false → validation never triggered.
  //      Now we derive the flags directly from selectOption using the label.
  const handleFeedbackReasonChange = (e) => {
    const selectedLabel = e.target.value;
    setFeedbackReason(selectedLabel);

    // Reset previous errors on reason change
    setErrors((prev) => ({ ...prev, feedbackReasonError: "" }));

    // FIX: match by label (feedbackReason stores the label string)
    const matched = selectOption.find((opt) => opt.label === selectedLabel);
    if (matched) {
      setScheduleDateRequired(matched.scheduleDateRequired);
      setCommentRequired(matched.commentRequired);
    } else {
      setScheduleDateRequired(false);
      setCommentRequired(false);
    }
  };

  // ─── Submit feedback to API ─────────────────────────────────────────────────
  const handleSubmitData = async () => {
    const formData = new FormData();

    formData.append("UserId", feedbackRow?.userId);

    // getLeadReasonValue expects the label and looks up the numeric value
    const reasonValue = getLeadReasonValue(feedbackReason, selectOption);
    if (reasonValue !== null) {
      formData.append("LeadReason", reasonValue);
    }

    if (feedbackMessage.trim()) {
      formData.append("message", feedbackMessage.trim());
    }

    formData.append("LeadType", getLeadTypeValue(bucket));

    if (feedbackDateTime) {
      formData.append(
        "FollowUp",
        feedbackDateTime.format("YYYY-MM-DD HH:mm:ss"),
      );
    }

    try {
      const response = await addFeedback(formData).unwrap();

      if (response?.status) {
        toast.success("Feedback submitted successfully!");
        closeFeedbackModal(); // FIX: modal was never closed on success before
        await handleGetUpdateData(); // FIX: data was not refreshed on success
      } else {
        toast.error(response?.message || "Error submitting feedback");
      }
    } catch (error) {
      toast.error("Error submitting feedback");
    }
  };

  // ─── Validate then submit ───────────────────────────────────────────────────
  // FIX: previously this called handleSubmit(row, ...) with args that were
  //      ignored. Now it validates and calls handleSubmitData() directly.
  const handleSubmit = async () => {
    const blockedValues = [1, 16, 6]; // Converted - Paid, Payment link sent
    const matchedOption = selectOption.find(
      (opt) => opt.label === feedbackReason,
    );
    if (matchedOption && blockedValues.includes(matchedOption.value)) {
      toast.error("This status cannot be submitted manually.");
      return;
    }

    // Reset all errors
    setErrors({
      feedbackReasonError: "",
      feedbackMessageError: "",
      dateError: "",
    });

    let isValid = true;

    if (!feedbackReason) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        feedbackReasonError: "Please select a feedback reason.",
      }));
    }

    // FIX: commentRequired flag is now correctly set so this check actually works
    if (commentRequired && !feedbackMessage.trim()) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        feedbackMessageError: "Please enter a comment.",
      }));
    }

    // FIX: scheduleDateRequired flag is now correctly set so this check works
    if (scheduleDateRequired && !feedbackDateTime) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        dateError: "Please select a date & time.",
      }));
    }

    if (!isValid) {
      toast.error("Please fill in all required fields.");
      return;
    }

    await handleSubmitData();
  };

  // ─── Send payment link ──────────────────────────────────────────────────────
  const handleSendLinkUI = async (row, NotificationChannel, isFreeTrial) => {
    const formData = new FormData();
    formData.append("UserId", row?.userId);
    // formData.append("PlanId", 110); // test
    formData.append("PlanId", 145);
    formData.append("LeadType", getLeadTypeValue(bucket));
    formData.append("NotificationChannel", NotificationChannel);
    formData.append("IsFreeTrial", isFreeTrial);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      // setSendingLinkRow((prev) => ({ ...prev, [row?.userId]: true }));
      setSendingLinkRow((prev) => ({
        ...prev,
        [row?.userId]: isFreeTrial ? "ft" : "payment",
      }));

      const res = await postSendPaymentLink(formData).unwrap();

      if (res?.status === true) {
        if (isFreeTrial) {
          toast.success("Free Trial link sent");
        } else {
          toast.success("Payment link sent");
        }
        await handleGetUpdateData();
      } else {
        toast.error("Error sending payment link");
      }
    } catch (error) {
      toast.error("Error sending payment link");
    } finally {
      // setSendingLinkRow((prev) => ({ ...prev, [row?.userId]: false }));
      setSendingLinkRow((prev) => ({ ...prev, [row?.userId]: null }));
    }
  };

  // ─── Check payment status ───────────────────────────────────────────────────
  const handlePaymentStatus = async (row) => {
    const formData = new FormData();
    formData.append("UserId", row?.userId);

    try {
      const res = await postCheckPaymentStatus(formData).unwrap();

      if (res?.status === true) {
        toast.success("Payment verified");
        await handleGetUpdateData();
      } else {
        toast.info(res?.message);
      }
    } catch (error) {
      toast.error("Error while checking payment status");
    }
  };

  // ─── Modal open / close ─────────────────────────────────────────────────────
  const openFeedbackModal = (row) => {
    const reasonValue = Number(row?.reason ?? 0);
    const selectedLabel = getLeadReasonLabel(reasonValue, selectOption);

    // Derive validation flags for the pre-filled reason
    const matched = selectOption.find((opt) => opt.label === selectedLabel);
    setScheduleDateRequired(matched?.scheduleDateRequired ?? false);
    setCommentRequired(matched?.commentRequired ?? false);

    setFeedbackRow(row);
    setFeedbackReason(
      selectedLabel && selectedLabel !== "Select Status" ? selectedLabel : "",
    );
    setFeedbackMessage(row?.notes || "");
    setFeedbackDateTime(row?.followUpAt ? dayjs(row.followUpAt) : null);
    setErrors({
      feedbackReasonError: "",
      feedbackMessageError: "",
      dateError: "",
    });
    setFeedbackModalOpen(true);
  };

  // FIX: also reset validation flags and errors on close
  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setFeedbackRow(null);
    setFeedbackReason("");
    setFeedbackMessage("");
    setFeedbackDateTime(null);
    setScheduleDateRequired(false);
    setCommentRequired(false);
    setErrors({
      feedbackReasonError: "",
      feedbackMessageError: "",
      dateError: "",
    });
  };

  // ─── DateTime picker: disable past times on today ──────────────────────────
  const isSameDay = (a, b) => a && b && a.isSame(b, "day");

  const shouldDisableTime = (value, view) => {
    if (!feedbackDateTime) return false;
    const current = dayjs();
    if (!isSameDay(feedbackDateTime, current)) return false;

    if (view === "hours") return value < current.hour();
    if (view === "minutes") {
      if (feedbackDateTime.hour() !== current.hour()) return false;
      return value < current.minute();
    }
    return false;
  };

  // ─── Column definitions ─────────────────────────────────────────────────────
  const scheduledDateColumn = {
    field: "followUpAt",
    headerName: "Scheduled Date",
    width: 200,
    renderCell: (params) => {
      const v = params?.row?.followUpAt;
      return v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "-";
    },
  };

  const lastCalledDateColumn = {
    field: "lastCalledAt",
    headerName: "Last Called Date",
    width: 200,
    renderCell: (params) => {
      const v = params?.row?.lastCalledAt;
      return v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "-";
    },
  };

  const convertedDateColumn = {
    field: "convertedAt",
    headerName: "Converted On",
    width: 220,
    renderCell: (params) => {
      const v = params?.row?.convertedAt;
      return v ? dayjs(v).format("DD MMM YYYY") : "-";
    },
  };

  const callAttemptsColumn = {
    field: "calledAttempts",
    headerName: "Calls Attempted",
    width: 170,
  };

  const reasonColumn = {
    field: "reason",
    headerName: "Call Center Feedback",
    width: 260,
    renderCell: (params) => {
      const reasonValue = Number(params?.row?.reason ?? 0);
      const label = getLeadReasonLabel(reasonValue, selectOption);
      return label && label !== "Select Status" ? label : "-";
    },
  };

  const baseColumns = [
    { field: "name", headerName: "Parent's Name", width: 190 },
    { field: "childName", headerName: "Child name", width: 160 },
    { field: "phoneNumber", headerName: "Phone Number", width: 170 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "createdAt",
      headerName: "Date",
      width: 160,
      renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    },
    {
      field: "child-info",
      headerName: "User Activity",
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => handleOpenModal(params.row.id)}
        >
          VIEW
        </Button>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 700,
      renderCell: (params) => {
        const reasonValue = Number(params?.row?.reason ?? 0);
        const selectedValue = getLeadReasonLabel(reasonValue, selectOption);
        const isConverted = selectedValue === "Converted - Paid";
        const isPaymentsent =
          selectedValue === "Payment link sent" || "Free Trial Link Sent";

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
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => openFeedbackModal(params?.row)}
            >
              Add Feedback
            </Button>

            {!isConverted && (
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <Select
                  displayEmpty
                  value=""
                  // disabled={sendingLinkRow?.[params?.row?.userId]}
                  disabled={sendingLinkRow?.[params?.row?.userId] === "ft"}
                  onChange={(e) => {
                    const channel = e.target.value;
                    const labels = {
                      0: "Send WhatsApp Link",
                      1: "Send Email",
                      2: "Send Message",
                    };
                    setPendingSend({
                      row: params?.row,
                      channel,
                      label: labels[channel],
                      isFreeTrial: true,
                    });
                    setSendConfirmOpen(true);
                  }}
                  // renderValue={() =>
                  //   sendingLinkRow?.[params?.row?.userId]
                  //     ? "Sending..."
                  //     : "Send FT Link"
                  // }
                  renderValue={() =>
                    sendingLinkRow?.[params?.row?.userId] === "ft"
                      ? "Sending..."
                      : "Send FT Link"
                  }
                  sx={{ fontSize: "13px" }}
                >
                  <MenuItem value={0}>
                    <WhatsAppIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "#25D366" }}
                    />
                    Send WhatsApp Link
                  </MenuItem>
                  <MenuItem value={1}>📧 Send Email</MenuItem>
                  <MenuItem value={2}>💬 Send Message</MenuItem>
                </Select>
              </FormControl>
            )}

            {!isConverted && (
              <FormControl size="small" sx={{ minWidth: 170 }}>
                <Select
                  displayEmpty
                  value=""
                  // disabled={sendingLinkRow?.[params?.row?.userId]}
                  disabled={sendingLinkRow?.[params?.row?.userId] === "payment"}
                  onChange={(e) => {
                    const channel = e.target.value;
                    const labels = {
                      0: "Send WhatsApp Link",
                      1: "Send Email",
                      2: "Send Message",
                    };
                    setPendingSend({
                      row: params?.row,
                      channel,
                      label: labels[channel],
                      isFreeTrial: false,
                    });
                    setSendConfirmOpen(true);
                  }}
                  // renderValue={() =>
                  //   sendingLinkRow?.[params?.row?.userId]
                  //     ? "Sending..."
                  //     : "Send Payment Link"
                  // }
                  renderValue={() =>
                    sendingLinkRow?.[params?.row?.userId] === "payment"
                      ? "Sending..."
                      : "Send Payment Link"
                  }
                  sx={{ fontSize: "13px" }}
                >
                  <MenuItem value={0}>
                    <WhatsAppIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "#25D366" }}
                    />
                    Send WhatsApp Link
                  </MenuItem>
                  <MenuItem value={1}>📧 Send Email</MenuItem>
                  <MenuItem value={2}>💬 Send Message</MenuItem>
                </Select>
              </FormControl>
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

  const planExpiryDateColumn = {
    field: "planExpiryDate",
    headerName: "Plan Expiry Date",
    width: 200,
    renderCell: (params) => {
      const v = params?.row?.planExpiryDate;
      return v ? dayjs(v).format("DD MMM YYYY, hh:mm A") : "-";
    },
  };

  let columns = baseColumns;

  if (statusFilter === "Scheduled") {
    columns = [
      baseColumns[0],
      baseColumns[1],
      baseColumns[2],
      baseColumns[3],
      callAttemptsColumn,
      lastCalledDateColumn,
      scheduledDateColumn,
      baseColumns[4],
      reasonColumn,
      baseColumns[5],
      baseColumns[6],
    ];
  } else if (statusFilter === "Converted") {
    columns = [
      baseColumns[0],
      baseColumns[1],
      baseColumns[2],
      baseColumns[3],
      convertedDateColumn,
      baseColumns[4],
      baseColumns[5],
      reasonColumn,
      // baseColumns[4],
    ];
  } else if (statusFilter === "FT Extended") {
    columns = [
      baseColumns[0],
      baseColumns[1],
      baseColumns[2],
      baseColumns[3],
      baseColumns[4],
      baseColumns[5],
      reasonColumn,
      // baseColumns[4],
    ];
  } else if (
    statusFilter === "Called" ||
    statusFilter === "Payment Link Sent" ||
    statusFilter === "Will Sub. Later" ||
    statusFilter === "FT Link Sent"
  ) {
    columns = [
      baseColumns[0],
      baseColumns[1],
      baseColumns[2],
      baseColumns[3],
      reasonColumn,
      callAttemptsColumn,
      lastCalledDateColumn,
      baseColumns[4],
      baseColumns[5],
      baseColumns[6],
    ];
  } else {
    // Pending tab — add planExpiryDate after the Date column
    columns = [
      baseColumns[0], // Parent's Name
      baseColumns[1], // Child Name
      baseColumns[2], // Phone Number
      baseColumns[3], // Email
      baseColumns[4], // Date (createdAt)
      planExpiryDateColumn, // ✅ only here
      baseColumns[5], // User Activity
      baseColumns[6], // Action
    ];
  }

  // ─── CSV export ─────────────────────────────────────────────────────────────

  const [isExporting, setIsExporting] = useState(false);

  const convertToCSV = (array) => {
    // ─── Define columns per status tab ───────────────────────────────────────
    const getColumnsForStatus = () => {
      const base = ["name", "phoneNumber", "email", "childName"];

      if (statusFilter === "Scheduled") {
        return {
          keys: [
            ...base,
            "calledAttempts",
            "lastCalledAt",
            "followUpAt",
            "createdAt",
          ],
          headers: [
            "Parent's Name",
            "Phone Number",
            "Email",
            "Child Name",
            "Calls Attempted",
            "Last Called Date",
            "Scheduled Date",
            "Date",
            "Call Center Feedback",
          ],
          includeReason: true,
        };
      } else if (statusFilter === "Converted") {
        return {
          keys: [...base, "convertedAt", "createdAt"],
          headers: [
            "Parent's Name",
            "Phone Number",
            "Email",
            "Child Name",
            "Converted On",
            "Date",
            "Call Center Feedback",
          ],
          includeReason: true,
        };
      } else if (
        statusFilter === "Called" ||
        statusFilter === "Payment Link Sent" ||
        statusFilter === "Will Sub. Later" ||
        statusFilter === "FT Link Sent" ||
        statusFilter === "FT Extended"
      ) {
        return {
          keys: [...base, "calledAttempts", "lastCalledAt", "createdAt"],
          headers: [
            "Parent's Name",
            "Phone Number",
            "Email",
            "Child Name",
            "Calls Attempted",
            "Last Called Date",
            "Date",
            "Call Center Feedback",
          ],
          includeReason: true,
        };
      } else {
        // Pending (default)
        return {
          keys: [...base, "createdAt", "planExpiryDate"],
          headers: [
            "Parent's Name",
            "Phone Number",
            "Email",
            "Child Name",
            "Date",
            "Plan Expiry Date",
          ],
          includeReason: false,
        };
      }
    };

    const { keys, headers, includeReason } = getColumnsForStatus();

    const header = includeReason ? headers.join(",") : headers.join(",");

    const rows = array.map((row) => {
      const reasonValue = Number(row?.reason ?? 0);
      const reasonLabel = getLeadReasonLabel(reasonValue, selectOption) || "-";

      const baseValues = keys.map((key) => {
        let value = row?.[key] ?? "";

        // Format date fields
        if (key === "lastCalledAt" || key === "followUpAt") {
          value = value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "-";
        } else if (key === "convertedAt") {
          value = value ? dayjs(value).format("DD MMM YYYY") : "-";
        } else if (key === "createdAt") {
          value = value ? dayjs(value).format("DD MMM YYYY") : "-";
        } else if (key === "planExpiryDate") {
          // ✅ add this
          value = value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "-";
        }

        return `"${String(value).replace(/"/g, '""')}"`;
      });

      if (includeReason) {
        baseValues.push(`"${reasonLabel}"`);
      }

      return baseValues.join(",");
    });

    return [header, ...rows].join("\n");
  };

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
      // ✅ FIX: pass the active tab's status filter
      formData.append("leadOutcome", getLeadOutcomeValue(statusFilter));

      if (debouncedPhone.trim()) {
        formData.append("phoneNumber", debouncedPhone.trim());
      }

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
          await new Promise((r) => setTimeout(r, 200));
        }
      } catch (err) {
        console.error("Error fetching batch:", err);
        break;
      }
    }

    if (allData.length) {
      // ✅ FIX: export label instead of raw reason number
      const csv = convertToCSV(allData);
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      // ✅ FIX: filename includes bucket + active tab for clarity
      saveAs(blob, `${bucket}_${statusFilter}_export.csv`);
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
          <TextField
            size="small"
            fullWidth
            label="Search by phone number"
            sx={{ width: 250 }}
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />
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
              // maxDate={new Date()}
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
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Status tabs + summary bar */}
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
        <Box sx={{ display: "flex", gap: 1, justifyContent: "end" }}>
          {[
            "Pending",
            "Called",
            "Scheduled",
            "Will Sub. Later",
            "FT Link Sent",
            "FT Extended",
            "Payment Link Sent",
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

        {!(isLoading || freeTrialClikedLoading || subCancelledLoading) && (
          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "end" }}>
            {[
              {
                value: summaryData?.allUsers ?? 0,
                label: "Total Leads",
              },
              { value: summaryData?.pendingUsers ?? 0, label: "Pending" },
              { value: summaryData?.calledUsers ?? 0, label: "Called" },

              { value: summaryData?.followUpUsers ?? 0, label: "Schedule" },
              {
                value: summaryData?.willSubscribeLaterUsers ?? 0,
                label: "Will Sub. Later",
              },
              {
                value: summaryData?.freeTrialLinkSentUsers ?? 0,
                label: "FT Link Sent",
              },
              {
                value: summaryData?.freeTrialExtendedUsers ?? 0,
                label: "FT Extended",
              },
              {
                value: summaryData?.paymentLinkSentUsers ?? 0,
                label: "Payment Link Sent",
              },
              { value: summaryData?.convertedUsers ?? 0, label: "Converted" },
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
                <Typography sx={{ color: "#9ca3af", fontSize: 13 }}>
                  {label}
                </Typography>
              </Box>
            ))}

            {/* Conversion rate */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                {/* <b>
                  {(() => {
                    const total = summaryData?.allUsers ?? 0;
                    return total > 0
                      ? ((summaryData?.convertedUsers / total) * 100).toFixed(2)
                      : 0;
                  })()}
                  %
                </b> */}
                <b>{summaryData?.conversionRate ?? 0}%</b>
              </p>
              <Typography sx={{ color: "#9ca3af", fontSize: 13 }}>
                Conv. Rate
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Data table */}
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

      {/* Feedback modal */}
      <Dialog
        open={feedbackModalOpen}
        onClose={closeFeedbackModal}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
            mt: 4,
          },
        }}
      >
        <DialogTitle>
          {feedbackRow?.reason ? "View / Edit Feedback" : "Add Feedback"}
        </DialogTitle>

        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              {/* Reason select */}
              <FormControl fullWidth size="small">
                <Select
                  value={feedbackReason}
                  onChange={handleFeedbackReasonChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Reason
                  </MenuItem>
                  {selectOption.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.label}
                      disabled={
                        option.value === 1 ||
                        option.value === 16 ||
                        option.value === 6 ||
                        option.value === 19 ||
                        option.value === 20
                      } // ✅ disabled but visible
                      sx={{
                        // ✅ optional: style them to look clearly disabled
                        "&.Mui-disabled": {
                          opacity: 0.5,
                          fontStyle: "italic",
                        },
                      }}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.feedbackReasonError && (
                <Typography color="error" variant="caption">
                  {errors.feedbackReasonError}
                </Typography>
              )}

              <DateTimePicker
                label={`Select date & time${scheduleDateRequired ? " *" : ""}`}
                value={feedbackDateTime}
                onChange={(newValue) => {
                  setFeedbackDateTime(newValue);
                  if (errors.dateError) {
                    setErrors((prev) => ({ ...prev, dateError: "" }));
                  }
                }}
                minDateTime={dayjs()}
                disablePast
                shouldDisableTime={shouldDisableTime}
                minutesStep={5}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    InputProps: {
                      endAdornment: feedbackDateTime ? ( // ✅ only show when value exists
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setFeedbackDateTime(null); // ✅ reset to null
                              if (errors.dateError) {
                                setErrors((prev) => ({
                                  ...prev,
                                  dateError: "",
                                }));
                              }
                            }}
                            edge="end"
                          >
                            <ClearIcon
                              fontSize="medium"
                              sx={{
                                backgroundColor: "#ff6363",
                                color: "white",
                                borderRadius: "50%",
                              }}
                            />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    },
                  },
                }}
              />
              {errors.dateError && (
                <Typography color="error" variant="caption">
                  {errors.dateError}
                </Typography>
              )}

              {/* Comment field — always visible, required only when commentRequired */}
              <TextField
                fullWidth
                multiline
                minRows={4}
                maxRows={8}
                label={`Enter message${commentRequired ? " *" : ""}`}
                value={feedbackMessage}
                onChange={(e) => {
                  setFeedbackMessage(e.target.value);
                  if (errors.feedbackMessageError) {
                    setErrors((prev) => ({
                      ...prev,
                      feedbackMessageError: "",
                    }));
                  }
                }}
              />
              {errors.feedbackMessageError && (
                <Typography color="error" variant="caption">
                  {errors.feedbackMessageError}
                </Typography>
              )}
            </Box>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeFeedbackModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Send Confirmation Dialog */}
      <Dialog
        open={sendConfirmOpen}
        onClose={() => setSendConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <b>{pendingSend.label}</b> to{" "}
            <b>{pendingSend.row?.name}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSendConfirmOpen(false);
              setPendingSend({
                row: null,
                channel: null,
                label: "",
                isFreeTrial: false,
              });
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={async () => {
              setSendConfirmOpen(false);
              await handleSendLinkUI(
                pendingSend.row,
                pendingSend.channel,
                pendingSend.isFreeTrial,
              );
              setPendingSend({
                row: null,
                channel: null,
                label: "",
                isFreeTrial: false,
              });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {selectedStudentId !== null && (
        <UserBucketStudentDetailsModal
          open={openModal}
          onClose={handleCloseModal}
          studentId={selectedStudentId}
        />
      )}
    </>
  );
};

export default SalesCommandCenter;

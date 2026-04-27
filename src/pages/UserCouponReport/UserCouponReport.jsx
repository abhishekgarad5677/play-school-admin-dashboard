import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import {
  useUserShopifyCouponReportMutation,
  useCheckPaymentStatusMutation, // ✅ NEW — add this to your apiSlice exports
  useAddOrderIdMutation,
  useCheckCouponRedeemStatusMutation, // ✅ NEW — add this to your apiSlice exports
} from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import DatePicker from "react-datepicker";
import { TableWithExport } from "../../components/table/TableWithExport";
import { dateFilterOptions } from "../../utils/constant";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import { saveAs } from "file-saver";
import { toast } from "react-toastify"; // ✅ NEW — make sure toast is imported

const COUPON_PASSWORD = import.meta.env.VITE_USER_COUPON_PASSWORD;

const SummaryCard = ({ label, value }) => (
  <Paper sx={{ p: 2, minWidth: 160, textAlign: "center" }}>
    <Typography variant="h5" fontWeight={600}>
      {value ?? 0}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

const UserCouponReport = () => {
  const [data, setData] = useState();
  const [summary, setSummary] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  // ✅ NEW state variables — add after orderIdError state
  const [orderPassword, setOrderPassword] = useState("");
  const [orderPasswordError, setOrderPasswordError] = useState("");
  const [showOrderPassword, setShowOrderPassword] = useState(false);

  // coupon reveal states
  const [showCoupon, setShowCoupon] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ NEW — Order ID modal states
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [orderIdError, setOrderIdError] = useState("");

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [date, setDate] = useState(
    () => sessionStorage.getItem("selectedDate") || "today",
  );

  const [dateRange, setDateRange] = useState(() => {
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");
    if (
      storedStartDate &&
      storedEndDate &&
      storedStartDate !== "null" &&
      storedEndDate !== "null"
    ) {
      return [new Date(storedStartDate), new Date(storedEndDate)];
    }
    return [null, null];
  });

  const [startDate, endDate] = dateRange;

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    if (selectedDate === "custom") {
      sessionStorage.setItem("selectedDate", selectedDate);
      if (startDate) sessionStorage.setItem("startDate", startDate);
      if (endDate) sessionStorage.setItem("endDate", endDate);
    } else {
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.removeItem("startDate");
      sessionStorage.removeItem("endDate");
    }
  };

  // lock/unlock handlers
  const handleLockClick = () => {
    if (showCoupon) {
      setShowCoupon(false);
    } else {
      setPassword("");
      setPasswordError("");
      setModalOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === COUPON_PASSWORD) {
      setShowCoupon(true);
      setModalOpen(false);
      setPassword("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPassword("");
    setPasswordError("");
  };

  const [postDataStudent, { isLoading, data: studentsData }] =
    useUserShopifyCouponReportMutation();

  // ✅ NEW — mutations for actions column
  const [postCheckPaymentStatus] = useCheckCouponRedeemStatusMutation();
  const [postAddOrderId, { isLoading: isSubmittingOrderId }] =
    useAddOrderIdMutation();

  // ✅ NEW — re-fetch current page after an action updates data
  const handleGetUpdateData = async () => {
    if (date === "custom" && (!startDate || !endDate)) return;
    const formData = new FormData();
    formData.append("FilterType", date);
    if (date === "custom") {
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }
    formData.append("PageSize", paginationModel.pageSize);
    formData.append("PageNumber", paginationModel.page + 1);
    if (showCoupon) formData.append("viewCoupon", true);
    postDataStudent(formData);
  };

  // ✅ NEW — check redeem status handler
  const handlePaymentStatus = async (row) => {
    const formData = new FormData();
    formData.append("UserId", row?.id);

    try {
      const res = await postCheckPaymentStatus(formData).unwrap();
      console.log("===", res?.data?.isRedeemed);

      if (res?.data?.isRedeemed === true) {
        toast.success("Coupon redeemed successfully.");
        await handleGetUpdateData();
      } else {
        toast.info("Coupon redemption pending");
      }
    } catch (error) {
      toast.error("Error while checking payment status");
    }
  };

  // ✅ UPDATE handleOpenOrderModal — reset new states
  const handleOpenOrderModal = (row) => {
    setSelectedRow(row);
    setOrderId("");
    setOrderIdError("");
    setOrderPassword(""); // ✅ NEW
    setOrderPasswordError(""); // ✅ NEW
    setShowOrderPassword(false); // ✅ NEW
    setOrderModalOpen(true);
  };

  // ✅ UPDATE handleCloseOrderModal — reset new states
  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setSelectedRow(null);
    setOrderId("");
    setOrderIdError("");
    setOrderPassword(""); // ✅ NEW
    setOrderPasswordError(""); // ✅ NEW
    setShowOrderPassword(false); // ✅ NEW
  };

  // ✅ UPDATE handleOrderIdSubmit — validate password before API call
  const handleOrderIdSubmit = async () => {
    if (!orderId.trim()) {
      setOrderIdError("Order ID cannot be empty.");
      return;
    }

    // ✅ NEW — block API call if password is wrong
    if (orderPassword !== COUPON_PASSWORD) {
      setOrderPasswordError("Incorrect password. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("UserId", selectedRow?.id);
    formData.append("ShopifyOrderId", orderId.trim());

    try {
      const res = await postAddOrderId(formData).unwrap();
      if (res?.status === true) {
        toast.success("Order ID added successfully");
        handleCloseOrderModal();
        await handleGetUpdateData();
      } else {
        toast.error(res?.message || "Failed to add Order ID");
      }
    } catch (error) {
      toast.error("Error while adding Order ID");
    }
  };

  useEffect(() => {
    if (date === "custom" && (!startDate || !endDate)) return;
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
    if (showCoupon) formData.append("viewCoupon", true);
    postDataStudent(formData);
  }, [date, startDate, endDate, paginationModel, showCoupon]);

  useEffect(() => {
    if (studentsData) {
      const inner = studentsData?.data?.data;
      setData(inner?.coupons);
      setRowCount(inner?.totalGenerated);
      setSummary(inner);
    }
  }, [studentsData]);

  const baseColumns = [
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 260 },
    { field: "phoneNumber", headerName: "Phone", width: 160 },
    {
      field: "shopifyOrderId",
      headerName: "Shopify Order Id",
      width: 160,
      renderCell: (params) =>
        params.row.shopifyOrderId ? (
          <Chip
            label={params.row.shopifyOrderId || "—"}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontFamily: "monospace", letterSpacing: 1 }}
          />
        ) : (
          "-"
        ),
    },
    ...(showCoupon
      ? [
          {
            field: "couponCode",
            headerName: "Coupon Code",
            width: 200,
            renderCell: (params) => (
              <Chip
                label={params.row.couponCode || "—"}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontFamily: "monospace", letterSpacing: 1 }}
              />
            ),
          },
        ]
      : []),
    {
      field: "isRedeemed",
      headerName: "Coupon Redeemed",
      width: 160,
      renderCell: (params) =>
        params.row.isRedeemed ? (
          <Chip label="Yes" color="success" variant="outlined" size="small" />
        ) : (
          <Chip label="No" color="warning" variant="outlined" size="small" />
        ),
    },
    // ✅ NEW — Actions column
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return row.isRedeemed ? (
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleOpenOrderModal(row)}
          >
            Add Shopify Order ID
          </Button>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => handlePaymentStatus(row)}
          >
            Check Redeem Status
          </Button>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 170,
      renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    },
    {
      field: "expiresAt",
      headerName: "Expires On",
      width: 170,
      renderCell: (params) => useFormattedDate(params?.row?.expiresAt),
    },
    { field: "city", headerName: "City", width: 140 },
    { field: "state", headerName: "State", width: 160 },
  ];

  const columns = baseColumns;

  const convertToCSV = (array) => {
    const keys = Object.keys(array[0] || {});
    const header = keys.join(",");
    const rows = array.map((row) =>
      keys
        .map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
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
      if (showCoupon) formData.append("viewCoupon", true);
      formData.append("PageSize", batchSize);
      formData.append("PageNumber", page);

      try {
        const res = await postDataStudent(formData).unwrap();
        const currentBatch = res?.data?.data?.coupons || [];
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
      const csv = convertToCSV(allData);
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "User_Coupon_Report.csv");
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
              label: "User Coupon Report",
              href: "/user-coupon-report",
              icon: <AssignmentIcon fontSize="small" />,
            },
          ]}
        />
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Chip
            icon={
              showCoupon ? (
                <LockOpenIcon fontSize="small" />
              ) : (
                <LockIcon fontSize="small" />
              )
            }
            label={
              showCoupon ? "Coupon Codes: Visible" : "Coupon Codes: Hidden"
            }
            onClick={handleLockClick}
            color={showCoupon ? "success" : "default"}
            variant={showCoupon ? "filled" : "outlined"}
            sx={{ cursor: "pointer", fontWeight: 500, px: 0.5 }}
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
      {summary && (
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <SummaryCard
            label="Total Generated Coupons"
            value={summary.totalGenerated}
          />
          <SummaryCard label="Coupons Redeemed" value={summary.redeemedCount} />
          <SummaryCard
            label="Coupons Not Redeemed"
            value={summary.notRedeemedCount}
          />
        </Box>
      )}
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {isLoading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : (
          <TableWithExport
            userTableData={data?.map((d) => ({ ...d, id: d.id }))}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </Paper>
      {/* Password Modal — unchanged */}
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LockIcon color="warning" />
          Enter Security Password
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Coupon codes are protected. Enter the password to reveal them.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleModalClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={!password}
          >
            Unlock
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shopify order ID Modal */}
      <Dialog
        open={orderModalOpen}
        onClose={handleCloseOrderModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AssignmentIcon color="primary" />
          Add Order ID
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the Order ID for{" "}
            <strong>{selectedRow?.name || "this user"}</strong>.
          </Typography>

          {/* Order ID field — unchanged */}
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Shopify Order ID"
            value={orderId}
            onChange={(e) => {
              setOrderId(e.target.value);
              setOrderIdError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleOrderIdSubmit()}
            error={!!orderIdError}
            helperText={orderIdError}
          />

          {/* ✅ NEW — Security password field */}
          <TextField
            fullWidth
            size="small"
            label="Security Password"
            type={showOrderPassword ? "text" : "password"}
            value={orderPassword}
            onChange={(e) => {
              setOrderPassword(e.target.value);
              setOrderPasswordError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleOrderIdSubmit()}
            error={!!orderPasswordError}
            helperText={orderPasswordError}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOrderPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showOrderPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseOrderModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleOrderIdSubmit}
            variant="contained"
            disabled={!orderId.trim() || !orderPassword || isSubmittingOrderId}
          >
            {isSubmittingOrderId ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserCouponReport;

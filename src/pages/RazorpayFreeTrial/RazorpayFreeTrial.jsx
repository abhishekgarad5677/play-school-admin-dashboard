import { Box, Button, Chip, Paper, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import PeopleIcon from "@mui/icons-material/People";
import {
  formatDateToReadableString,
  getAgeForStudent,
  useFormattedDate,
} from "../../utils/Hooks";
import { useGetRazorPayFreeTrialDataMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import DatePicker from "react-datepicker";
import { TableWithExport } from "../../components/table/TableWithExport";
import {
  appFilterOptions,
  dateFilterOptions,
  regionOptions,
} from "../../utils/constant";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import { saveAs } from "file-saver";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StudentDetailsModal from "../../components/common/StudentDetailsModal";

const RazorpayFreeTrial = () => {
  const [data, setData] = useState();
  const [rowCount, setRowCount] = useState(0);
  // const [date, setDate] = useState("today");
  // const [dateRange, setDateRange] = useState([null, null]);
  // const [startDate, endDate] = dateRange;

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

  const [platform, setPlatform] = useState(
    () => Number(sessionStorage.getItem("selectedPlatform")) || 0,
  );
  const [region, setRegion] = useState(
    () => Number(sessionStorage.getItem("selectedRegion")) || 0,
  );

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

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

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

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
    sessionStorage.setItem("selectedPlatform", event.target.value);
  };

  const handleRegionChange = (event) => {
    setRegion(event.target.value);
    sessionStorage.setItem("selectedRegion", event.target.value);
  };

  // useEffect(() => {
  //   const storedDate = sessionStorage.getItem("selectedDate");
  //   const storedStartDate = sessionStorage.getItem("startDate");
  //   const storedEndDate = sessionStorage.getItem("endDate");

  //   if (storedDate) {
  //     setDate(storedDate); // Set the stored date to default value
  //   }
  //   if (storedStartDate && storedEndDate) {
  //     setDateRange([new Date(storedStartDate), new Date(storedEndDate)]); // Set the date range if custom is selected
  //   }
  // }, []);

  const [postDataStudent, { isLoading, error, data: studentsData }] =
    useGetRazorPayFreeTrialDataMutation();

  useEffect(() => {
    if (date === "custom" && (!startDate || !endDate)) return;

    const formData = new FormData();
    formData.append("region", region);
    formData.append("platform", platform);

    if (date !== "custom") {
      formData.append("FilterType", date);
    } else if (date === "custom" && startDate && endDate) {
      formData.append("FilterType", date);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }

    formData.append("PageSize", paginationModel.pageSize);
    formData.append("PageNumber", paginationModel.page + 1); // API is 1-indexed
    formData.append("isFreeActive", false);

    postDataStudent(formData);
  }, [date, startDate, endDate, paginationModel, region, platform]);

  useEffect(() => {
    if (studentsData) {
      setData(studentsData?.data);
      setRowCount(studentsData?.totalUser);
    }
  }, [studentsData]);

  const columns = [
    {
      field: "parentName",
      headerName: "Parent Name",
      width: 180,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{params?.row?.parentName}</span>
        </div>
      ),
    },
    {
      field: "country",
      headerName: "Country",
      width: 160,
      renderCell: (params) =>
        params?.row?.country ? params?.row?.country : "-",
    },
    {
      field: "state",
      headerName: "State",
      width: 160,
      renderCell: (params) => (params?.row?.state ? params?.row?.state : "-"),
    },
    {
      field: "city",
      headerName: "City",
      width: 160,
      renderCell: (params) => (params?.row?.city ? params?.row?.city : "-"),
    },
    // { field: "childsName", headerName: "Child's Name", width: 170 },
    // { field: "email", headerName: "Email", width: 300 },
    {
      field: "subscriptionStatus",
      headerName: "Subscription Status",
      width: 180,
      renderCell: (params) => (
        <Chip
          size="small"
          label={
            params?.row?.subscriptionStatus === "authenticated" ||
            params?.row?.subscriptionStatus === "INITIAL_BUY"
              ? "Free Trial Started"
              : params?.row?.subscriptionStatus
          }
          sx={{
            fontWeight: "medium",
            padding: "5px",
          }}
        />
      ),
    },
    {
      field: "registeredDate",
      headerName: "Registered Date",
      width: 180,
      renderCell: (params) => useFormattedDate(params?.row?.registeredDate),
    },
    {
      field: "subscriptionStartDate",
      headerName: "Subscription Start Date",
      width: 200,
      renderCell: (params) =>
        useFormattedDate(params?.row?.subscriptionStartDate),
    },
    {
      field: "planExpiryDate",
      headerName: "Plan Expiry Date",
      width: 180,
      renderCell: (params) => useFormattedDate(params?.row?.planExpiryDate),
    },
    // { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    // {
    //   field: "gender",
    //   headerName: "Gender",
    //   width: 100,
    //   renderCell: (params) => (
    //     <Chip
    //       size="small"
    //       label={params?.row?.gender}
    //       sx={{
    //         backgroundColor:
    //           params?.row?.gender === "Boy" ? "#448aff" : "#e666fb",
    //         color: "white",
    //         fontWeight: "medium",
    //         padding: "5px",
    //       }}
    //     />
    //   ),
    // },
    {
      field: "dateOfBirth",
      headerName: "Age",
      width: 100,
      renderCell: (params) => getAgeForStudent(params?.row?.dateOfBirth),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <RemoveRedEyeIcon
            onClick={() => handleOpenModal(params.row.id)}
            sx={{ color: "#5d87ff", cursor: "pointer" }}
          />
        </Tooltip>
      ),
    },
  ];

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
      formData.append("region", region);
      formData.append("platform", platform);

      if (date === "custom" && startDate && endDate) {
        formData.append("FromDate", formatDateToReadableString(startDate));
        formData.append("ToDate", formatDateToReadableString(endDate));
      }

      formData.append("PageSize", batchSize);
      formData.append("PageNumber", page);
      formData.append("isFreeActive", false);

      try {
        const res = await postDataStudent(formData).unwrap();
        const currentBatch = res?.data || [];

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

      saveAs(blob, "students_data.csv");
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
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        {/* <CustomBreadcrumbs
          items={[
            {
              label: "Razorpay Free Trial Users",
              href: "/dashboard/razor-pay-free-trial",
              icon: <PeopleIcon fontSize="small" />,
            },
          ]}
        /> */}
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          {/* app select dropdown */}
          <CustomRangeSelect
            value={platform}
            label={"Platform"}
            onChange={handlePlatformChange}
            options={appFilterOptions}
          />
          <CustomRangeSelect
            value={region}
            label={"Region"}
            onChange={handleRegionChange}
            options={regionOptions}
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
                if (start) sessionStorage.setItem("startDate", start);
                if (end) sessionStorage.setItem("endDate", end);
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
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
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
      <StudentDetailsModal
        open={openModal}
        onClose={handleCloseModal}
        studentId={selectedStudentId}
      />
    </>
  );
};

export default RazorpayFreeTrial;

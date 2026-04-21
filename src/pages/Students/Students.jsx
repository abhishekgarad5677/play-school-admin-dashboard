import { Box, Button, Chip, Paper, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import { useGetallstudentsinfoMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import DatePicker from "react-datepicker";
import { TableWithExport } from "../../components/table/TableWithExport";
import {
  dateFilterOptions,
  appFilterOptions,
  regionOptions,
} from "../../utils/constant";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import { saveAs } from "file-saver";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StudentDetailsModal from "../../components/common/StudentDetailsModal";

const Students = () => {
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

  const [postDataStudent, { isLoading, error, data: studentsData }] =
    useGetallstudentsinfoMutation();

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
    { field: "childsName", headerName: "Child's Name", width: 170 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "isActive",
      headerName: "Subscription Plan",
      width: 200,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params?.row?.isActive ? "Active" : "Inactive"}
          sx={{
            backgroundColor: params?.row?.isActive === true ? "green" : "red",
            color: "white",
            fontWeight: "medium",
            padding: "5px",
          }}
        />
      ),
    },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    { field: "planName", headerName: "Plan Name", width: 200 },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      renderCell: (params) => params.row.amount + " " + params.row.currencyCode,
    },
    // {
    //   field: "lastActiveDate",
    //   headerName: "Last Active Date",
    //   width: 200,
    //   renderCell: (params) => useFormattedDate(params?.row?.lastActiveDate),
    // },
    {
      field: "subscriptionStartDate",
      headerName: "Subscription Start Date",
      width: 200,
      renderCell: (params) =>
        useFormattedDate(params?.row?.subscriptionStartDate),
    },
    {
      field: "registeredDate",
      headerName: "Registered Date",
      width: 180,
      renderCell: (params) => useFormattedDate(params?.row?.registeredDate),
    },
    // {
    //   field: "planExpiryDate",
    //   headerName: "Plan Expiry Date",
    //   width: 200,
    //   renderCell: (params) => useFormattedDate(params?.row?.planExpiryDate),
    // },
    // {
    //   field: "dateOfBirth",
    //   headerName: "Date of Birth",
    //   width: 180,
    //   renderCell: (params) => useFormattedDate(params?.row?.dateOfBirth),
    // },
    {
      field: "city",
      headerName: "City",
      width: 150,
      renderCell: (params) => (params?.row?.city ? params?.row?.city : "-"),
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
      renderCell: (params) => (params?.row?.state ? params?.row?.state : "-"),
    },
    {
      field: "country",
      headerName: "Country",
      width: 150,
      renderCell: (params) =>
        params?.row?.country ? params?.row?.country : "-",
    },
    // { field: "studentId", headerName: "Student ID", width: 100 },
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
              label: "Students",
              href: "/subscribed-users",
              icon: <ChildCareIcon fontSize="small" />,
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
                sessionStorage.setItem("startDate", start); // Store the start date
                sessionStorage.setItem("endDate", end); // Store the end date
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
        {/* students table data */}
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

export default Students;

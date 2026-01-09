import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Paper, Tab, Tabs, TextField } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useGetSubscriptionStatusMutation } from "../../redux/slices/apiSlice";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import DatePicker from "react-datepicker";
import { dateFilterOptions } from "../../utils/constant";
import PropTypes from "prop-types";
import InfoIcon from "@mui/icons-material/Info";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { TableWithExport } from "../../components/table/TableWithExport";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Subscription = () => {
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [value, setValue] = useState(0);
  const [data, setData] = useState();
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    if (selectedDate === "custom") {
      // Store the custom date range in sessionStorage
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.setItem("startDate", startDate);
      sessionStorage.setItem("endDate", endDate);
    } else {
      // Store the selected date (e.g., "today", "yesterday", etc.)
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.removeItem("startDate");
      sessionStorage.removeItem("endDate");
    }
  };

  useEffect(() => {
    const storedDate = sessionStorage.getItem("selectedDate");
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");

    if (storedDate) {
      setDate(storedDate); // Set the stored date to default value
    }
    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]); // Set the date range if custom is selected
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [postDataStudent, { isLoading, error, data: studentsData }] =
    useGetSubscriptionStatusMutation();

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
    formData.append("PageNumber", paginationModel.page + 1); // API is 1-indexed
    formData.append("statusType", value);

    postDataStudent(formData);
  }, [date, startDate, endDate, paginationModel, value]);

  useEffect(() => {
    if (studentsData) {
      setData(studentsData?.data);
      setRowCount(studentsData?.totalUser);
      // setRowCount(studentsData?.pageSize);
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
    { field: "childName", headerName: "Child's Name", width: 170 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "subscriptionStatus",
      headerName: "Subscription Status",
      width: 250,
      renderCell: (params) => (
        <Chip
          size="small"
          label={
            params?.row?.subscriptionStatus === "authenticated"
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
      renderCell: (params) => useFormattedDate(params?.row?.registerDate),
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
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.planExpiryDate),
    },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params?.row?.gender}
          sx={{
            backgroundColor:
              params?.row?.gender === "Boy" ? "#448aff" : "#e666fb",
            color: "white",
            fontWeight: "medium",
            padding: "5px",
          }}
        />
      ),
    },
  ];

  const convertToCSV = (array) => {
    const keys = Object.keys(array[0] || {});
    const header = keys.join(",");
    const rows = array.map((row) =>
      keys
        .map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`)
        .join(",")
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
      formData.append("statusType", value);

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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "Subscription Status",
              href: "/dashboard/subscription",
              icon: <InfoIcon fontSize="small" />,
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
          {data?.length > 1 && (
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
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Free Trial Started" {...a11yProps(0)} />
              <Tab label="Subscription Due" {...a11yProps(1)} />
              <Tab label="Subscription Started" {...a11yProps(2)} />
              <Tab label="Subscription Cancelled" {...a11yProps(3)} />
              <Tab label="Free Trial Cancelled Same Day" {...a11yProps(4)} />
              <Tab label="Subscription Renewed" {...a11yProps(5)} />
            </Tabs>
          </Box>
          {/* <CustomTabPanel value={value} index={0}>
            {isLoading ? (
              <TableSkeleton rows={10} columns={6} />
            ) : (
              <TableWithExport
                userTableData={data?.map((d) => ({ ...d, id: d.email }))}
                columns={columns}
                pageSizeOptions={[10, 15, 20, 50, 100]}
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
              />
            )}
          </CustomTabPanel> */}
          {isLoading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : (
            <TableWithExport
              userTableData={data?.map((d) => ({ ...d, id: d.email }))}
              columns={columns}
              pageSizeOptions={[10, 15, 20, 50, 100]}
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          )}
        </Box>
      </Paper>
    </>
  );
};

export default Subscription;

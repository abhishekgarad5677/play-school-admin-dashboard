import { Box, Button, Chip, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import {
  useGetallstudentsinfoMutation,
  useGetDomesticRevenueMutation,
} from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import DatePicker from "react-datepicker";
import { TableWithExport } from "../../components/table/TableWithExport";
import { dateFilterOptions } from "../../utils/constant";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import { saveAs } from "file-saver";

const DomesticRevenue = () => {
  const [data, setData] = useState();
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
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

  const [postDataStudent, { isLoading, error, data: studentsData }] =
    useGetDomesticRevenueMutation();

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

    postDataStudent(formData);
  }, [date, startDate, endDate, paginationModel]);

  useEffect(() => {
    if (studentsData) {
      setData(studentsData?.data?.domesticRevenue);
      setRowCount(studentsData?.data?.totalUser);
    }
  }, [studentsData]);

  const columns = [
    {
      field: "name",
      headerName: "Parent Name",
      width: 180,
    },
    { field: "email", headerName: "Email", width: 300 },
    { field: "amount", headerName: "Amount (₹)", width: 150 },

    { field: "planName", headerName: "Plan Name", width: 300 },
    {
      field: "planExpiryDate",
      headerName: "Plan Expiry Date",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.planExpiryDate),
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

      try {
        const res = await postDataStudent(formData).unwrap();
        const currentBatch = res?.data?.domesticRevenue || [];

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

      saveAs(blob, "Revenue_data.csv");
    } else {
      alert("No data available to export.");
    }
    setIsExporting(false);
  };

  if (error) {
    return <div>Error: Something went wrong</div>;
  }

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
              label: "Domestic Revenue",
              href: "/dashboard/domestic-revenue",
              icon: <AccountBalanceWalletIcon fontSize="small" />,
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
    </>
  );
};

export default DomesticRevenue;

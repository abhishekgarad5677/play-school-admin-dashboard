import {
  Box,
  Button,
  Chip,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { CommonTable } from "../../components/table/Table";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import {
  useGetallstudentsinfoMutation,
  useGetUnsubscribedUsersMutation,
} from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import DatePicker from "react-datepicker";
import { TableWithExport } from "../../components/table/TableWithExport";
import { dateFilterOptions, subPlans } from "../../utils/constant";
import CustomRangeSelect from "../../utils/CustomRangeSelect";

const UnsubscribedUsers = () => {
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
    useGetUnsubscribedUsersMutation();

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
    // { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "registeredDate",
      headerName: "Google Sign-In Date",
      width: 180,
      renderCell: (params) => useFormattedDate(params?.row?.registeredDate),
    },
    // { field: "city", headerName: "City", width: 150 },
    // { field: "state", headerName: "State", width: 150 },
    // { field: "country", headerName: "Country", width: 150 },
    // { field: "languageName", headerName: "Language", width: 150 },
  ];

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
              label: "Students",
              href: "/dashboard/students",
              icon: <ChildCareIcon fontSize="small" />,
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
          {/* <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="demo-simple-select-label">Date</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={date}
              label="Age"
              onChange={handleAgeChange}
            >
              <MenuItem defaultChecked value={"today"}>
                Today
              </MenuItem>
              <MenuItem value={"7days"}>Last 7 days</MenuItem>
              <MenuItem value={"15days"}>Last 15 days</MenuItem>
              <MenuItem value={"1month"}>Last 1 month</MenuItem>
              <MenuItem value={"3months"}>Last 3 months</MenuItem>
              <MenuItem value={"6months"}>Last 6 months</MenuItem>
              <MenuItem value={"12months"}>Last 12 months</MenuItem>
              <MenuItem value={"lifetime"}>Lifetime</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl> */}

          {/* <CustomRangeSelect
            value={date}
            label={"Select Plan"}
            onChange={handleAgeChange}
            options={dateFilterOptions}
            /> */}

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
        </Box>
      </Box>
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {/* <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            label="search student"
            variant="outlined"
            size="small"
            // onChange={(e) => filterUserData(e)}
          />
        </Box> */}

        {/* students table data */}
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          // <TableWithExport
          //   userTableData={data?.map((d) => ({ ...d, id: d.id }))}
          //   columns={columns}
          //   pageSizeOptions={[10, 15, 20, 50, 100]}
          //   rowCount={rowCount}
          // />
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

export default UnsubscribedUsers;

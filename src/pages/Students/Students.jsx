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
import { useGetallstudentsinfoMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import DatePicker from "react-datepicker";
import { TableWithExport } from "../../components/table/TableWithExport";

const Students = () => {
  const [data, setData] = useState();
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleAgeChange = (event) => {
    setDate(event.target.value);
  };

  const [postDataStudent, { isLoading, error, data: studentsData }] =
    useGetallstudentsinfoMutation();

  // useEffect(() => {
  //   const formData = new FormData();
  //   formData.append("FilterType", date);
  //   postDataStudent(formData);
  // }, [date]);

  useEffect(() => {
    if (date !== "custom") {
      const formData = new FormData();
      formData.append("FilterType", date);
      postDataStudent(formData);
    } else if (date === "custom" && startDate && endDate) {
      const formattedStart = formatDateToReadableString(startDate);
      const formattedEnd = formatDateToReadableString(endDate);

      const formData = new FormData();
      formData.append("FilterType", date);
      formData.append("FromDate", formattedStart);
      formData.append("ToDate", formattedEnd);

      postDataStudent(formData);
    }
  }, [date, startDate, endDate]);

  useEffect(() => {
    if (studentsData) {
      setData(studentsData?.data);
    }
  }, [studentsData]);

  const columns = [
    {
      field: "parentName",
      headerName: "Parent Name",
      width: 180,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* <UserAvatar name={params?.row?.parentName} /> */}
          <span>{params?.row?.parentName}</span>
        </div>
      ),
    },
    { field: "childsName", headerName: "Child's Name", width: 170 },
    {
      field: "registeredDate",
      headerName: "Registered Date",
      width: 180,
      renderCell: (params) => useFormattedDate(params?.row?.registeredDate),
    },
    { field: "planName", headerName: "Plan Name", width: 200 },
    {
      field: "lastActiveDate",
      headerName: "Last Active Date",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.lastActiveDate),
    },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    // { field: "email", headerName: "Email", width: 230 },
    {
      field: "planExpiryDate",
      headerName: "Plan Expiry Date",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.planExpiryDate),
    },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 180,
      renderCell: (params) => useFormattedDate(params?.row?.dateOfBirth),
    },
    { field: "city", headerName: "City", width: 150 },
    { field: "state", headerName: "State", width: 150 },
    { field: "country", headerName: "Country", width: 150 },
    { field: "studentId", headerName: "Student ID", width: 100 },
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
    { field: "languageName", headerName: "Language", width: 150 },
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
          <FormControl sx={{ minWidth: 200 }} size="small">
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
          </FormControl>

          {date === "custom" && (
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
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
          <TableWithExport
            userTableData={data?.map((d) => ({ ...d, id: d.studentId }))}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
          />
        )}
      </Paper>
    </>
  );
};

export default Students;

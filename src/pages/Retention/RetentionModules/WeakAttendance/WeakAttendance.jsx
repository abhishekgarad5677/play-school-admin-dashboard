import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import DatePicker from "react-datepicker";
import AttendanceData from "../../../Dashboard/AttendanceData";
import WeakAttendanceTable from "./WeakAttendanceTable";

const WeakAttendance = () => {
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleAgeChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          alignItems: "end",
          justifyContent: "end",
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
      {/* <AttendanceData
        date={date}
        startDate={startDate}
        endDate={endDate}
        children={<WeakAttendanceTable />}
      /> */}
      <AttendanceData date={date} startDate={startDate} endDate={endDate}>
        {({ attendanceData, isLoading }) => (
          <WeakAttendanceTable data={attendanceData} isLoading={isLoading} />
        )}
      </AttendanceData>
    </>
  );
};

export default WeakAttendance;

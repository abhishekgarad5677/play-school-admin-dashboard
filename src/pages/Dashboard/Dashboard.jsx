import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import DashboardSummary from "./DashboardSummary";
import GameSummary from "./GameSummary";
import DashboardAudioLangauge from "./DashboardAudioLangauge";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AttendanceData from "./AttendanceData";

const Dashboard = () => {
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "Dashboard",
              href: "/dashboard",
              icon: <DashboardIcon fontSize="small" />,
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
              maxDate={new Date()}
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
      </Box>

      <Box sx={{ minHeight: "85vh", width: "100%" }}>
        <DashboardSummary date={date} startDate={startDate} endDate={endDate} />
        <GameSummary />
        <AttendanceData
          date={date}
          startDate={startDate}
          endDate={endDate}
          children={<div></div>}
        />
        {/* <DashboardAudioLangauge /> */}
      </Box>
    </>
  );
};

export default Dashboard;

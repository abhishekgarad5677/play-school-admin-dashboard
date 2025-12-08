import React, { useEffect, useId, useState } from "react";
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
import LocationData from "./LocationData";
import AgeData from "./AgeData";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import {
  dateFilterOptions,
  appFilterOptions,
  subPlans,
  userTypeOptions,
} from "../../utils/constant";
import AttendanceSummary from "./AttendanceSummary";
import ActiveUserSummary from "./ActiveUserSummary";

const Dashboard = () => {
  const [date, setDate] = useState("today");
  const [platform, setPlatform] = useState(4);
  const [plan, setPlan] = useState(0);
  const [userType, setUserType] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

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

  // const handlePlatformChange = (event) => {
  //   setPlatform(event.target.value);
  // };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
  };

  const handleUserType = (event) => {
    setUserType(event.target.value);
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
          {/* subscription plan select dropdown */}
          <CustomRangeSelect
            value={plan}
            label={"Select Plan"}
            onChange={handlePlanChange}
            options={subPlans}
          />
          <CustomRangeSelect
            value={userType}
            label={"User Type"}
            onChange={handleUserType}
            options={userTypeOptions}
          />
          {/* app select dropdown */}
          {/* <CustomRangeSelect
            value={platform}
            label={"App"}
            onChange={handlePlatformChange}
            options={appFilterOptions}
          /> */}
          {/* date select dropdown */}
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

      <Box sx={{ minHeight: "85vh", width: "100%" }}>
        <DashboardSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
        />
        <ActiveUserSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
        />
        <LocationData
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
          userType={userType}
        />
        <AgeData
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
        />
        {/* <GameSummary /> */}
        <AttendanceSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
        />
        {/* <AttendanceData
          date={date}
          startDate={startDate}
          endDate={endDate}
          children={<div></div>}
        /> */}
        {/* <DashboardAudioLangauge /> */}
      </Box>
    </>
  );
};

export default Dashboard;

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
  regionOptions,
} from "../../utils/constant";
import AttendanceSummary from "./AttendanceSummary";
import ActiveUserSummary from "./ActiveUserSummary";
import ActiveUserMetricsSummary from "./ActiveUserMetricsSummary";

const Dashboard = () => {
  // const [date, setDate] = useState("today");
  // const [platform, setPlatform] = useState(0);
  // const [region, setRegion] = useState(0);
  // const [plan, setPlan] = useState(0);
  // const [userType, setUserType] = useState(1);
  // const [dateRange, setDateRange] = useState([null, null]);
  // const [startDate, endDate] = dateRange;

  const [date, setDate] = useState(
    () => sessionStorage.getItem("selectedDate") || "today",
  );
  const [platform, setPlatform] = useState(
    () => Number(sessionStorage.getItem("selectedPlatform")) || 0,
  );
  const [region, setRegion] = useState(
    () => Number(sessionStorage.getItem("selectedRegion")) || 0,
  );
  const [plan, setPlan] = useState(0);
  const [userType, setUserType] = useState(1);
  const [dateRange, setDateRange] = useState(() => {
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");

    // ✅ Guard against "null" strings or missing values
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
      // ✅ Only store dates if they are actually selected
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
          {/* <CustomRangeSelect
            value={plan}
            label={"Select Plan"}
            onChange={handlePlanChange}
            options={subPlans}
          /> */}
          {/* <CustomRangeSelect
            value={userType}
            label={"User Type"}
            onChange={handleUserType}
            options={userTypeOptions}
          /> */}
          {/* app select dropdown */}
          {/* <CustomRangeSelect
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
                // ✅ Only store if values are not null
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
        </Box>
      </Box>

      <Box sx={{ minHeight: "85vh", width: "100%" }}>
        <DashboardSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
          region={region}
        />
        {/* <ActiveUserMetricsSummary /> */}
        <ActiveUserMetricsSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
          region={region}
        />
        <ActiveUserSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
          region={region}
        />
        <LocationData
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
          userType={userType}
          region={region}
        />
        <AgeData
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
          region={region}
        />
        {/* <GameSummary /> */}
        <AttendanceSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
          platform={platform}
          region={region}
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

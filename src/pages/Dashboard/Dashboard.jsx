import React, { useId, useState } from "react";
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
} from "../../utils/constant";
import AttendanceSummary from "./AttendanceSummary";

const Dashboard = () => {
  const [date, setDate] = useState("today");
  const [platform, setPlatform] = useState(1);
  const [plan, setPlan] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handlePlatformChange = (event) => {
    setPlatform(event.target.value);
  };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
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
        />
        <LocationData
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
        />
        <AgeData
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
        />
        <GameSummary />
        <AttendanceSummary
          date={date}
          startDate={startDate}
          endDate={endDate}
          plan={plan}
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

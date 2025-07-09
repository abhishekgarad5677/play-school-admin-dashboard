import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import { Box, Paper, Skeleton, Tab, Tabs, TextField } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { dateFilterOptions } from "../../utils/constant";
import PropTypes from "prop-types";
import {
  useGetABTestingFunnelMutation,
  useGetAllFunnelDataMutation,
  useGetFunnelGoogleSignInDataMutation,
  useGetFunnelSmsOtpFunnelMutation,
} from "../../redux/slices/apiSlice";
import ATestingFunnel from "./ATestingFunnel";
import BTestingFunnel from "./BTestingFunnel";
import AllFunnelData from "./AllFunnelData";
import { formatDateToReadableString } from "../../utils/Hooks";
import GoogleSignInDataFunnel from "./GoogleSignInData";
import SmsOtpFunnel from "./SmsOtpFunnel";

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

const Funnel = () => {
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [value, setValue] = useState(0);

  const [postGetABTestingFunnel, { isLoading, error, data: funnelData }] =
    useGetABTestingFunnelMutation();

  const [
    postGetAllFunnelData,
    {
      isLoading: allFunnelDataLoading,
      error: allFunnelDataError,
      data: allFunnelData,
    },
  ] = useGetAllFunnelDataMutation();

  const [
    postGoogleSignInData,
    {
      isLoading: GoogleSignInDataLoading,
      error: GoogleSignInDataError,
      data: GoogleSignInData,
    },
  ] = useGetFunnelGoogleSignInDataMutation();

  const [
    postSmsOtpData,
    { isLoading: smsOtpLoading, error: smsOtpError, data: smsOtpData },
  ] = useGetFunnelSmsOtpFunnelMutation();

  console.log(smsOtpData);

  useEffect(() => {
    const formData = new FormData();

    if (date !== "custom") {
      formData.append("FilterType", date);
    } else if (date === "custom" && startDate && endDate) {
      formData.append("FilterType", date);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }
    postGetAllFunnelData(formData);
    postGetABTestingFunnel(formData);
    postGoogleSignInData(formData);
    postSmsOtpData(formData);
  }, [date, startDate, endDate]);

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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const minSelectableDate =
    value === 1 || value === 2 ? new Date("06-20-2025") : null;

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
              label: "Top Cities",
              href: "/dashboard/top-cities",
              icon: <LocationCityIcon fontSize="small" />,
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
              <Tab label="Google Sign in" {...a11yProps(0)} />
              <Tab label="WhatsApp otp" {...a11yProps(1)} />
              <Tab label="Direct subscription" {...a11yProps(2)} />
              <Tab label="Free trial" {...a11yProps(3)} />
              <Tab label="sms otp" {...a11yProps(4)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {GoogleSignInDataLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <GoogleSignInDataFunnel
                funnelData={GoogleSignInData?.data?.flowGFunnel}
              />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {allFunnelDataLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <AllFunnelData funnelData={allFunnelData?.data} />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {isLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <ATestingFunnel funnelData={funnelData?.data?.flowAFunnel} />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            {isLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <BTestingFunnel funnelData={funnelData?.data?.flowBFunnel} />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            {smsOtpLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <SmsOtpFunnel funnelData={smsOtpData?.data} />
            )}
          </CustomTabPanel>
        </Box>
      </Paper>
    </>
  );
};

export default Funnel;

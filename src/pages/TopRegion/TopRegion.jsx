import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Tabs,
  Tab,
  Chip,
  Skeleton,
} from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useGetTopCitiesMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { CommonTable } from "../../components/table/Table";
import {
  formatDateToReadableString,
  formatPlayTime,
  useFormattedDate,
} from "../../utils/Hooks";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import {
  dateFilterOptions,
  subPlans,
  userTypeOptions,
} from "../../utils/constant";
import DatePicker from "react-datepicker";
import ReactApexChart from "react-apexcharts";
import PropTypes from "prop-types";
import TopCities from "./TopCities";
import TopStates from "./TopStates";

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

const TopRegion = () => {
  const [date, setDate] = useState("today");
  const [userType, setUserType] = useState(1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [plan, setPlan] = useState(1);

  const [postGetTopCities, { isLoading, error, data: topCitiesData }] =
    useGetTopCitiesMutation();

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  useEffect(() => {
    const formData = new FormData();

    if (date !== "custom") {
      formData.append("FilterType", date);
    } else if (date === "custom" && startDate && endDate) {
      formData.append("FilterType", date);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }
    formData.append("UsersType", userType);
    formData.append("SubPlan", plan);
    postGetTopCities(formData);
  }, [date, startDate, endDate, plan, userType]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
  };

  const handleUserType = (event) => {
    setUserType(event.target.value);
  };

  if (error) {
    return (
      <Box sx={{ padding: 3 }}>
        <Chip label="Error fetching data" color="error" />
      </Box>
    );
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
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Top 10 Cities" {...a11yProps(0)} />
              <Tab label="Top 10 States" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {isLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <TopCities topCitiesData={topCitiesData} />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {isLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <TopStates topCitiesData={topCitiesData} />
            )}
          </CustomTabPanel>
        </Box>
      </Paper>
    </>
  );
};

export default TopRegion;

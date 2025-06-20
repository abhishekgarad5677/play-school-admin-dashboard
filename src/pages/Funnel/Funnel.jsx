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
} from "../../redux/slices/apiSlice";
import ATestingFunnel from "./ATestingFunnel";
import BTestingFunnel from "./BTestingFunnel";
import AllFunnelData from "./AllFunnelData";
import { formatDateToReadableString } from "../../utils/Hooks";

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

  console.log(allFunnelData);

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
  }, [date, startDate, endDate]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

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
              minDate={minSelectableDate}
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
              <Tab label="Overall" {...a11yProps(0)} />
              <Tab label="A Testing" {...a11yProps(1)} />
              <Tab label="B Testing" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            {allFunnelDataLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <AllFunnelData funnelData={allFunnelData?.data} />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {isLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <ATestingFunnel funnelData={funnelData?.data?.flowAFunnel} />
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {isLoading ? (
              <Skeleton variant="rounded" width={"100%"} height={400} />
            ) : (
              <BTestingFunnel funnelData={funnelData?.data?.flowBFunnel} />
            )}
          </CustomTabPanel>
        </Box>
      </Paper>
    </>
  );
};

export default Funnel;

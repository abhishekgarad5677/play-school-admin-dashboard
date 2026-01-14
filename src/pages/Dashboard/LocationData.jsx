import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Card,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid2";
import ApexCharts from "react-apexcharts";
import { useGetCountryStateCityMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";

const LocationData = ({
  date,
  startDate,
  endDate,
  plan,
  platform,
  userType,
}) => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const [getCountryStateCity, { isLoading, error, data }] =
    useGetCountryStateCityMutation();

  const [countryData, setCountryData] = useState({
    country: [],
    state: [],
    city: [],
  });

  // Build a stable "request key" so we can re-fetch when inputs change
  const requestKey = useMemo(() => {
    // IMPORTANT: keep it deterministic and based on exactly what affects the request.
    // If platform needs to affect API later, add it here + in formData.
    const from =
      date === "custom" && startDate
        ? formatDateToReadableString(startDate)
        : "";
    const to =
      date === "custom" && endDate ? formatDateToReadableString(endDate) : "";

    return JSON.stringify({
      date,
      from,
      to,
      plan,
      // platform, // uncomment if you send platform in API
      userType,
    });
  }, [date, startDate, endDate, plan, userType]);

  // Prevent duplicate calls for same params (optional but nice)
  const lastFetchedKeyRef = useRef("");

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("SubPlan", plan);
    formData.append("UsersType", userType);

    if (date !== "custom") {
      formData.append("FilterType", date);
      // if (platform !== 4) formData.append("platform", platform);
    } else if (startDate && endDate) {
      formData.append("FilterType", "custom");
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    } else {
      // Custom selected but missing dates -> don't call
      return null;
    }

    return formData;
  };

  useEffect(() => {
    // Gate API call: only after accordion has been opened at least once
    if (!hasOpenedOnce) return;

    // If accordion is currently closed, skip fetching on prop change.
    // (If you want it to fetch in background even when closed, remove this.)
    if (!expanded) return;

    // Avoid re-fetching if nothing changed
    if (lastFetchedKeyRef.current === requestKey) return;

    const formData = buildFormData();
    if (!formData) return;

    lastFetchedKeyRef.current = requestKey;
    getCountryStateCity(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpenedOnce, expanded, requestKey, getCountryStateCity]);

  useEffect(() => {
    if (data && data.success === true) {
      console.log("===v data called");
      setCountryData({
        country: data.data.countries ?? [],
        state: data.data.states ?? [],
        city: data.data.cities ?? [],
      });
    }
  }, [data]);

  const getChartConfig = (labels, values) => ({
    options: {
      chart: {
        type: "bar",
        height: 200,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
          barHeight: "30%",
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: labels,
        title: {
          text: "No. of users",
          style: {
            fontSize: "12px",
            fontWeight: 600,
            color: "#333",
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${val} users`;
          },
        },
      },
    },
    series: [{ name: "", data: values }],
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <Grid container mb={2} spacing={2}>
          <Grid size={4}>
            <Skeleton variant="rounded" width={"100%"} height={350} />
          </Grid>
          <Grid size={4}>
            <Skeleton variant="rounded" width={"100%"} height={350} />
          </Grid>
          <Grid size={4}>
            <Skeleton variant="rounded" width={"100%"} height={350} />
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Typography variant="body2" color="error">
          Error loading location data.
        </Typography>
      );
    }

    return (
      <Box mb={2}>
        <Grid container spacing={3}>
          <Grid size={4}>
            <Card elevation={1} sx={{ p: 1, borderRadius: 3 }}>
              <Typography ml={2} mt={1} fontWeight={600} variant="h6">
                Top Countries
              </Typography>
              <ApexCharts
                {...getChartConfig(
                  countryData.country.map((c) => c.country),
                  countryData.country.map((c) => c.count)
                )}
                type="bar"
                height={350}
              />
            </Card>
          </Grid>

          <Grid
            size={4}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard/top-cities")}
          >
            <Card elevation={1} sx={{ p: 1, borderRadius: 3 }}>
              <Typography ml={2} mt={1} fontWeight={600} variant="h6">
                Top States
              </Typography>
              <ApexCharts
                {...getChartConfig(
                  countryData.state.map((s) => s.state),
                  countryData.state.map((s) => s.count)
                )}
                type="bar"
                height={350}
              />
            </Card>
          </Grid>

          <Grid
            size={4}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard/top-cities")}
          >
            <Card elevation={1} sx={{ p: 1, borderRadius: 3 }}>
              <Typography ml={2} mt={1} fontWeight={600} variant="h6">
                Top Cities
              </Typography>
              <ApexCharts
                {...getChartConfig(
                  countryData.city.map((c) => c.city),
                  countryData.city.map((c) => c.count)
                )}
                type="bar"
                height={350}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box mb={3}>
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => {
          setExpanded(isExpanded);
          if (isExpanded) setHasOpenedOnce(true);
        }}
        disableGutters
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={700}>Location Analytics</Typography>
        </AccordionSummary>

        <AccordionDetails>{renderContent()}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default LocationData;

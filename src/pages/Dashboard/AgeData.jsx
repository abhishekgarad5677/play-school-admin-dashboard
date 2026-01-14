import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid2";
import { useEffect, useMemo, useRef, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useGetAgeGroupCountMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";

const AgeData = ({ date, startDate, endDate, plan, platform }) => {
  const [expanded, setExpanded] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const [getAgeCount, { isLoading, error, data }] =
    useGetAgeGroupCountMutation();

  const [ageCount, setAgeCount] = useState(null);
  const [genderCount, setGenderCount] = useState(null);

  // stable key so we re-fetch when props change (while accordion is open)
  const requestKey = useMemo(() => {
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
      plan, // currently not sent, but keeping so change triggers refetch if you later enable it
      platform,
    });
  }, [date, startDate, endDate, plan, platform]);

  const lastFetchedKeyRef = useRef("");

  const buildFormData = () => {
    const formData = new FormData();

    if (date !== "custom") {
      formData.append("FilterType", date);
      if (platform !== 4) formData.append("platform", platform);
      // formData.append("SubPlan", plan);
      return formData;
    }

    // custom
    if (startDate && endDate) {
      formData.append("FilterType", "custom");
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
      if (platform !== 4) formData.append("platform", platform); // optional; remove if backend doesn't accept
      // formData.append("SubPlan", plan);
      return formData;
    }

    return null; // don't call without dates
  };

  useEffect(() => {
    // Gate API call: only after accordion is opened at least once + currently expanded
    if (!hasOpenedOnce) return;
    if (!expanded) return;

    // Avoid duplicate fetch for same params
    if (lastFetchedKeyRef.current === requestKey) return;

    const formData = buildFormData();
    if (!formData) return;

    lastFetchedKeyRef.current = requestKey;
    getAgeCount(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpenedOnce, expanded, requestKey, getAgeCount]);

  useEffect(() => {
    if (data && data.success === true) {
      setAgeCount(data);
      setGenderCount(data?.data?.genderCount || null);
    }
  }, [data]);

  const chartOptions = {
    chart: { type: "donut" },
    labels: ["< 2 years", "2 - 4 years", "4 - 6 years", "> 6 years"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: true },
            value: { show: true },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val} students` },
    },
  };

  const chartSeries = ageCount
    ? [
        ageCount.data?.ageCount?.lessThan2 || 0,
        ageCount.data?.ageCount?.age2To4 || 0,
        ageCount.data?.ageCount?.age4To6 || 0,
        ageCount.data?.ageCount?.greaterThan6 || 0,
      ]
    : [0, 0, 0, 0];

  const totalCount = chartSeries.reduce((sum, val) => sum + val, 0);

  const genderSeries = genderCount
    ? [genderCount.boy || 0, genderCount.girl || 0]
    : [0, 0];

  const genderOptions = {
    chart: { type: "donut" },
    labels: ["Boys", "Girls"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: true },
            value: {
              show: true,
              formatter: (val) =>
                `${val} ${Number(val) === 1 ? "student" : "students"}`,
            },
          },
        },
      },
    },
    tooltip: {
      y: { formatter: (val) => `${val} students` },
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Grid container spacing={2}>
          <Grid size={6}>
            <Skeleton variant="rounded" width={"100%"} height={350} />
          </Grid>
          <Grid size={6}>
            <Skeleton variant="rounded" width={"100%"} height={350} />
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Typography variant="body2" color="error">
          Error loading age data.
        </Typography>
      );
    }

    return (
      <Grid mb={2} container spacing={3}>
        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 4 }}>
            <Typography mb={2} fontWeight={700} variant="h6">
              Age Group Distribution
            </Typography>
            {totalCount > 0 ? (
              <ApexCharts
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={300}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No student data available for the selected period.
              </Typography>
            )}
          </Card>
        </Grid>

        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 4 }}>
            <Typography mb={2} fontWeight={700} variant="h6">
              Gender Distribution
            </Typography>
            {genderSeries.reduce((a, b) => a + b, 0) > 0 ? (
              <ApexCharts
                options={genderOptions}
                series={genderSeries}
                type="donut"
                height={300}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No gender data available for the selected period.
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>
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
          <Typography fontWeight={700}>Age & Gender Analytics</Typography>
        </AccordionSummary>

        <AccordionDetails>{renderContent()}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AgeData;

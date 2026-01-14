import { useEffect, useMemo, useRef, useState } from "react";
import { useGetAttendanceSummaryMutation } from "../../redux/slices/apiSlice";
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
import ReactApexChart from "react-apexcharts";
import { formatDateToReadableString, formatDayMonth } from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";

const AttendanceSummary = ({ date, startDate, endDate, plan, platform }) => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const [postAttendanceDataSummary, { isLoading, error, data }] =
    useGetAttendanceSummaryMutation();

  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  // Stable key to refetch when inputs change (while accordion open)
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
      plan,
      platform,
    });
  }, [date, startDate, endDate, plan, platform]);

  const lastFetchedKeyRef = useRef("");

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("FilterType", date);
    formData.append("SubPlan", plan);

    if (platform !== 4) {
      formData.append("platform", platform);
    }

    if (date === "custom") {
      if (!startDate || !endDate) return null; // don't call without dates
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }

    return formData;
  };

  useEffect(() => {
    // Call API only after accordion opened once + currently expanded
    if (!hasOpenedOnce) return;
    if (!expanded) return;

    // Prevent duplicate call for same params
    if (lastFetchedKeyRef.current === requestKey) return;

    const formData = buildFormData();
    if (!formData) return;

    lastFetchedKeyRef.current = requestKey;
    postAttendanceDataSummary(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpenedOnce, expanded, requestKey, postAttendanceDataSummary]);

  useEffect(() => {
    if (data && data.status === true && Array.isArray(data.data)) {
      const isMonthlyView = !!data.data[0]?.month;

      const categories = data.data.map((entry) =>
        isMonthlyView ? entry.month : formatDayMonth(entry.date)
      );

      const attendanceSeries = data.data.map(
        (entry) => entry.attendancePercentage
      );
      const timeSpentSeries = data.data.map((entry) => entry.averageTimeSpent);

      setChartData({
        categories,
        series: [
          { name: "Attendance %", data: attendanceSeries },
          { name: "Avg Time Spent (min)", data: timeSpentSeries },
        ],
      });
    } else {
      setChartData({ categories: [], series: [] });
    }
  }, [data]);

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    legend: { position: "top" },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: { text: "Date / Month", style: { fontWeight: 600 } },
      labels: { rotate: -45, style: { fontSize: "12px" } },
    },
    yaxis: {
      title: { text: "Values", style: { fontWeight: 600 } },
    },
    tooltip: {
      y: [
        { formatter: (val) => `${Number(val).toFixed(2)}%` },
        { formatter: (val) => `${Number(val).toFixed(2)} mins` },
      ],
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Grid container spacing={2}>
          <Grid size={12}>
            <Skeleton variant="rounded" width={"100%"} height={400} />
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Typography variant="body2" color="error">
          Error loading attendance summary data.
        </Typography>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid
          size={12}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard/retention")}
        >
          <Card elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography mb={2} fontWeight={700} variant="h6">
              Attendance Summary Chart
            </Typography>

            {chartData.categories.length > 0 ? (
              <ReactApexChart
                options={chartOptions}
                series={chartData.series}
                type="line"
                height={350}
              />
            ) : (
              <Typography>No attendance data found.</Typography>
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
          <Typography fontWeight={700}>Attendance Summary</Typography>
        </AccordionSummary>

        <AccordionDetails>{renderContent()}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AttendanceSummary;

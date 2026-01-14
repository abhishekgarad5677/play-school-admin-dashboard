import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid2";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useGetActiveUserSummaryMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString, formatPlayTime } from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

const ActiveUserSummary = ({ date, startDate, endDate, plan, platform }) => {
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const [cards, setCards] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);
  const [pieLabels, setPieLabels] = useState([]);

  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetActiveUserSummaryMutation();

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
      plan,
      platform,
    });
  }, [date, startDate, endDate, plan, platform]);

  const lastFetchedKeyRef = useRef("");

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("FilterType", date);

    if (date === "custom") {
      if (!startDate || !endDate) return null; // don't call without dates
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
      return formData;
    }

    formData.append("SubPlan", plan);
    if (platform !== 4) formData.append("platform", platform);

    return formData;
  };

  useEffect(() => {
    // Call API only after accordion opened once + currently expanded
    if (!hasOpenedOnce) return;
    if (!expanded) return;

    // Prevent duplicate calls for same params
    if (lastFetchedKeyRef.current === requestKey) return;

    const formData = buildFormData();
    if (!formData) return;

    lastFetchedKeyRef.current = requestKey;
    postDashboardData(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOpenedOnce, expanded, requestKey, postDashboardData]);

  useEffect(() => {
    if (DashboardData?.status) {
      setCards([
        {
          title: "Total Active Users",
          value: DashboardData?.data?.totalActiveUser ?? 0,
          icon: <GroupIcon sx={{ fontSize: 40, color: "#E91E63" }} />,
          color: "#FFE4EC",
          valueColor: "#E91E63",
        },
        {
          title: "Avg. Time Spent Per User",
          value: formatPlayTime(DashboardData?.data?.avgTimeSpentPerUser),
          icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#ff9900" }} />,
          color: "#fff6e6",
          valueColor: "#ff9900",
        },
      ]);

      setPieLabels(["0-2 years", "2-4 years", "4-6 years", "6+ years"]);
      setPieSeries([
        DashboardData?.data?.activeAgeGroup?.LessThan2 || 0,
        DashboardData?.data?.activeAgeGroup?.Age2To4 || 0,
        DashboardData?.data?.activeAgeGroup?.Age4To6 || 0,
        DashboardData?.data?.activeAgeGroup?.GreaterThan6 || 0,
      ]);
    } else {
      setCards([]);
      setPieLabels([]);
      setPieSeries([]);
    }
  }, [DashboardData]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Grid container spacing={2}>
          <Grid size={6}>
            <Skeleton variant="rounded" width={"100%"} height={150} />
            <Skeleton
              variant="rounded"
              width={"100%"}
              height={150}
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid size={6}>
            <Skeleton variant="rounded" width={"100%"} height={320} />
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Typography variant="body2" color="error">
          Error loading dashboard summary data.
        </Typography>
      );
    }

    return (
      <Grid container spacing={2} mb={1}>
        {/* Left Side: Two Vertical Cards */}
        <Grid size={6} container direction="column" spacing={2}>
          {cards.map((card, index) => (
            <Grid key={index}>
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: card.color,
                  p: 2,
                  textAlign: "center",
                  borderRadius: 2,
                }}
              >
                <Box mb={1}>{card.icon}</Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {card.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: card.valueColor, fontWeight: "bold" }}
                >
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Right Side: Pie Chart */}
        <Grid size={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography mb={2} fontWeight={700} variant="h6">
              Active Age Group Breakup
            </Typography>

            {pieSeries.reduce((a, b) => a + b, 0) > 0 ? (
              <ReactApexChart
                options={{
                  chart: { type: "pie" },
                  labels: pieLabels,
                  colors: ["#FF6384", "#36A2EB", "#FFCE56", "#9CCC65"],
                  legend: { position: "bottom" },
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
                              `${val} ${
                                Number(val) === 1 ? "student" : "students"
                              }`,
                          },
                        },
                      },
                    },
                  },
                  tooltip: {
                    y: { formatter: (val) => `${val} students` },
                  },
                }}
                series={pieSeries}
                type="donut"
                height={260}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No active age group data found.
              </Typography>
            )}
          </Paper>
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
          <Typography fontWeight={700}>Active Users Summary</Typography>
        </AccordionSummary>

        <AccordionDetails>{renderContent()}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ActiveUserSummary;

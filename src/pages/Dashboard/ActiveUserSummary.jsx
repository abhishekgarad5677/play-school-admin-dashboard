import { useEffect, useState } from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useGetActiveUserSummaryMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString, formatPlayTime } from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

const ActiveUserSummary = ({ date, startDate, endDate, plan, platform }) => {
  const [data, setData] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);
  const [pieLabels,  setPieLabels] = useState([]);

  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetActiveUserSummaryMutation();

  useEffect(() => {
    const formData = new FormData();
    formData.append("FilterType", date);

    if (date === "custom" && startDate && endDate) {
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    } else {
      formData.append("SubPlan", plan);
      if (platform !== 4) {
        formData.append("platform", platform);
      }
    }
    postDashboardData(formData);
  }, [date, startDate, endDate, plan, platform]);

  useEffect(() => {
    if (DashboardData?.status) {
      setData([
        {
          title: "Total Active Users",
          value: DashboardData?.data?.totalActiveUser,
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
    }
  }, [DashboardData]);

  const navigate = useNavigate();

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
    <Grid container spacing={2} mb={6}>
      {/* Left Side: Two Vertical Cards */}
      <Grid size={6} container direction="column" spacing={2}>
        {data.map((card, index) => (
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
                      name: {
                        show: true,
                      },
                      value: {
                        show: true,
                        formatter: (val) =>
                          `${val} ${val === 1 ? "student" : "students"}`,
                      },
                    },
                  },
                },
              },
              tooltip: {
                y: {
                  formatter: (val) => `${val} students`,
                },
              },
            }}
            series={pieSeries}
            type="donut"
            height={260}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ActiveUserSummary;

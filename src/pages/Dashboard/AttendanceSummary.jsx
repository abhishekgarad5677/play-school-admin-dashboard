import { useEffect, useState } from "react";
import { useGetAttendanceSummaryMutation } from "../../redux/slices/apiSlice";
import { Box, Card, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ReactApexChart from "react-apexcharts";
import { formatDateToReadableString, formatDayMonth } from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";

const AttendanceSummary = ({ date, startDate, endDate, plan, platform }) => {
  const [postAttendanceDataSummary, { isLoading, error, data }] =
    useGetAttendanceSummaryMutation();

  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });

  useEffect(() => {
    const formData = new FormData();
    formData.append("FilterType", date);
    formData.append("SubPlan", plan);
    if (platform !== 4) {
      formData.append("platform", platform);
    }
    if (date === "custom" && startDate && endDate) {
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }

    postAttendanceDataSummary(formData);
  }, [date, startDate, endDate, plan, platform]);

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
          {
            name: "Attendance %",
            data: attendanceSeries,
          },
          {
            name: "Avg Time Spent (min)",
            data: timeSpentSeries,
          },
        ],
      });
    }
  }, [data]);

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    // title: {
    //   text: "Attendance Summary",
    //   align: "left",
    // },
    legend: {
      position: "top",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: chartData.categories,
      title: {
        text: "Date / Month",
        style: {
          fontWeight: 600,
        },
      },
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        text: "Values",
        style: {
          fontWeight: 600,
        },
      },
    },

    tooltip: {
      y: [
        {
          formatter: (val) => `${val.toFixed(2)}%`,
        },
        {
          formatter: (val) => `${val.toFixed(2)} mins`,
        },
      ],
    },
  };

  const navigate = useNavigate();

  if (isLoading)
    return (
      <Grid container mb={4} spacing={2}>
        <Grid size={12}>
          <Skeleton variant="rounded" width={"100%"} height={400} />
        </Grid>
      </Grid>
    );
  if (error)
    return (
      <Typography variant="body2" color="error" mb={4}>
        Error loading attendance summary data.
      </Typography>
    );

  return (
    <Box mb={4}>
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
    </Box>
  );
};

export default AttendanceSummary;

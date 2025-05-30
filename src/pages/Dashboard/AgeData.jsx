import { Avatar, Box, Card, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useGetAgeGroupCountMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";
// import { formatDateToReadableString } from "../../utils/Hooks"; // Make sure this exists

const AgeData = ({ date, startDate, endDate, plan }) => {
  const [getAgeCount, { isLoading, error, data }] =
    useGetAgeGroupCountMutation();
  const [ageCount, setAgeCount] = useState(null);
  const [genderCount, setGenderCount] = useState(null);

  useEffect(() => {
    if (date !== "custom") {
      const formData = new FormData();
      formData.append("FilterType", date);
      // formData.append("SubPlan", plan);
      getAgeCount(formData);
    } else if (date === "custom" && startDate && endDate) {
      const formattedStart = formatDateToReadableString(startDate);
      const formattedEnd = formatDateToReadableString(endDate);

      const formData = new FormData();
      formData.append("FilterType", date);
      formData.append("FromDate", formattedStart);
      formData.append("ToDate", formattedEnd);

      getAgeCount(formData);
    }
  }, [date, startDate, endDate, plan]);

  useEffect(() => {
    if (data && data.success === true) {
      console.log("Age Data:", data?.data);
      setAgeCount(data);
      setGenderCount(data?.data?.genderCount || null);
    }
  }, [data]);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: ["< 2 years", "2 - 4 years", "4 - 6 years", "> 6 years"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
    },
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
    chart: {
      type: "donut",
    },
    labels: ["Boys", "Girls"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
    },
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
  };

  if (isLoading) return <>Loading age data...</>;
  if (error) return <>Error loading age data.</>;

  return (
    <Box mb={4}>
      <Grid container spacing={3}>
        <Grid size={6}>
          <Card elevation={3} sx={{ p: 3, borderRadius: 4 }}>
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
          <Card elevation={3} sx={{ p: 3, borderRadius: 4 }}>
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
    </Box>
  );
};

export default AgeData;

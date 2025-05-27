import { Avatar, Box, Card, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useGetAgeGroupCountMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";
// import { formatDateToReadableString } from "../../utils/Hooks"; // Make sure this exists

const AgeData = ({ date, startDate, endDate }) => {
  const [getAgeCount, { isLoading, error, data }] =
    useGetAgeGroupCountMutation();
  const [ageCount, setAgeCount] = useState(null);

  useEffect(() => {
    if (date !== "custom") {
      const formData = new FormData();
      formData.append("FilterType", date);
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
  }, [date, startDate, endDate]);

  useEffect(() => {
    if (data && data.success === true) {
      console.log("Age Data:", data.data);
      setAgeCount(data);
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
        ageCount.data?.lessThan2 || 0,
        ageCount.data?.age2To4 || 0,
        ageCount.data?.age4To6 || 0,
        ageCount.data?.greaterThan6 || 0,
      ]
    : [0, 0, 0, 0];

  const totalCount = chartSeries.reduce((sum, val) => sum + val, 0);

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
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={0} fontWeight={600} variant="h6">
              Top 5 States
            </Typography>
            {/* Add your state data rendering here if needed */}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgeData;

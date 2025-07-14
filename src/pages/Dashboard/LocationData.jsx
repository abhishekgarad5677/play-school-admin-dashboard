import { useEffect, useState } from "react";
import { Box, Card, Skeleton, Typography } from "@mui/material";
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
  const [getCountryStateCity, { isLoading, error, data }] =
    useGetCountryStateCityMutation();

  const [countryData, setCountryData] = useState({
    country: [],
    state: [],
    city: [],
  });

  useEffect(() => {
    const formData = new FormData();
    let shouldFetch = true;
    formData.append("SubPlan", plan);
    formData.append("UsersType", userType);

    if (date !== "custom") {
      formData.append("FilterType", date);
      // if (platform !== 4) {
      //   formData.append("platform", platform);
      // }
    } else if (startDate && endDate) {
      formData.append("FilterType", "custom");
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }

    if (shouldFetch) {
      getCountryStateCity(formData);
    }
  }, [date, startDate, endDate, plan, platform, userType]);

  useEffect(() => {
    if (data && data.success === true) {
      console.log("Location Data:", data.data);
      setCountryData({
        country: data.data.countries,
        state: data.data.states,
        city: data.data.cities,
      });
    }
  }, [data]);

  const navigate = useNavigate();

  // Inside your component
  const getChartConfig = (labels, values) => ({
    options: {
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
          barHeight: "30%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: labels,
        title: {
          text: "No. of users", // 👈 Label for X-axis
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
            return `${val} users`; // 👈 Tooltip on hover will show "30 users"
          },
        },
      },
    },
    series: [
      {
        name: "", // 👈 This removes the "series-1:" prefix from tooltip
        data: values,
      },
    ],
  });

  if (isLoading)
    return (
      <Grid container mb={4} spacing={2}>
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
  if (error)
    return (
      <Typography variant="body2" color="error" mb={4}>
        Error loading location data.
      </Typography>
    );

  return (
    <Box mb={4}>
      <Grid container mb={4} spacing={3}>
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

export default LocationData;

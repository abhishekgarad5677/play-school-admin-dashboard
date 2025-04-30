import { useEffect, useState } from "react";
import { Avatar, Box, Card, Stack, Typography } from "@mui/material";
import { blue, green, red, yellow, orange } from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Chart from "react-apexcharts";
import AppsIcon from "@mui/icons-material/Apps";
import { useGetGameSummaryMutation } from "../../redux/slices/apiSlice";
import { formatPlayTime } from "../../utils/Hooks";

const GameSummary = () => {
  const [mostPlayedData, setMostPlayedData] = useState([]);
  const [leastPlayedData, setLeastPlayedData] = useState([]);

  const [postGameSummary, { isLoading, error, data }] =
    useGetGameSummaryMutation();

  useEffect(() => {
    postGameSummary({});
  }, []);

  const colorPalette = [
    { color: blue[100], textColor: blue[700] },
    { color: green[100], textColor: green[700] },
    { color: red[100], textColor: red[700] },
    { color: yellow[100], textColor: yellow[700] },
    { color: orange[100], textColor: orange[700] },
  ];

  useEffect(() => {
    if (data && data?.status === true) {
      setMostPlayedData(
        data?.data?.mostPlayed?.map((ele, index) => {
          const colors = colorPalette[index % colorPalette.length];
          return {
            title: ele?.name,
            subtitle: ele?.playCount,
            value: formatPlayTime(ele?.playTimeInMinutes),
            ...colors, // apply dynamic color
          };
        })
      );
      setLeastPlayedData(
        data?.data?.leastPlayed?.map((ele, index) => {
          const colors = colorPalette[index % colorPalette.length];
          return {
            title: ele?.name,
            subtitle: ele?.playCount,
            value: formatPlayTime(ele?.playTimeInMinutes),
            ...colors, // apply dynamic color
          };
        })
      );
    }
  }, [data]);

  console.log("===", mostPlayedData);

  const chartOptions = {
    chart: { sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#1fb6ff"],
    plotOptions: {
      bar: {
        columnWidth: "25%", // You can set this to '60%', '30px', etc.
        borderRadius: 4, // Optional: for rounded bars
      },
    },
    xaxis: {
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    yaxis: { show: true },
    grid: { show: true },
    tooltip: { enabled: true },
  };

  const chartSeries = [{ name: "Sales", data: [100, 85, 60, 50, 30] }];

  const statItems = [
    {
      title: "Connect The Dot",
      subtitle: 200,
      value: "+68",
      color: blue[100],
      textColor: blue[700],
    },
    {
      title: "Spot Hunt",
      subtitle: 158,
      value: "+45",
      color: green[100],
      textColor: green[700],
    },
    {
      title: "Link it!",
      subtitle: 99,
      value: "+14",
      color: red[100],
      textColor: red[700],
    },
    {
      title: "Paint Pop",
      subtitle: 99,
      value: "+14",
      color: yellow[100],
      textColor: yellow[700],
    },
    {
      title: "Flash Cards",
      subtitle: 99,
      value: "+14",
      color: orange[100],
      textColor: orange[700],
    },
  ];

  const attendanceData = [
    {
      title: "0-30%",
      subtitle: 200,
      value: "68",
      color: blue[100],
      textColor: blue[700],
    },
    {
      title: "30%-80%",
      subtitle: 158,
      value: "45",
      color: green[100],
      textColor: green[700],
    },
    {
      title: "80%-100%",
      subtitle: 99,
      value: "14",
      color: red[100],
      textColor: red[700],
    },
  ];

  const reportData = [{ name: "Sales", data: [30, 85, 60] }];

  if (isLoading) return <>loading game stats...</>;

  return (
    <>
      <Grid container mb={4} spacing={3}>
        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              Top 5 Most Played Games
            </Typography>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={"40%"}
              width={"100%"}
            />

            <Stack spacing={2} mt={2}>
              {mostPlayedData?.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: item.color,
                        width: 32,
                        height: 32,
                        mr: 1,
                      }}
                    >
                      <AppsIcon
                        fontSize="small"
                        sx={{ color: item.textColor }}
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        No. Of Times Game Played: {item.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={item.textColor}
                  >
                    Time Spend: {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              Top 5 Least Played Games
            </Typography>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={"40%"}
              width={"100%"}
            />

            <Stack spacing={2} mt={2}>
              {leastPlayedData?.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: item.color,
                        width: 32,
                        height: 32,
                        mr: 1,
                      }}
                    >
                      <AppsIcon
                        fontSize="small"
                        sx={{ color: item.textColor }}
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        No. Of Times Game Played: {item.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={item.textColor}
                  >
                    Time Spend: {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              Attendance Report
            </Typography>
            <Chart
              options={chartOptions}
              series={reportData}
              type="bar"
              height={"40%"}
              width={"100%"}
            />

            <Stack spacing={2} mt={2}>
              {attendanceData.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: item.color,
                        width: 32,
                        height: 32,
                        mr: 1,
                      }}
                    >
                      <AppsIcon
                        fontSize="small"
                        sx={{ color: item.textColor }}
                      />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {item.title}
                      </Typography>
                      {/* <Typography variant="caption" color="text.secondary">
                          No. Of Times Game Played: {item.subtitle}
                        </Typography> */}
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={item.textColor}
                  >
                    No. Of Students: {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default GameSummary;

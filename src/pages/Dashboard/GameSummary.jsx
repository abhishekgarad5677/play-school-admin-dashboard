import { useEffect, useState } from "react";
import { Avatar, Box, Card, Stack, Typography } from "@mui/material";
import { blue, green, red, yellow, orange } from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Chart from "react-apexcharts";
import AppsIcon from "@mui/icons-material/Apps";
import { useGetGameSummaryMutation } from "../../redux/slices/apiSlice";
import { formatPlayTime, getChartOptions, getGraphSeriesData, getProcessedMostPlayedData } from "../../utils/Hooks";

const GameSummary = () => {
  const [mostPlayedData, setMostPlayedData] = useState({
    data: [],
    graphData: [],
    chartOptions: {},
  });
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
    if (data && data?.status === true && colorPalette) {
      // logic for mnost played games
      // setMostPlayedData((prev) => {
      //   const processedData = data?.data?.mostPlayed?.map((ele, index) => {
      //     const colors = colorPalette[index % colorPalette.length];
      //     return {
      //       title: ele?.name,
      //       subtitle: ele?.playCount,
      //       value: formatPlayTime(ele?.playTimeInMinutes),
      //       ...colors,
      //     };
      //   });

      //   const playCounts = data?.data?.mostPlayed?.map((ele) => ele?.playCount);
      //   const gameNames = data?.data?.mostPlayed?.map((ele) => ele?.name);

      //   const processedGraphData = [
      //     {
      //       name: "No. Of Times Game Played:",
      //       data: playCounts,
      //     },
      //   ];

      //   const chartOptions = {
      //     chart: { sparkline: { enabled: true } },
      //     stroke: { curve: "smooth", width: 1 },
      //     colors: colorPalette.map((c) => c.textColor), // assuming each color object has a `color` key
      //     plotOptions: {
      //       bar: {
      //         distributed: true,
      //         columnWidth: "20%",
      //         borderRadius: 2,
      //       },
      //     },
      //     xaxis: {
      //       type: "category",
      //       categories: gameNames,
      //     },
      //     yaxis: { show: false },
      //     grid: { show: true },
      //     tooltip: { enabled: true },
      //   };

      //   return {
      //     ...prev,
      //     data: processedData,
      //     graphData: processedGraphData,
      //     chartOptions: chartOptions, // You may need to store this separately or pass to Chart directly
      //   };
      // });

      const rawData = data?.data?.mostPlayed;

      setMostPlayedData({
        data: getProcessedMostPlayedData(rawData, colorPalette),
        graphData: getGraphSeriesData(rawData),
        chartOptions: getChartOptions(rawData, colorPalette),
      });

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



  const chartSeries = [
    { name: "No. Of Times Game Played:", data: [100, 85, 60, 50, 30] },
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
  if (error) return <>error loading game stats...</>;

  return (
    <Box mb={4}>
      <Grid container mb={4} spacing={3}>
        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              All Time Top 5 Most Played Games
            </Typography>
            <Chart
              options={mostPlayedData.chartOptions}
              series={mostPlayedData.graphData}
              type="bar"
              height={"60%"}
              width={"100%"}
            />
            <Stack spacing={2} mt={2}>
              {mostPlayedData?.data?.map((item, index) => (
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
        {/* <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              All Time Top 5 Least Played Games
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
        </Grid> */}
      </Grid>
      {/* <Grid container spacing={3}>
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
      </Grid> */}
    </Box>
  );
};

export default GameSummary;

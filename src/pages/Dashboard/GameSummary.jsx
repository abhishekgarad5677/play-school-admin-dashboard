import { useEffect, useState } from "react";
import { Avatar, Box, Card, Skeleton, Stack, Typography } from "@mui/material";
import { blue, green, red, yellow, orange } from "@mui/material/colors";
import Grid from "@mui/material/Grid2";
import Chart from "react-apexcharts";
import AppsIcon from "@mui/icons-material/Apps";
import { useGetGameSummaryMutation } from "../../redux/slices/apiSlice";
import {
  getChartOptions,
  getGraphSeriesData,
  getProcessedMostPlayedData,
} from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";

const GameSummary = () => {
  const [mostPlayedData, setMostPlayedData] = useState({
    data: [],
    graphData: [],
    chartOptions: {},
  });
  const [leastPlayedData, setLeastPlayedData] = useState({
    data: [],
    graphData: [],
    chartOptions: {},
  });

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
      const mostData = data?.data?.mostPlayed;
      setMostPlayedData({
        data: getProcessedMostPlayedData(mostData, colorPalette),
        graphData: getGraphSeriesData(mostData),
        chartOptions: getChartOptions(mostData, colorPalette),
      });

      const leastData = data?.data?.leastPlayed;
      setLeastPlayedData({
        data: getProcessedMostPlayedData(leastData, colorPalette),
        graphData: getGraphSeriesData(leastData),
        chartOptions: getChartOptions(leastData, colorPalette),
      });
    }
  }, [data]);

  const navigate = useNavigate();

  if (isLoading)
    return (
      <Grid container mb={4} spacing={2}>
        <Grid size={6}>
          <Skeleton variant="rounded" width={"100%"} height={550} />
        </Grid>
        <Grid size={6}>
          <Skeleton variant="rounded" width={"100%"} height={550} />
        </Grid>
      </Grid>
    );
  if (error)
    return (
      <Typography variant="body2" color="error" mb={4}>
        Error loading game summary data.
      </Typography>
    );

  return (
    <Box mb={4}>
      <Grid container mb={4} spacing={3}>
        <Grid
          size={6}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard/games")}
        >
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              Top 5 Most Played Games (Lifetime)
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
        <Grid
          size={6}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard/games")}
        >
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              Top 5 Least Played Games (Lifetime)
            </Typography>
            <Chart
              options={leastPlayedData.chartOptions}
              series={leastPlayedData.graphData}
              type="bar"
              height={"60%"}
              width={"100%"}
            />
            <Stack spacing={2} mt={2}>
              {leastPlayedData?.data?.map((item, index) => (
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
    </Box>
  );
};

export default GameSummary;

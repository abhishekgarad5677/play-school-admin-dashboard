import { useEffect, useState } from "react";
import { useGetAttendanceDataSummaryMutation } from "../../redux/slices/apiSlice";
import { Avatar, Box, Card, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { blue, green, red, yellow, orange } from "@mui/material/colors";
import AppsIcon from "@mui/icons-material/Apps";
import Chart from "react-apexcharts";
import { formatDateToReadableString } from "../../utils/Hooks";

const AttendanceData = ({ date, startDate, endDate, children }) => {
  const [attendanceData, setAttendanceData] = useState({
    data: [],
    graphData: [],
    chartOptions: {},
  });

  const [postAttendanceDataSummary, { isLoading, error, data }] =
    useGetAttendanceDataSummaryMutation();

  useEffect(() => {
    if (date !== "custom") {
      const formData = new FormData();
      formData.append("FilterType", date);
      postAttendanceDataSummary(formData);
    } else if (date === "custom" && startDate && endDate) {
      const formattedStart = formatDateToReadableString(startDate);
      const formattedEnd = formatDateToReadableString(endDate);

      const formData = new FormData();
      formData.append("FilterType", date);
      formData.append("FromDate", formattedStart);
      formData.append("ToDate", formattedEnd);

      postAttendanceDataSummary(formData);
    }
  }, [date, startDate, endDate]);

  const colorPalette = [
    { color: blue[100], textColor: blue[700] },
    { color: green[100], textColor: green[700] },
    { color: red[100], textColor: red[700] },
    { color: yellow[100], textColor: yellow[700] },
    { color: orange[100], textColor: orange[700] },
  ];

  useEffect(() => {
    if (data && data?.status === true && colorPalette) {
      const category = data?.data?.map((ele) => ele?.range) || [];
      setAttendanceData({
        data: [
          {
            id: 1,
            title: "0-30%",
            value: data?.data[0]?.count,
            color: blue[100],
            textColor: blue[700],
          },
          {
            id: 2,
            title: "30%-80%",
            value: data?.data[1]?.count,
            color: green[100],
            textColor: green[700],
          },
          {
            id: 3,
            title: "80%-100%",
            value: data?.data[2]?.count,
            color: red[100],
            textColor: red[700],
          },
        ],
        graphData: [
          {
            name: "No. Of Students:",
            data: data?.data?.map((item) => item?.count),
          },
        ],
        chartOptions: {
          chart: {
            // type: "bar",
            toolbar: {
              show: false,
            },
          },
          stroke: {
            curve: "smooth",
            width: 1,
          },
          colors: colorPalette?.map((c) => c?.textColor || "#000"),
          plotOptions: {
            bar: {
              distributed: true,
              columnWidth: "20%",
              borderRadius: 2,
              dataLabels: {
                position: "top",
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: (val) => val,
            offsetY: 0,
            style: {
              fontSize: "12px",
              colors: ["#fff"],
            },
          },
          xaxis: {
            categories: category,
            labels: { show: false },
            axisTicks: { show: false },
            axisBorder: { show: false },
          },
          yaxis: {
            show: true,
            labels: {
              style: {
                fontSize: "12px",
              },
            },
          },
          grid: {
            show: true,
          },
          tooltip: {
            enabled: true,
          },
        },
      });
    }
  }, [data]);

  if (isLoading) return <>loading game stats...</>;
  if (error) return <>error loading game stats...</>;

  return (
    <Box mb={4}>
      <Grid container spacing={3}>
        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={4} fontWeight={600} variant="h6">
              Attendance Report
            </Typography>
            {attendanceData && (
              <Chart
                options={attendanceData.chartOptions}
                series={attendanceData.graphData}
                type="bar"
                height={"60%"}
                width={"100%"}
              />
            )}

            <Stack spacing={2} mt={2}>
              {attendanceData.data.length > 1 &&
                attendanceData?.data?.map((item, index) => (
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
                        <Typography variant="subtitle2" fontWeight="600">
                          {item?.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={item.textColor}
                    >
                      No. Of Students: {item?.value}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Card>
        </Grid>
        <Grid size={6}>
          <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
            {typeof children === "function"
              ? children({ attendanceData, isLoading })
              : children}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceData;

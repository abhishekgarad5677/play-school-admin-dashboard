// src/pages/Funnel/AnalyticsEventsChart.jsx
import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Skeleton, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGetAnalyticsEventsQuery } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";

const formatDateLabel = (yyyymmdd) => {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd;
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const day = yyyymmdd.slice(6, 8);
  return `${day}/${month}/${year}`;
};

const toIsoDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

const AnalyticsEventsChart = ({ filterDate, startDate, endDate }) => {
  const theme = useTheme();

  // Build query args based on custom or normal date
  const queryArgs =
    filterDate === "custom" && startDate && endDate
      ? {
          FilterType: "custom",
          FromDate: toIsoDate(startDate),
          ToDate: toIsoDate(endDate),
        }
      : filterDate; // normal preset date (today, 7daysAgo, etc.)

  const {
    data: analyticsEvents,
    isLoading,
    error,
  } = useGetAnalyticsEventsQuery(queryArgs, {
    skip: !filterDate,
  });

  // Transform API data → Apex series + categories
  const { series, categories } = useMemo(() => {
    if (!analyticsEvents || !Array.isArray(analyticsEvents)) {
      return { series: [], categories: [] };
    }

    const dateSet = new Set();
    const eventsByName = {};

    analyticsEvents.forEach((item) => {
      const { eventName, date, eventCount } = item;
      if (!eventName || !date) return;

      dateSet.add(date);

      if (!eventsByName[eventName]) {
        eventsByName[eventName] = {};
      }
      eventsByName[eventName][date] = eventCount ?? 0;
    });

    const sortedDates = [...dateSet].sort(); // yyyymmdd sorts correctly

    const seriesData = Object.entries(eventsByName).map(
      ([eventName, countsByDate]) => ({
        name: eventName,
        data: sortedDates.map((d) => countsByDate[d] ?? 0),
        color: eventName === "app_remove" ? "#FF0000" : undefined, // 🔴 RED line
      })
    );

    const categories = sortedDates.map((d) => formatDateLabel(d));

    return { series: seriesData, categories };
  }, [analyticsEvents]);

  const options = {
    chart: {
      id: "analytics-events",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      title: {
        text: "Date",
      },
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: "Event Count",
      },
      min: 0,
      forceNiceScale: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    theme: {
      mode: theme.palette.mode === "dark" ? "dark" : "light",
    },
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Firebase Analytics
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
        Filter: <strong>{filterDate}</strong>
      </Typography>

      {isLoading && <Skeleton variant="rounded" width="100%" height={320} />}

      {error && !isLoading && (
        <Typography color="error" variant="body2">
          Failed to load analytics events.
        </Typography>
      )}

      {!isLoading && !error && series.length > 0 && (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={380}
        />
      )}

      {!isLoading && !error && series.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No analytics data available for this filter.
        </Typography>
      )}
    </Box>
  );
};

export default AnalyticsEventsChart;

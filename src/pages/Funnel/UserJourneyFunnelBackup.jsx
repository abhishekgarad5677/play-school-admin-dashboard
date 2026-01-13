import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Grid from "@mui/material/Grid2";
import { useGetFreeTrialStartedFunnelMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";

const toTitle = (camel) =>
  camel.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const UserJourneyFunnelBackup = ({ filterDate, startDate, endDate }) => {
  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetFreeTrialStartedFunnelMutation();

  useEffect(() => {
    const formData = new FormData();

    if (filterDate !== "custom") {
      formData.append("FilterType", filterDate);
      postDashboardData(formData);
      return;
    }

    if (filterDate === "custom" && startDate && endDate) {
      formData.append("FilterType", filterDate);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
      postDashboardData(formData);
    }
  }, [filterDate, startDate, endDate, postDashboardData]);

  // Build chart arrays in the SAME order as API sends keys
  const { categories, seriesData } = useMemo(() => {
    const payload = DashboardData?.data;
    if (!payload) return { categories: [], seriesData: [] };

    const entries = Object.entries(payload); // preserves insertion order
    return {
      categories: entries.map(([key]) => toTitle(key)),
      seriesData: entries.map(([, value]) =>
        typeof value === "number" ? value : 0
      ),
    };
  }, [DashboardData]);

  const [state, setState] = useState({
    series: [{ name: "Funnel Series", data: [] }],
    options: {
      chart: {
        type: "bar",
        height: 350,
        dropShadow: { enabled: true },
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: "80%",
          isFunnel: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          const label = opt.w.globals.labels?.[opt.dataPointIndex] ?? "";
          return `${label}: ${val}`;
        },
        dropShadow: { enabled: true },
      },
      title: { text: "User Journey Funnel", align: "middle" },
      xaxis: { categories: [] },
      legend: { show: false },
    },
  });

  useEffect(() => {
    if (!categories.length) return;

    setState((prev) => ({
      ...prev,
      series: [{ name: "Funnel Series", data: seriesData }],
      options: {
        ...prev.options,
        xaxis: { ...prev.options.xaxis, categories },
      },
    }));
  }, [categories, seriesData]);

  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Failed to load funnel data.</div>
        ) : (
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="bar"
            height={350}
          />
        )}
      </Grid>
      <Grid size={6}></Grid>
    </Grid>
  );
};

export default UserJourneyFunnelBackup;

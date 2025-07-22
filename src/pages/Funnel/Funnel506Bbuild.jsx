import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Funnel506Bbuild = ({ funnelData }) => {
  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 400,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [],
        labels: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
          },
        },
      },
      grid: {
        row: {
          colors: ["#f3f4f5", "#fff"],
        },
      },
    },
  });

  useEffect(() => {
    if (funnelData) {
      const steps = [
        { key: "bSignedInUser", label: "Signed In User", color: "#008FFB" },
        { key: "bsubscribedCount", label: "Subscribed Count", color: "#00E396" },
        { key: "bMonthlySubscribedCount", label: "Monthly Subscription", color: "#775DD0" },
        { key: "bYearlySubscribedCount", label: "Yearly Subscription", color: "#FEB019" },
      ];

      const labels = steps.map((s) => s.label);
      const values = steps.map((s) => funnelData[s.key] || 0);
      const colors = steps.map((s) => s.color);

      setState((prev) => ({
        ...prev,
        series: [{ data: values }],
        options: {
          ...prev.options,
          colors,
          xaxis: {
            ...prev.options.xaxis,
            categories: labels,
          },
        },
      }));
    }
  }, [funnelData]);

  return (
    <div>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          display: "block",
          color: "#464646",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        Data starting from 21st July 2025
      </Typography>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default Funnel506Bbuild;

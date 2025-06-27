import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const SmsOtpFunnel = ({ funnelData }) => {
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
        {
          key: "registeredCount",
          label: "Registered",
          color: "#FEB019",
        },
        {
          key: "subscribedCount",
          label: "Subscribed",
          color: "#00E396",
        },
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
        SMS OTP Funnel (Data Till 10th June 2025)
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

export default SmsOtpFunnel;

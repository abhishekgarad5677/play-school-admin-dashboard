import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ATestingFunnel = ({ funnelData }) => {
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
        { key: "otpSentCount", label: "OTP Sent", color: "#008FFB" },
        { key: "otpVerifiedCount", label: "OTP Verified", color: "#00E396" },
        { key: "subscirbedCount", label: "Subscribed", color: "#FEB019" },
        { key: "registeredCount", label: "Registered", color: "#775DD0" },
      ];

      const labels = steps.map((s) => s.label);
      const values = steps.map((s) => funnelData[s.key] || 0);

      setState((prev) => ({
        ...prev,
        series: [{ data: values }],
        options: {
          ...prev.options,
          colors: steps.map((s) => s.color),
          xaxis: { ...prev.options.xaxis, categories: labels },
        },
      }));
    }
  }, [funnelData]);

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="bar"
      height={400}
    />
  );
};

export default ATestingFunnel;

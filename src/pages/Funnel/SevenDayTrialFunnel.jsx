import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const SevenDayTrialFunnel = ({ subscriptionData }) => {
  console.log(subscriptionData);

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
    if (subscriptionData?.playServiceSubscription) {
      const steps = [
        {
          key: "totalSubscription",
          label: "Total",
          color: "#546E7A",
        },
        {
          key: "subscriptioN_ACTIVE",
          label: "Free Trial Started",
          color: "#008FFB",
        },
        {
          key: "subscriptioN_RENEWED",
          label: "Paid After Free Trial",
          color: "#00E396",
        },
        {
          key: "subscriptioN_CANCELED",
          label: "Auto Pay Canceled",
          color: "#FF4560",
        },
        {
          key: "subscriptioN_EXPIRED",
          label: "Free Trial Expired",
          color: "#FEB019",
        },
        {
          key: "subscriptioN_IN_GRACE_PERIOD",
          label: "Auto Pay In Grace Period",
          color: "#775DD0",
        },
      ];

      const labels = steps.map((s) => s.label);
      const values = steps.map(
        (s) => subscriptionData.playServiceSubscription[s.key] || 0
      );
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
  }, [subscriptionData]);

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
        7-Day Free Trial Funnel
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

export default SevenDayTrialFunnel;

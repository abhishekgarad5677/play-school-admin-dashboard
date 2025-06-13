import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { formatPlayTime, formatTimeFromDecimalMinutes } from "../../utils/Hooks";

const TopStates = ({ topCitiesData }) => {
  const [state, setState] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    if (topCitiesData && topCitiesData.status === true) {
      const states = topCitiesData.data.topStates.map((item) => item.state);
      const usersData = topCitiesData.data.topStates.map((item) => item.users);
      const avgTimeSpentData = topCitiesData.data.topStates.map(
        (item) => item.averageTimeSpent
      );

      setState({
        series: [
          {
            name: "Users",
            data: usersData,
          },
          {
            name: "Avg. Time Spent",
            data: avgTimeSpentData,
          },
        ],
        options: {
          chart: {
            type: "area",
            height: 430,
            toolbar: {
              show: false,
            },
          },
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: "smooth",
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (val, { seriesIndex }) {
                return seriesIndex === 1 ? formatTimeFromDecimalMinutes(val) : val;
              },
            },
          },
          xaxis: {
            categories: states,
            title: {
              text: "States",
            },
          },
          yaxis: {
            title: {
              text: "Values",
            },
          },
        },
      });
    }
  }, [topCitiesData]);

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="area"
      height={450}
    />
  );
};

export default TopStates;

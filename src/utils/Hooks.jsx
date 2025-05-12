import { useMemo } from "react";

// Custom hook to generate unique id
export const generateUID = () =>
  "uid-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);

// Custom hook to format date
export const useFormattedDate = (isoString) => {
  return useMemo(() => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [isoString]);
};

export const formatDateToReadableString = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short", // or use "long" for full month names
    year: "numeric",
  });
};

export const formatPlayTime = (playTimeInMinutes) => {
  if (playTimeInMinutes < 1) {
    const seconds = Math.round(playTimeInMinutes * 60);
    return `${seconds} sec`;
  } else if (playTimeInMinutes < 60) {
    const minutes = Math.floor(playTimeInMinutes);
    return `${minutes} min`;
  } else {
    const hours = Math.floor(playTimeInMinutes / 60);
    const minutes = Math.floor(playTimeInMinutes % 60);
    if (minutes > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${hours} hr`;
    }
  }
};

export const getProcessedMostPlayedData = (data, colorPalette) => {
  return (
    data?.map((ele, index) => {
      const colors = colorPalette[index % colorPalette.length];
      return {
        title: ele?.name,
        subtitle: ele?.playCount,
        value: formatPlayTime(ele?.playTimeInMinutes),
        ...colors,
      };
    }) || []
  );
};

export const getGraphSeriesData = (data) => {
  return [
    {
      name: "No. Of Times Game Played:",
      data: data?.map((ele) => ele?.playCount) || [],
    },
  ];
};

export const getChartOptions = (data, colorPalette) => {
  const gameNames = data?.map((ele) => ele?.name) || [];

  return {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    colors: colorPalette.map((c) => c.textColor),
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
      categories: gameNames,
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
  };
};

import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Skeleton } from "@mui/material";
import { useGetFunnelRetryMetricsMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";

// ─── Funnel step order ───────────────────────────────────────────────────────
const FUNNEL_ORDER = [
  "freeTrialFailed",
  "freeTrialRetry",
  "monthlyClicked",
  "freeTrialRetrySuccess",
  "monthlySubscriptionClicked",
];

const LABEL_MAP = {
  freeTrialFailed: "Free Trial Failed",
  freeTrialRetry: "Free Trial Retry",
  monthlyClicked: "Monthly Clicked",
  freeTrialRetrySuccess: "Free Trial Retry Success",
  monthlySubscriptionClicked: "Monthly Sub Clicked",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const buildDescendingShape = (n) =>
  Array.from({ length: n }, (_, i) => (n - i) * 100);

const wrapLabel = (val, maxChars = 18) => {
  if (val === null || val === undefined) return "";
  const text = Array.isArray(val)
    ? val.join(" ")
    : typeof val === "string"
      ? val
      : String(val);

  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = (line + " " + word).trim();
    }
  });

  if (line) lines.push(line.trim());
  return lines.join("\n");
};

// ─── Component ────────────────────────────────────────────────────────────────
const RetryFunnelMetrics = ({ filterDate, startDate, endDate }) => {
  const [postRetryMetrics, { isLoading, error, data: retryData }] =
    useGetFunnelRetryMetricsMutation();

  // Fetch on filter change
  useEffect(() => {
    const formData = new FormData();

    if (filterDate !== "custom") {
      formData.append("FilterType", filterDate);
      postRetryMetrics(formData);
      return;
    }

    if (filterDate === "custom" && startDate && endDate) {
      formData.append("FilterType", filterDate);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
      postRetryMetrics(formData);
    }
  }, [filterDate, startDate, endDate, postRetryMetrics]);

  // Build value map from API response
  const dataMap = useMemo(() => {
    const obj = retryData?.data ?? {};
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, typeof v === "number" ? v : 0]),
    );
  }, [retryData]);

  // Derive chart inputs
  const { categories, actualValues } = useMemo(() => {
    const categories = FUNNEL_ORDER.map((k) => LABEL_MAP[k] ?? k);
    const actualValues = FUNNEL_ORDER.map((k) => dataMap[k] ?? 0);
    return { categories, actualValues };
  }, [dataMap]);

  // Chart state
  const [state, setState] = useState({
    series: [{ name: "Shape", data: [] }],
    options: {
      chart: {
        type: "bar",
        height: 420,
        dropShadow: { enabled: false },
      },

      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%",
          isFunnel: true,
          borderRadius: 0,
          distributed: true,
          dataLabels: { position: "center" },
        },
      },

      dataLabels: {
        enabled: true,
        textAnchor: "middle",
        style: {
          colors: ["#FFFFFF"],
          fontSize: "12px",
          fontWeight: 700,
        },
        formatter: function (_val, opt) {
          const idx = opt.dataPointIndex;
          const realVal = opt.w.config.customActualValues?.[idx] ?? 0;
          return `${realVal}`;
        },
        dropShadow: { enabled: false },
      },

      yaxis: {
        labels: {
          formatter: (val) => wrapLabel(val, 18),
          style: {
            colors: "#000000",
            fontSize: "12px",
            fontWeight: 600,
          },
        },
      },

      xaxis: {
        categories: [],
        labels: { show: false },
      },

      grid: {
        padding: { left: 110, right: 20 },
      },

      tooltip: {
        enabled: true,
        x: { show: false },
        y: {
          formatter: function (_val, opt) {
            const idx = opt.dataPointIndex;
            const label = opt.w.globals.labels?.[idx] ?? "";
            const realVal = opt.w.config.customActualValues?.[idx] ?? 0;
            return `${label}: ${realVal}`;
          },
          title: { formatter: () => "" },
        },
      },

      legend: { show: false },

      title: {
        text: "Retry Funnel Build A/B",
        align: "center",
      },

      // Custom config slots for real values / labels
      customActualValues: [],
    },
  });

  // Sync chart whenever derived data changes
  useEffect(() => {
    if (!categories.length) return;

    setState((prev) => ({
      ...prev,
      series: [
        { name: "Shape", data: buildDescendingShape(categories.length) },
      ],
      options: {
        ...prev.options,
        xaxis: { ...prev.options.xaxis, categories },
        customActualValues: actualValues,
      },
    }));
  }, [categories, actualValues]);

  // ── Render ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={360} />;
  }

  if (error) {
    return <div>Failed to load retry funnel data.</div>;
  }

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="bar"
      height={240}
    />
  );
};

export default RetryFunnelMetrics;

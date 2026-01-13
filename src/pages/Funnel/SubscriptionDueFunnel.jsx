import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Modal, Box, Typography, Skeleton } from "@mui/material";
import { useGetSubscriptionDueFunnelMutation } from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";

const toTitle = (camel) =>
  camel.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const buildDescendingShape = (n) => {
  const step = 100;
  return Array.from({ length: n }, (_, i) => (n - i) * step);
};

// ✅ REQUIRED ORDER (and filter)
const SUBSCRIPTION_DUE_ORDER = [
  "subscriptionDueCount",
  "subscriptionSuccess",
  "subscriptionCancellation",
  "paymentFailure",
];

const SubscriptionDueFunnel = ({ filterDate, startDate, endDate }) => {
  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetSubscriptionDueFunnelMutation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);

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

  // ✅ Build data in your required order (filtered)
  const { keys, categories, actualValues } = useMemo(() => {
    const payload = DashboardData?.data;
    if (!payload) return { keys: [], categories: [], actualValues: [] };

    const orderedKeys = SUBSCRIPTION_DUE_ORDER.filter((k) =>
      Object.prototype.hasOwnProperty.call(payload, k)
    );

    return {
      keys: orderedKeys,
      categories: orderedKeys.map((k) => toTitle(k)),
      actualValues: orderedKeys.map((k) =>
        typeof payload[k] === "number" ? payload[k] : 0
      ),
    };
  }, [DashboardData]);

  const [state, setState] = useState({
    series: [{ name: "Shape", data: [] }],
    options: {
      chart: {
        type: "bar",
        height: 200,
        dropShadow: { enabled: false },
        events: {
          dataPointSelection: function (_event, _chartCtx, config) {
            const index = config?.dataPointIndex;
            if (index === undefined || index === null || index < 0) return;

            const key = config.w?.config?.customKeys?.[index];
            const label = config.w?.globals?.labels?.[index];
            const value = config.w?.config?.customActualValues?.[index];

            setSelectedBar({
              index, // 0..3 based on SUBSCRIPTION_DUE_ORDER
              key: key ?? "",
              label: label ?? "",
              value: typeof value === "number" ? value : 0,
            });
            setOpenModal(true);
          },
        },
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
          formatter: function (val) {
            return wrapLabel(val, 18);
          },
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
        x: { show: false }, // hide default x label row (optional)
        y: {
          formatter: function (_val, opt) {
            const idx = opt.dataPointIndex;
            const label = opt.w.globals.labels?.[idx] ?? "";
            const realVal = opt.w.config.customActualValues?.[idx] ?? 0;
            return `${label}: ${realVal}`;
          },
          title: {
            formatter: () => "", // removes "Shape" title
          },
        },
      },

      legend: { show: false },
      title: { text: "Subscription Due Funnel", align: "center" },

      customActualValues: [],
      customKeys: [],
    },
  });

  useEffect(() => {
    if (!categories.length) return;

    const shapeData = buildDescendingShape(categories.length);

    setState((prev) => ({
      ...prev,
      series: [{ name: "Shape", data: shapeData }],
      options: {
        ...prev.options,
        xaxis: { ...prev.options.xaxis, categories },
        customActualValues: actualValues,
        customKeys: keys,
      },
    }));
  }, [categories, actualValues, keys]);

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rectangular" width={"100%"} height={360} />
      ) : error ? (
        <div>Failed to load data.</div>
      ) : (
        <>
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="bar"
            height={280}
          />

          {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 380,
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h6" mb={1}>
                Funnel Step Details
              </Typography>

              {selectedBar ? (
                <>
                  <Typography mb={0.5}>
                    <strong>Index:</strong> {selectedBar.index}
                  </Typography>
                  <Typography mb={0.5}>
                    <strong>Key:</strong> {selectedBar.key}
                  </Typography>
                  <Typography mb={0.5}>
                    <strong>Step:</strong> {selectedBar.label}
                  </Typography>
                  <Typography>
                    <strong>Count:</strong> {selectedBar.value}
                  </Typography>
                </>
              ) : (
                <Typography>No selection</Typography>
              )}
            </Box>
          </Modal> */}
        </>
      )}
    </>
  );
};

export default SubscriptionDueFunnel;

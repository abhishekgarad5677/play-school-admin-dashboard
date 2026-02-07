import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Skeleton, Modal, Box, Typography, Button } from "@mui/material";
import {
  useGetFreeTrialStartedAnalyticsCountFunnelMutation,
  useGetFreeTrialStartedFunnelMutation,
} from "../../redux/slices/apiSlice";
import { formatDateToReadableString } from "../../utils/Hooks";
import ExportChildDetailsData from "../../components/funnel/ExportChildDetailsData";
import ExportPhoneNumberDetails from "../../components/funnel/ExportPhoneNumberDetails";

const toTitle = (camel) =>
  String(camel)
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

const buildDescendingShape = (n) => {
  const step = 100;
  return Array.from({ length: n }, (_, i) => (n - i) * step);
};

// ✅ REQUIRED MERGED SEQUENCE
const FUNNEL_ORDER = [
  "first_open",
  "signup",
  "childDetails",
  "phoneNumberAdded",
  "Click_free_trail",
  "freeTrialSuccess",
  "subscriptionCancelled",
  "due",
  "subscriptionSuccess",
  "pending",
  "halted",
];

console.log(FUNNEL_ORDER);

// ✅ DISPLAY LABELS (keep keys same, only change UI text)
const LABEL_MAP = {
  first_open: "Installs",
  signup: "Google Signup",
  childDetails: "Child Details Added",
  phoneNumberAdded: "Phone Number Added",
  Click_free_trail: "Free Trial Clicked",
  freeTrialSuccess: "Free Trial Started",
  subscriptionCancelled: "Subscription Cancelled",
  due: "Sub Due After 7 Days",
  subscriptionSuccess: "Subscription Success",
  pending: "Subscription Pending",
  halted: "Subscription Halted",
};

const UserJourneyForcedFunnel = ({ filterDate, startDate, endDate }) => {
  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetFreeTrialStartedFunnelMutation();

  const [
    postDashboardDataCount,
    {
      isLoading: loadingDataCount,
      error: dataCountError,
      data: DashboardDataCount,
    },
  ] = useGetFreeTrialStartedAnalyticsCountFunnelMutation();

  // ✅ modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportPhoneModalOpen, setExportPhoneModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");

  // Optional: keep the latest filter payload handy for export
  const exportPayload = useMemo(() => {
    const payload = {
      filterType: filterDate,
      fromDate:
        filterDate === "custom" && startDate
          ? formatDateToReadableString(startDate)
          : null,
      toDate:
        filterDate === "custom" && endDate
          ? formatDateToReadableString(endDate)
          : null,
    };
    return payload;
  }, [filterDate, startDate, endDate]);

  useEffect(() => {
    const formData = new FormData();

    if (filterDate !== "custom") {
      formData.append("FilterType", filterDate);
      postDashboardData(formData);
      postDashboardDataCount(formData);
      return;
    }

    if (filterDate === "custom" && startDate && endDate) {
      formData.append("FilterType", filterDate);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
      postDashboardData(formData);
      postDashboardDataCount(formData);
    }
  }, [
    filterDate,
    startDate,
    endDate,
    postDashboardData,
    postDashboardDataCount,
  ]);

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

  // ✅ Merge both API responses into one map
  const mergedMap = useMemo(() => {
    const map = {};

    // 1) Analytics array -> map
    const arr = Array.isArray(DashboardDataCount) ? DashboardDataCount : [];
    arr.forEach((item) => {
      if (!item) return;
      const k = item.eventName;
      const v = item.eventCount;
      if (typeof k === "string") map[k] = typeof v === "number" ? v : 0;
    });

    // 2) Funnel object -> map
    const obj = DashboardData?.data ?? {};
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      map[k] = typeof v === "number" ? v : 0;
    });

    return map;
  }, [DashboardDataCount, DashboardData]);

  // ✅ Build chart inputs in required order
  const { keys, categories, actualValues } = useMemo(() => {
    const keys = FUNNEL_ORDER;
    const categories = keys.map((k) => LABEL_MAP[k] ?? toTitle(k));
    const actualValues = keys.map((k) =>
      typeof mergedMap[k] === "number" ? mergedMap[k] : 0,
    );
    return { keys, categories, actualValues };
  }, [mergedMap]);

  const [state, setState] = useState({
    series: [{ name: "Shape", data: [] }],
    options: {
      chart: {
        type: "bar",
        height: 420,
        dropShadow: { enabled: false },

        // ✅ click handler
        events: {
          dataPointSelection: function (_event, _chartContext, config) {
            const idx = config?.dataPointIndex;
            if (idx === undefined || idx === null || idx < 0) return;

            const clickedKey = config.w.config.customKeys?.[idx];
            const clickedLabel = config.w.config.customLabels?.[idx] ?? "";

            // ✅ only open modal for Child Details
            if (clickedKey === "childDetails") {
              setSelectedKey(clickedKey);
              setSelectedLabel(clickedLabel);
              setExportModalOpen(true);
            } else if (clickedKey === "phoneNumberAdded") {
              setSelectedKey(clickedKey);
              setSelectedLabel(clickedLabel);
              setExportPhoneModalOpen(true);
            }
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

      // Value INSIDE bar
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

      // Label OUTSIDE (left)
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

      // ✅ Tooltip: show "Name: Value"
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
          title: {
            formatter: () => "",
          },
        },
      },

      legend: { show: false },
      title: { text: "Free Trial Started Funnel", align: "center" },

      customActualValues: [],
      customKeys: [],
      customLabels: [],
    },
  });

  // Update chart when merged data changes
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
        customLabels: categories,
      },
    }));
  }, [categories, actualValues, keys]);

  const anyLoading = isLoading || loadingDataCount;
  const anyError = error || dataCountError;

  return (
    <>
      {anyLoading ? (
        <Skeleton variant="rectangular" width={"100%"} height={360} />
      ) : anyError ? (
        <div>Failed to load data.</div>
      ) : (
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={360}
        />
      )}

      <ExportChildDetailsData
        exportModalOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        selectedLabel={selectedLabel}
        filterDate={filterDate}
        startDate={startDate}
        endDate={endDate}
      />

      <ExportPhoneNumberDetails
        exportModalOpen={exportPhoneModalOpen}
        onClose={() => setExportPhoneModalOpen(false)}
        selectedLabel={selectedLabel}
        filterDate={filterDate}
        startDate={startDate}
        endDate={endDate}
      />

      {/* ✅ Export Confirm Modal */}
      {/* <Modal open={exportModalOpen} onClose={() => setExportModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Export Data
          </Typography>

          <Typography sx={{ mb: 2 }}>
            Are you sure you want to export data for{" "}
            <b>{selectedLabel || "Child Details"}</b>?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setExportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConfirmExport}>
              Yes, Export
            </Button>
          </Box>
        </Box>
      </Modal> */}
    </>
  );
};

export default UserJourneyForcedFunnel;

import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Skeleton } from "@mui/material";
import {
  useGetABFunnelMetricsMutation,
  useGetPosthogEventCountMutation,
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

// ✅ Updated to match new API response keys
const FUNNEL_ORDER_A_BUILD = [
  "signup",
  "childDetails",
  "phoneNumberAdded",
  "freeTrialsClicked",
  "freeTrialSuccess",
  "subscriptionCancelled",
  "due",
  "subscriptionSuccess",
  "pending",
  "halted",
];

const FUNNEL_ORDER_B_BUILD = [
  "signup",
  "freeTrialsClicked",
  "freeTrialInterstitial", // ← new posthog step
  "freeTrialSuccess",
  "subscriptionCancelled",
  "due",
  "subscriptionSuccess",
  "pending",
  "halted",
];

const LABEL_MAP = {
  signup: "Google Signup",
  childDetails: "Child Details Added",
  phoneNumberAdded: "Phone Number Added",
  freeTrialsClicked: "Free Trial Clicked",
  freeTrialSuccess: "Free Trial Started",
  subscriptionCancelled: "Subscription Cancelled",
  due: "Sub Due After 7 Days",
  subscriptionSuccess: "Subscription Success",
  pending: "Subscription Pending",
  halted: "Subscription Halted",
  freeTrialInterstitial: "Mandate Info Page Clicked", // ← new
};

const AFunnelMetrics = ({ filterDate, startDate, endDate, build, data }) => {
  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetABFunnelMetricsMutation();

  console.log(data);

  const [
    postHogDataEvent,
    {
      isLoading: loadingPostHogData,
      error: postHogDataError,
      data: postHogData,
    },
  ] = useGetPosthogEventCountMutation();

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportPhoneModalOpen, setExportPhoneModalOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const formData = new FormData();
    const posthogFormData = new FormData(); // separate FormData without ABTesting

    if (filterDate !== "custom") {
      formData.append("FilterType", filterDate);
      formData.append("ABTesting", build);
      posthogFormData.append("FilterType", filterDate);
      postDashboardData(formData);
      postHogDataEvent(posthogFormData);
      return;
    }

    if (filterDate === "custom" && startDate && endDate) {
      formData.append("FilterType", filterDate);
      formData.append("ABTesting", build);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));

      posthogFormData.append("FilterType", filterDate);
      posthogFormData.append("FromDate", formatDateToReadableString(startDate));
      posthogFormData.append("ToDate", formatDateToReadableString(endDate));

      postDashboardData(formData);
      postHogDataEvent(posthogFormData);
    }
  }, [filterDate, startDate, endDate, postDashboardData, postHogDataEvent]);

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

  // Now built solely from DashboardData
  // 3. In the mergedMap useMemo — inject the posthog count under the new key
  // const mergedMap = useMemo(() => {
  //   const map = {};
  //   const obj = DashboardData?.data ?? {};
  //   Object.keys(obj).forEach((k) => {
  //     const v = obj[k];
  //     map[k] = typeof v === "number" ? v : 0;
  //   });

  //   // Inject posthog event count for Build B's interstitial step
  //   if (postHogData?.count !== undefined) {
  //     map["freeTrialInterstitial"] = postHogData.count;
  //   }

  //   return map;
  // }, [DashboardData, postHogData]);

  const mergedMap = useMemo(() => {
    const map = {};
    const obj = DashboardData?.data ?? {};
    Object.keys(obj).forEach((k) => {
      const v = obj[k];
      map[k] = typeof v === "number" ? v : 0;
    });

    // ✅ Use data prop instead of postHogData for freeTrialInterstitial
    const mandateEvent = data?.find(
      (e) => e.eventName === "mandate_page_clicked",
    );
    map["freeTrialInterstitial"] = mandateEvent?.eventCount ?? 0;

    return map;
  }, [DashboardData, data]); // ✅ replace postHogData with data in deps

  const { keys, categories, actualValues } = useMemo(() => {
    const keys =
      build === 1
        ? FUNNEL_ORDER_A_BUILD
        : build === 2
          ? FUNNEL_ORDER_B_BUILD
          : FUNNEL_ORDER_A_BUILD;
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
        events: {
          dataPointSelection: function (_event, _chartContext, config) {
            const idx = config?.dataPointIndex;
            if (idx === undefined || idx === null || idx < 0) return;

            const clickedKey = config.w.config.customKeys?.[idx];
            const clickedLabel = config.w.config.customLabels?.[idx] ?? "";

            // if (clickedKey === "childDetails") {
            //   setSelectedKey(clickedKey);
            //   setSelectedLabel(clickedLabel);
            //   setExportModalOpen(true);
            // } else if (clickedKey === "phoneNumberAdded") {
            //   setSelectedKey(clickedKey);
            //   setSelectedLabel(clickedLabel);
            //   setExportPhoneModalOpen(true);
            // }
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
      title: {
        text:
          build === 1
            ? "Free Trial Started Funnel Build A"
            : build === 2
              ? "Free Trial Started Funnel Build B"
              : "Free Trial Started Funnel",
        align: "center",
      },
      customActualValues: [],
      customKeys: [],
      customLabels: [],
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
        customLabels: categories,
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
    </>
  );
};

export default AFunnelMetrics;

import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MailIcon from "@mui/icons-material/Mail";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShareIcon from "@mui/icons-material/Share";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useGetDashboardSummaryMutation } from "../../redux/slices/apiSlice";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import ChildCareIcon from "@mui/icons-material/ChildCare";

const DashboardSummary = ({ date, startDate, endDate, plan, platform }) => {
  const [data, setData] = useState([]);

  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetDashboardSummaryMutation();

  useEffect(() => {
    if (date !== "custom") {
      const formData = new FormData();
      formData.append("FilterType", date);
      formData.append("SubPlan", plan);
      if (platform !== 4) {
        formData.append("platform", platform);
      }
      postDashboardData(formData);
    } else if (date === "custom" && startDate && endDate) {
      const formattedStart = formatDateToReadableString(startDate);
      const formattedEnd = formatDateToReadableString(endDate);

      const formData = new FormData();
      formData.append("FilterType", date);
      formData.append("FromDate", formattedStart);
      formData.append("ToDate", formattedEnd);

      postDashboardData(formData);
    }
  }, [date, startDate, endDate, plan, platform]);

  useEffect(() => {
    if (DashboardData && DashboardData?.status === true) {
      setData([
        {
          title: "Registered Users",
          size: 4,
          value: DashboardData?.data?.registeredUsersCount,
          icon: <PeopleIcon sx={{ fontSize: 40, color: "#5f2eff" }} />,
          color: "#edf2fe",
          valueColor: "#2f74ff",
        },
        {
          title: "Subscribed Users",
          size: 4,
          value: DashboardData?.data?.subscribedUsersCount,
          icon: <BusinessCenterIcon sx={{ fontSize: 40, color: "#ff9900" }} />,
          color: "#fff6e6",
          valueColor: "#ff9900",
        },
        {
          title: "Non-subscribed Users",
          size: 4,
          value: DashboardData?.data?.nonSubscribedUsersCount,
          icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />,
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Total Children Added",
          size: 3,
          value: DashboardData?.data?.totalChildrenCount,
          icon: <ChildCareIcon sx={{ fontSize: 40, color: "#ec007d" }} />,
          color: "#feedf6",
          valueColor: "#ec007d",
        },
        {
          title: "Reports Generated (Lifetime)",
          size: 3,
          value: DashboardData?.data?.generatedReports,
          icon: <AutorenewIcon sx={{ fontSize: 40, color: "#c700c7" }} />,
          color: "#feedfe",
          valueColor: "#c700c7",
        },
        {
          title: "Total Revenue",
          size: 6,
          value: `₹ ${DashboardData?.data?.totalDomesticRevenueSum} Domestic | $ ${DashboardData?.data?.totalInternationalRevenueSum} International`,
          icon: (
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#00c292" }} />
          ),
          color: "#e6fff9",
          valueColor: "#00c292",
        },
        // {
        //   title: "Average Child Added",
        //   size: 3,
        //   value: DashboardData?.data?.studentCountperUser,
        //   icon: <MailIcon sx={{ fontSize: 40, color: "#1fb6ff" }} />,
        //   color: "#e6f6ff",
        //   valueColor: "#1fb6ff",
        // },
        // {
        //   title: "Upgraded Plans",
        //   size: 3,
        //   value: DashboardData?.data?.upgradedPlanUsers,
        //   icon: <UpgradeIcon sx={{ fontSize: 40, color: "#c700c7" }} />,
        //   color: "#feedfe",
        //   valueColor: "#c700c7",
        // },
        // {
        //   title: "Renewed Plans",
        //   size: 3,
        //   value: DashboardData?.data?.upgradedPlanUsers,
        //   icon: <AutorenewIcon sx={{ fontSize: 40, color: "#c700c7" }} />,
        //   color: "#feedfe",
        //   valueColor: "#c700c7",
        // },
        // {
        //   title: "Plans Bought",
        //   size: 6,
        //   value: `₹${DashboardData?.data?.totalDomesticRevenue} Basic | ${DashboardData?.data?.totalInternationalRevenue} Pro`,
        //   icon: (
        //     <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#00c292" }} />
        //   ),
        //   color: "#e6fff9",
        //   valueColor: "#00c292",
        // },
      ]);
    }
  }, [DashboardData]);

  if (isLoading) return <>loading...</>;

  if (error) return <>something went wrong!</>;

  return (
    <Grid container mb={4} spacing={2}>
      {data?.map((card, index) => (
        <Grid size={card?.size} key={index}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: card.color,
              p: 2,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <Box mb={1}>{card.icon}</Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              {card.title}
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: card.valueColor, fontWeight: "bold" }}
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardSummary;

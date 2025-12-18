import { useEffect, useState } from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MailIcon from "@mui/icons-material/Mail";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShareIcon from "@mui/icons-material/Share";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  useGetActiveUserMetricsQuery,
  useGetDashboardSummaryMutation,
} from "../../redux/slices/apiSlice";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import {
  formatDateToReadableString,
  useFormattedDate,
} from "../../utils/Hooks";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { useNavigate } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PaymentIcon from "@mui/icons-material/Payment";

const DashboardSummary = ({ date, startDate, endDate, plan, platform }) => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);

  const [postDashboardData, { isLoading, error, data: DashboardData }] =
    useGetDashboardSummaryMutation();

  const { data: userActiveData, isLoading: userActiveDataLoading } =
    useGetActiveUserMetricsQuery();

  console.log(userActiveData);

  useEffect(() => {
    if (userActiveData && userActiveData?.status === true) {
      setUserData([
        {
          title: "Daily Active Users",
          size: 4,
          value: userActiveData?.data?.dau,
          icon: <PeopleIcon sx={{ fontSize: 40, color: "#E91E63" }} />, // vibrant pink
          color: "#FFE4EC",
          valueColor: "#E91E63",
        },
        {
          title: "Weekly Active Users",
          size: 4,
          value: userActiveData?.data?.wau,
          icon: <PeopleIcon sx={{ fontSize: 40, color: "#E91E63" }} />, // vibrant pink
          color: "#FFE4EC",
          valueColor: "#E91E63",
        },
        {
          title: "Monthly Active Users",
          size: 4,
          value: userActiveData?.data?.mau,
          icon: <PeopleIcon sx={{ fontSize: 40, color: "#E91E63" }} />, // vibrant pink
          color: "#FFE4EC",
          valueColor: "#E91E63",
        },
      ]);
    }
  }, [userActiveData]);

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
          title: "Google Sign-In Users (from 26th June)",
          size: 4,
          value: DashboardData?.data?.googleSignInCount,
          icon: <SendToMobileIcon sx={{ fontSize: 40, color: "#E91E63" }} />, // vibrant pink
          color: "#FFE4EC", // light pink background
          valueColor: "#E91E63", // main pink
        },
        {
          title: "Razorpay Free Trial Users",
          size: 4,
          value: DashboardData?.data?.razorpayFreeTrial,
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
        // {
        //   title: "Cash Free Trial Started",
        //   size: 4,
        //   value: DashboardData?.data?.freeTrialEnded,
        //   icon: (
        //     <HourglassDisabledIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />
        //   ), // vibrant pink
        //   color: "#fff0ed",
        //   valueColor: "#ff4d4d",
        // },
        {
          title: "Free Trial Started Count",
          size: 2.4,
          value: DashboardData?.data?.freeTrialStartedCount,
          icon: (
            <PlayCircleOutlineIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />
          ), // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Subscription Due Count",
          size: 2.4,
          value: DashboardData?.data?.subscriptionDueCount,
          icon: (
            <ProductionQuantityLimitsIcon
              sx={{ fontSize: 40, color: "#ff4d4d" }}
            />
          ), // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Subscription Started Count",
          size: 2.4,
          value: DashboardData?.data?.subscriptionStartedCount,
          icon: <ShoppingBasketIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />, // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Subscription Cancelled Count",
          size: 2.4,
          value: DashboardData?.data?.subscriptionCancelledCount,
          icon: (
            <CancelPresentationIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />
          ), // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Subscription Renewed Count",
          size: 2.4,
          value: DashboardData?.data?.subscriptionRenewedCount,
          icon: <PaymentIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />, // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },

        // {
        //   title: "Google Sign-In Conversion (from 26th June)",
        //   size: 4,
        //   value: `${DashboardData?.data?.googleSignInConvertion}%` || 0,
        //   icon: <MobileFriendlyIcon sx={{ fontSize: 40, color: "#c700c7" }} />,
        //   color: "#feedfe",
        //   valueColor: "#c700c7",
        // },
        // {
        //   title: "Renewed Subscribed Users",
        //   size: 4,
        //   value: `${DashboardData?.data?.renewedSubscribedUsersCount} `,
        //   icon: <AutorenewIcon sx={{ fontSize: 40, color: "#c700c7" }} />,
        //   color: "#feedfe",
        //   valueColor: "#c700c7",
        // },
        // {
        //   title: "Due For Renewal Users",
        //   size: 4,
        //   value: `${DashboardData?.data?.renewalDueUsersCount}`,
        //   icon: <AutorenewIcon sx={{ fontSize: 40, color: "#c700c7" }} />,
        //   color: "#feedfe",
        //   valueColor: "#c700c7",
        // },
        // {
        //   title: "Drop Offs After Sign In",
        //   size: 4,
        //   value: DashboardData?.data?.dropOffsAfterSignIn,
        //   icon: <ArrowDownwardIcon sx={{ fontSize: 40, color: "#1fb6ff" }} />,
        //   color: "#e6f6ff",
        //   valueColor: "#1fb6ff",
        // },
        {
          title: "Total Children Added",
          size: 6,
          value: DashboardData?.data?.totalChildrenCount,
          icon: <ChildCareIcon sx={{ fontSize: 40, color: "#ec007d" }} />,
          color: "#feedf6",
          valueColor: "#ec007d",
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
        //   title: "Play Services Started",
        //   size: 6,
        //   value: DashboardData?.data?.freeTrialStarted,
        //   icon: <CardGiftcardIcon sx={{ fontSize: 40, color: "#5f2eff" }} />, // vibrant pink
        //   color: "#edf2fe",
        //   valueColor: "#2f74ff",
        // },
        // {
        //   title: "Non-subscribed Users",
        //   size: 2.3,
        //   value: DashboardData?.data?.nonSubscribedUsersCount,
        //   icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />,
        //   color: "#fff0ed",
        //   valueColor: "#ff4d4d",
        // },
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

  const navigate = useNavigate();

  if (isLoading)
    return (
      <Grid container mb={4} spacing={2}>
        <Grid size={4}>
          <Skeleton variant="rounded" width={"100%"} height={150} />
        </Grid>
        <Grid size={4}>
          <Skeleton variant="rounded" width={"100%"} height={150} />
        </Grid>
        <Grid size={4}>
          <Skeleton variant="rounded" width={"100%"} height={150} />
        </Grid>
        <Grid size={3}>
          <Skeleton variant="rounded" width={"100%"} height={150} />
        </Grid>
        <Grid size={3}>
          <Skeleton variant="rounded" width={"100%"} height={150} />
        </Grid>
        <Grid size={6}>
          <Skeleton variant="rounded" width={"100%"} height={150} />
        </Grid>
      </Grid>
    );

  if (error)
    return (
      <Typography variant="body2" color="error" mb={4}>
        Error loading dashboard summary data.
      </Typography>
    );

  return (
    <>
      <Grid container mb={2} spacing={2}>
        {data?.map((card, index) => {
          const isSubscribedCard = card.title === "Subscribed Users";
          const isDropOffCard = card.title === "Drop Offs After Sign In";
          const freeTrial = card.title === "Play Services Started";
          const freeTrialEnded = card.title === "Cash Free Trial Started";
          const domesticRevenue = card.title === "Total Revenue";
          const razorpayFreeTiral = card.title === "Razorpay Free Trial Users";
          const freeTrialStartedCount =
            card.title === "Free Trial Started Count";
          const subscriptionDueCount = card.title === "Subscription Due Count";
          const subscriptionStartedCount =
            card.title === "Subscription Started Count";
          const subscriptionCancelledCount =
            card.title === "Subscription Cancelled Count";
          const subscriptionRenewedCount =
            card.title === "Subscription Renewed Count";

          const isClickable =
            isSubscribedCard ||
            isDropOffCard ||
            freeTrial ||
            freeTrialEnded ||
            domesticRevenue ||
            razorpayFreeTiral ||
            freeTrialStartedCount ||
            subscriptionDueCount ||
            subscriptionStartedCount ||
            subscriptionCancelledCount ||
            subscriptionRenewedCount;

          const handleClick = () => {
            if (isSubscribedCard) navigate("/dashboard/students");
            else if (isDropOffCard) navigate("/dashboard/UnsubscribedUsers");
            else if (freeTrial) navigate("/dashboard/free-trial-started");
            else if (freeTrialEnded)
              navigate("/dashboard/cash-free-trial-started");
            else if (domesticRevenue) navigate("/dashboard/domestic-revenue");
            else if (razorpayFreeTiral)
              navigate("/dashboard/razor-pay-free-trial");
            else if (freeTrialStartedCount)
              navigate("/dashboard/subscription");
            else if (subscriptionDueCount)
              navigate("/dashboard/subscription");
            else if (subscriptionStartedCount)
              navigate("/dashboard/subscription");
            else if (subscriptionCancelledCount)
              navigate("/dashboard/subscription");
            else if (subscriptionRenewedCount)
              navigate("/dashboard/subscription");
          };

          const content = (
            <Paper
              elevation={0}
              sx={{
                backgroundColor: card.color,
                p: 2,
                textAlign: "center",
                borderRadius: 2,
                transition: "transform 0.2s ease-in-out",
                "&:hover": isClickable ? { transform: "scale(1.03)" } : {},
                cursor: isClickable ? "pointer" : "default",
              }}
            >
              <Box mb={1}>{card.icon}</Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500 }}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const titlesToBreak = [
                      "Free Trial Started Count",
                      "Subscription Due Count",
                      "Subscription Started Count",
                      "Subscription Cancelled Count",
                      "Subscription Renewed Count",
                    ];

                    if (titlesToBreak.includes(card.title)) {
                      return card.title
                        .replace(/ Count$/, "<br />Count")
                        .replace(/ Due /, "<br />Due ")
                        .replace(/ Started /, "<br />Started ")
                        .replace(/ Cancelled /, "<br />Cancelled ")
                        .replace(/ Renewed /, "<br />Renewed ");
                    }

                    return card.title;
                  })(),
                }}
              />

              <Typography
                variant="h5"
                sx={{ color: card.valueColor, fontWeight: "bold" }}
              >
                {card.value}
              </Typography>
            </Paper>
          );

          return (
            <Grid size={card?.size} key={index}>
              {isClickable ? (
                <Box onClick={handleClick}>{content}</Box>
              ) : (
                content
              )}
            </Grid>
          );
        })}
      </Grid>
      {/* Active User Metrics Section */}
      {userData.length > 0 && (
        <Grid container spacing={2} mb={2}>
          {userData.map((card, index) => {
            const content = (
              <Paper
                elevation={0}
                sx={{
                  backgroundColor: card.color,
                  p: 2,
                  textAlign: "center",
                  borderRadius: 2,
                  transition: "transform 0.2s ease-in-out",
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
            );

            return (
              <Grid size={card.size} key={index}>
                {content}
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default DashboardSummary;

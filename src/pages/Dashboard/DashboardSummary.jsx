import { useEffect, useState } from "react";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  useGetDashboardSummaryMutation,
} from "../../redux/slices/apiSlice";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import {
  formatDateToReadableString,
} from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

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

  const formatInternationalRevenue = (revenueObj) => {
    // null / undefined / not an object
    if (!revenueObj || typeof revenueObj !== "object") return "0";

    // empty object {}
    if (Object.keys(revenueObj).length === 0) return "0";

    return Object.entries(revenueObj)
      .map(([currency, data]) => `${currency} ${data?.sum ?? 0}`)
      .join(", ");
  };

  useEffect(() => {
    if (DashboardData && DashboardData?.status === true) {
      setData([
        {
          title: "Google Sign-In Users (from 26th June)",
          size: 4,
          value: DashboardData?.data?.googleSignInCount,
          icon: <SendToMobileIcon sx={{ fontSize: 40, color: "#E91E63" }} />, // vibrant pink
          color: "#FFE4EC",
          valueColor: "#E91E63",
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
          size: 2,
          value: DashboardData?.data?.freeTrialStartedCount,
          icon: (
            <PlayCircleOutlineIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />
          ), // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Subscription Due Count",
          size: 2,
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
          title: "Subscription Due Today Count (includes pending)",
          size: 2,
          value: DashboardData?.data?.subscriptionDueToday,
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
          size: 2,
          value: DashboardData?.data?.subscriptionStartedCount,
          icon: <ShoppingBasketIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />, // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Subscription Cancelled Count",
          size: 2,
          value: DashboardData?.data?.subscriptionCancelledCount,
          icon: (
            <CancelPresentationIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />
          ), // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        {
          title: "Free Trial Cancelled Count Same Day",
          size: 2,
          value: DashboardData?.data?.subscriptionCancelledSameDayCount,
          icon: (
            <CancelPresentationIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />
          ), // vibrant pink
          color: "#fff0ed",
          valueColor: "#ff4d4d",
        },
        // {
        //   title: "Subscription Renewed Count",
        //   size: 2,
        //   value: DashboardData?.data?.subscriptionRenewedCount,
        //   icon: <PaymentIcon sx={{ fontSize: 40, color: "#ff4d4d" }} />, // vibrant pink
        //   color: "#fff0ed",
        //   valueColor: "#ff4d4d",
        // },

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
        // {
        //   title: "Total Children Added",
        //   size: 6,
        //   value: DashboardData?.data?.totalChildrenCount,
        //   icon: <ChildCareIcon sx={{ fontSize: 40, color: "#ec007d" }} />,
        //   color: "#feedf6",
        //   valueColor: "#ec007d",
        // },
        {
          title: "Total Revenue Domestic",
          size: 6,
          value: `₹ ${DashboardData?.data?.totalDomesticRevenueSum} Domestic`,
          icon: (
            <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "#00c292" }} />
          ),
          color: "#e6fff9",
          valueColor: "#00c292",
        },
        {
          title: "Total Revenue International",
          size: 6,
          value: formatInternationalRevenue(
            DashboardData?.data?.internationalRevenueByCurrency,
          ),
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
          const domesticRevenue = card.title === "Total Revenue Domestic";
          const domesticInternational =
            card.title === "Total Revenue International";
          const razorpayFreeTiral = card.title === "Razorpay Free Trial Users";
          const freeTrialStartedCount =
            card.title === "Free Trial Started Count";
          const subscriptionDueCount = card.title === "Subscription Due Count";
          const subscriptionDueCountToday =
            card.title === "Subscription Due Today Count (includes pending)";
          const subscriptionStartedCount =
            card.title === "Subscription Started Count";
          const subscriptionCancelledCount =
            card.title === "Subscription Cancelled Count";
          const subscriptionRenewedCount =
            card.title === "Subscription Renewed Count";
          const subscriptionCancelledCountSameDay =
            card.title === "Free Trial Cancelled Count Same Day";

          const isClickable =
            isSubscribedCard ||
            isDropOffCard ||
            freeTrial ||
            freeTrialEnded ||
            domesticRevenue ||
            domesticInternational ||
            razorpayFreeTiral ||
            freeTrialStartedCount ||
            subscriptionDueCount ||
            subscriptionDueCountToday ||
            subscriptionStartedCount ||
            subscriptionCancelledCount ||
            subscriptionRenewedCount ||
            subscriptionCancelledCountSameDay;

          const handleClick = () => {
            if (isSubscribedCard) navigate("/subscribed-users");
            else if (isDropOffCard) navigate("/UnsubscribedUsers");
            else if (freeTrial) navigate("/free-trial-started");
            else if (freeTrialEnded)
              navigate("/cash-free-trial-started");
            else if (domesticRevenue) navigate("/domestic-revenue");
            else if (domesticInternational)
              navigate("/international-revenue");
            else if (razorpayFreeTiral)
              navigate("/razor-pay-free-trial-users");
            else if (freeTrialStartedCount) navigate("/subscription-status");
            else if (subscriptionDueCount) navigate("/subscription-status");
            else if (subscriptionDueCountToday)
              navigate("/subscription-status");
            else if (subscriptionStartedCount)
              navigate("/subscription-status");
            else if (subscriptionCancelledCount)
              navigate("/subscription-status");
            else if (subscriptionRenewedCount)
              navigate("/subscription-status");
            else if (subscriptionCancelledCountSameDay)
              navigate("/subscription-status");
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
    </>
  );
};

export default DashboardSummary;

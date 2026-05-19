// import DashboardIcon from "@mui/icons-material/Dashboard";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import ChildCareIcon from "@mui/icons-material/ChildCare";
// import InfoIcon from "@mui/icons-material/Info";
// import PeopleIcon from "@mui/icons-material/People";
// import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
// import ListAltIcon from "@mui/icons-material/ListAlt";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
// import LocationCityIcon from "@mui/icons-material/LocationCity";
// import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
// import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
// import ExtensionIcon from "@mui/icons-material/Extension";
// import AssignmentIcon from "@mui/icons-material/Assignment";

// export const SideBarRoutes = [
//   { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
//   {
//     title: "Funnel Metrics A/B",
//     path: "/funnel-metrics",
//     icon: <BarChartIcon />,
//   },
//   {
//     title: "Funnel Metrics Old",
//     path: "/funnel-metrics-old",
//     icon: <BarChartIcon />,
//   },
//   {
//     title: "Funnel Metrics A/B (P.G)",
//     path: "/payment-funnel",
//     icon: <BarChartIcon />,
//   },
//   {
//     title: "Subscribed Users",
//     path: "/subscribed-users",
//     icon: <ChildCareIcon />,
//   },
//   {
//     title: "Subscription Status",
//     path: "/subscription-status",
//     icon: <InfoIcon />,
//   },
//   {
//     title: "Free Trial Users",
//     path: "/razor-pay-free-trial-users",
//     icon: <PeopleIcon />,
//   },
//   {
//     title: "User Coupon Report",
//     path: "/user-coupon-report",
//     icon: <AssignmentIcon />,
//   },
//   // {
//   //   title: "Play Services Started",
//   //   path: "/play-services-started",
//   //   icon: <CardGiftcardIcon />,
//   // },
//   {
//     title: "User Buckets",
//     path: "/user-buckets",
//     icon: <ListAltIcon />,
//   },
//   { title: "Call Center Report", path: "/reports", icon: <AssignmentIcon /> },
//   {
//     title: "Manage Admin",
//     path: "/manage-admin",
//     icon: <GroupAddIcon />,
//   },
//   {
//     title: "Manage Permission",
//     path: "/manage-permission",
//     icon: <GroupAddIcon />,
//   },
//   {
//     title: "Domestic Revenue",
//     path: "/domestic-revenue",
//     icon: <AccountBalanceWalletIcon />,
//   },
//   {
//     title: "International Revenue",
//     path: "/international-revenue",
//     icon: <AccountBalanceWalletIcon />,
//   },
//   {
//     title: "Non Subscribed Users",
//     path: "/non-subscribed-users",
//     icon: <UnsubscribeIcon />,
//   },
//   {
//     title: "Location Analytics",
//     path: "/location-analytics",
//     icon: <LocationCityIcon />,
//   },
//   {
//     title: "Push Notification",
//     path: "/push-notification",
//     icon: <SupervisedUserCircleIcon />,
//   },
//   {
//     title: "Games",
//     path: "/games",
//     icon: <SportsEsportsIcon />,
//   },
//   {
//     title: "Manage Games",
//     path: "/manage-games",
//     icon: <ExtensionIcon />,
//   },
//   // { title: "Category", path: "/category", icon: <CategoryIcon /> },
//   // {
//   //   title: "Manage Content",
//   //   path: "/dashboard/content",
//   //   icon: <EditNoteIcon />,
//   // },
//   // {
//   //   title: "Manage Users",
//   //   path: "/dashboard/manage-users",
//   //   icon: <GroupIcon />,
//   // },
//   // {
//   //   title: "Help Desk",
//   //   path: "/dashboard/help-desk",
//   //   icon: <HelpIcon />,
//   // },
//   // {
//   //   title: "Free Trial Ended",
//   //   path: "/dashboard/free-trial-ended",
//   //   icon: <HourglassDisabledIcon />,
//   // },
//   // {
//   //   title: "Cash Free Trial Started",
//   //   path: "/dashboard/cash-free-trial-started",
//   //   icon: <HourglassDisabledIcon />,
//   // },
//   // { title: 'Users', path: '/dashboard/users', icon: <GroupIcon /> },
//   // { title: 'Achievement', path: '/dashboard/achievement', icon: <EmojiEventsIcon /> },
//   // { title: 'Age Group', path: '/dashboard/age-group', icon: <GroupsIcon /> },
//   // { title: 'Subscription', path: '/dashboard/subscription', icon: <CurrencyExchangeIcon /> },
//   // { title: 'Admin Manager', path: '/dashboard/admin-manager', icon: <ManageAccountsIcon /> },
//   // { title: 'Logs', path: '/dashboard/logs', icon: <FileCopyIcon /> },
//   // { title: 'Notification', path: '/dashboard/notification', icon: <NotificationsActiveIcon /> },
// ];

import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ExtensionIcon from "@mui/icons-material/Extension";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import Dashboard from "../pages/Dashboard/Dashboard";
import Students from "../pages/Students/Students";
import Subscription from "../pages/Subscription/Subscription";
import AdminManager from "../pages/AdminManager/AdminManager";
import Retention from "../pages/Retention/Retention";
import Games from "../pages/Games/Games";
import UnsubscribedUsers from "../pages/UnsubscribedUsers/UnsubscribedUsers";
import TopRegion from "../pages/TopRegion/TopRegion";
import Funnel from "../pages/Funnel/Funnel";
import FunnelOld from "../pages/Funnel/FunnelOld";
import PaymentFunnel from "../pages/Funnel/PaymentFunnel";
import GamesList from "../pages/GamesList/GamesList";
import ViewGame from "../pages/GamesList/ViewGame";
import AddGamesCategory from "../pages/GamesList/AddGamesCategory";
import AddGames from "../pages/GamesList/AddGames";
import DomesticRevenue from "../pages/TotalRevenue/DomesticRevenue";
import InternationalRevenue from "../pages/TotalRevenue/InternationalRevenue";
import CashFree from "../pages/CashFree/CashFree";
import RazorpayFreeTrial from "../pages/RazorpayFreeTrial/RazorpayFreeTrial";
import ManagePermission from "../pages/ManagePermission/ManagePermission";
import SalesCommandCenter from "../pages/bucket/UserBucketsNew";
import Reports from "../pages/Reports/Reports";
import UserCouponReport from "../pages/UserCouponReport/UserCouponReport";

export const SideBarRoutes = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    component: Dashboard, // ✅ reference, not JSX
    showInSidebar: true,
  },
  {
    title: "Funnel Metrics A/B",
    path: "/funnel-metrics",
    icon: <BarChartIcon />,
    component: Funnel,
    showInSidebar: true,
  },
  {
    title: "Funnel Metrics Old",
    path: "/funnel-metrics-old",
    icon: <BarChartIcon />,
    component: FunnelOld,
    showInSidebar: true,
  },
  {
    title: "Funnel Metrics A/B (P.G)",
    path: "/payment-funnel",
    icon: <BarChartIcon />,
    component: PaymentFunnel,
    showInSidebar: true,
  },
  {
    title: "Subscribed Users",
    path: "/subscribed-users",
    icon: <ChildCareIcon />,
    component: Students,
    showInSidebar: true,
  },
  {
    title: "Subscription Status",
    path: "/subscription-status",
    icon: <InfoIcon />,
    component: Subscription,
    showInSidebar: true,
  },
  {
    title: "Free Trial Users",
    path: "/razor-pay-free-trial-users",
    icon: <PeopleIcon />,
    component: RazorpayFreeTrial,
    showInSidebar: true,
  },
  {
    title: "User Coupon Report",
    path: "/user-coupon-report",
    icon: <AssignmentIcon />,
    component: UserCouponReport,
    showInSidebar: true,
  },
  {
    title: "User Buckets",
    path: "/user-buckets",
    icon: <ListAltIcon />,
    component: SalesCommandCenter,
    showInSidebar: true,
  },
  {
    title: "Call Center Report",
    path: "/reports",
    icon: <AssignmentIcon />,
    component: Reports,
    showInSidebar: true,
  },
  {
    title: "Manage Admin",
    path: "/manage-admin",
    icon: <GroupAddIcon />,
    component: AdminManager,
    showInSidebar: true,
  },
  {
    title: "Manage Permission",
    path: "/manage-permission",
    icon: <GroupAddIcon />,
    component: ManagePermission,
    showInSidebar: true,
  },
  {
    title: "Domestic Revenue",
    path: "/domestic-revenue",
    icon: <AccountBalanceWalletIcon />,
    component: DomesticRevenue,
    showInSidebar: true,
  },
  {
    title: "International Revenue",
    path: "/international-revenue",
    icon: <AccountBalanceWalletIcon />,
    component: InternationalRevenue,
    showInSidebar: true,
  },
  {
    title: "Non Subscribed Users",
    path: "/non-subscribed-users",
    icon: <UnsubscribeIcon />,
    component: UnsubscribedUsers,
    showInSidebar: true,
  },
  {
    title: "Location Analytics",
    path: "/location-analytics",
    icon: <LocationCityIcon />,
    component: TopRegion,
    showInSidebar: true,
  },
  {
    title: "Push Notification",
    path: "/push-notification",
    icon: <SupervisedUserCircleIcon />,
    component: Retention,
    showInSidebar: true,
  },
  {
    title: "Games",
    path: "/games",
    icon: <SportsEsportsIcon />,
    component: Games,
    showInSidebar: true,
  },
  {
    title: "Manage Games",
    path: "/manage-games",
    icon: <ExtensionIcon />,
    component: GamesList,
    showInSidebar: true,
  },
  // ── Child routes (not in sidebar) ─────────────────────────────────────
  {
    title: "Add Games Category",
    path: "/add-games-category",
    component: AddGamesCategory,
    showInSidebar: false,
    parentPath: "/manage-games",
  },
  {
    title: "Add Games",
    path: "/add-games/:id",
    component: AddGames,
    showInSidebar: false,
    parentPath: "/manage-games",
  },
  {
    title: "View Game",
    path: "/view-game/:id",
    component: ViewGame,
    showInSidebar: false,
    parentPath: "/manage-games",
  },
];

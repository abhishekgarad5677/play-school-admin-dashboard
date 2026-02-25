import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import InfoIcon from "@mui/icons-material/Info";
import PeopleIcon from "@mui/icons-material/People";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ExtensionIcon from "@mui/icons-material/Extension";

export const SideBarRoutes = [
  { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  {
    title: "Funnel Metrics",
    path: "/funnel-metrics",
    icon: <BarChartIcon />,
  },
  {
    title: "Subscribed Users",
    path: "/subscribed-users",
    icon: <ChildCareIcon />,
  },
  {
    title: "Subscription Status",
    path: "/subscription-status",
    icon: <InfoIcon />,
  },
  {
    title: "Razorpay Free Trial Users",
    path: "/razor-pay-free-trial-users",
    icon: <PeopleIcon />,
  },
  // {
  //   title: "Play Services Started",
  //   path: "/play-services-started",
  //   icon: <CardGiftcardIcon />,
  // },
  {
    title: "User Buckets",
    path: "/user-buckets",
    icon: <ListAltIcon />,
  },
  {
    title: "Manage Admin",
    path: "/manage-admin",
    icon: <GroupAddIcon />,
  },
  {
    title: "Manage Permission",
    path: "/manage-permission",
    icon: <GroupAddIcon />,
  },
  {
    title: "Domestic Revenue",
    path: "/domestic-revenue",
    icon: <AccountBalanceWalletIcon />,
  },
  {
    title: "International Revenue",
    path: "/international-revenue",
    icon: <AccountBalanceWalletIcon />,
  },
  {
    title: "Non Subscribed Users",
    path: "/non-subscribed-users",
    icon: <UnsubscribeIcon />,
  },
  {
    title: "Location Analytics",
    path: "/location-analytics",
    icon: <LocationCityIcon />,
  },
  {
    title: "Push Notification",
    path: "/push-notification",
    icon: <SupervisedUserCircleIcon />,
  },
  {
    title: "Games",
    path: "/games",
    icon: <SportsEsportsIcon />,
  },
  {
    title: "Manage Games",
    path: "/manage-games",
    icon: <ExtensionIcon />,
  },
  // { title: "Category", path: "/category", icon: <CategoryIcon /> },
  // {
  //   title: "Manage Content",
  //   path: "/dashboard/content",
  //   icon: <EditNoteIcon />,
  // },
  // {
  //   title: "Manage Users",
  //   path: "/dashboard/manage-users",
  //   icon: <GroupIcon />,
  // },
  // {
  //   title: "Help Desk",
  //   path: "/dashboard/help-desk",
  //   icon: <HelpIcon />,
  // },
  // {
  //   title: "Free Trial Ended",
  //   path: "/dashboard/free-trial-ended",
  //   icon: <HourglassDisabledIcon />,
  // },
  // {
  //   title: "Cash Free Trial Started",
  //   path: "/dashboard/cash-free-trial-started",
  //   icon: <HourglassDisabledIcon />,
  // },
  // { title: 'Users', path: '/dashboard/users', icon: <GroupIcon /> },
  // { title: 'Reports', path: '/dashboard/reports', icon: <AssignmentIcon /> },
  // { title: 'Achievement', path: '/dashboard/achievement', icon: <EmojiEventsIcon /> },
  // { title: 'Age Group', path: '/dashboard/age-group', icon: <GroupsIcon /> },
  // { title: 'Subscription', path: '/dashboard/subscription', icon: <CurrencyExchangeIcon /> },
  // { title: 'Admin Manager', path: '/dashboard/admin-manager', icon: <ManageAccountsIcon /> },
  // { title: 'Logs', path: '/dashboard/logs', icon: <FileCopyIcon /> },
  // { title: 'Notification', path: '/dashboard/notification', icon: <NotificationsActiveIcon /> },
];

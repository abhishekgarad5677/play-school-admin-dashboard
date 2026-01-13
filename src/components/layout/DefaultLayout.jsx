import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import logo from "../../../public/play-school-logo.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import HelpIcon from "@mui/icons-material/Help";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Tooltip } from "@mui/material";
import { ProfileAvatarMenu } from "../Avatar/ProfileAvatarMenu";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Reports from "../../pages/Reports/Reports";
import Dashboard from "../../pages/Dashboard/Dashboard";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import Students from "../../pages/Students/Students";
import Achievement from "../../pages/Achievement/Achievement";
import Category from "../../pages/Category/Category";
import AgeGroup from "../../pages/AgeGroup/AgeGroup";
import Content from "../../pages/Content/Content";
import Subscription from "../../pages/Subscription/Subscription";
import AdminManager from "../../pages/AdminManager/AdminManager";
// import Logs from "../../pages/Logs/Logs";
import Notification from "../../pages/Notification/Notification";
import AddCategory from "../../pages/Category/AddCategory";
import AddContent from "../../pages/Content/AddContent";
import Help from "../../pages/Help/Help";
import Retention from "../../pages/Retention/Retention";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import Games from "../../pages/Games/Games";
import UnsubscribeIcon from "@mui/icons-material/Unsubscribe";
import UnsubscribedUsers from "../../pages/UnsubscribedUsers/UnsubscribedUsers";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import TopRegion from "../../pages/TopRegion/TopRegion";
import Funnel from "../../pages/Funnel/Funnel";
import BarChartIcon from "@mui/icons-material/BarChart";
import GamesList from "../../pages/GamesList/GamesList";
import ExtensionIcon from "@mui/icons-material/Extension";
import ViewGame from "../../pages/GamesList/ViewGame";
import AddGamesCategory from "../../pages/GamesList/AddGamesCategory";
import AddGames from "../../pages/GamesList/AddGames";
import FreeTrialStarted from "../../pages/FreeTrialStarted/FreeTrialStarted";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import FreeTrialEnded from "../../pages/FreeTrialEnded/FreeTrialEnded";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DomesticRevenue from "../../pages/TotalRevenue/DomesticRevenue";
import InternationalRevenue from "../../pages/TotalRevenue/InternationalRevenue";
import CashFree from "../../pages/CashFree/CashFree";
import PeopleIcon from "@mui/icons-material/People";
import RazorpayFreeTrial from "../../pages/RazorpayFreeTrial/RazorpayFreeTrial";
import InfoIcon from "@mui/icons-material/Info";

const drawerWidth = 270;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function DefaultLayout() {
  const location = useLocation();
  // const isActive = location.pathname === ele.path;

  const acticeTabStyle = {
    backgroundColor: "#5d87ff",
    color: "#fff",
  };

  const acticeIconStyle = {
    color: "#fff",
  };

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navSectionOne = [
    { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    {
      title: "Funnel Metrics",
      path: "/dashboard/funnel",
      icon: <BarChartIcon />,
    },
    {
      title: "Subscribed Users",
      path: "/dashboard/students",
      icon: <ChildCareIcon />,
    },
    {
      title: "Subscription Status",
      path: "/dashboard/subscription",
      icon: <InfoIcon />,
    },
    {
      title: "Razorpay Free Trial Users",
      path: "/dashboard/razor-pay-free-trial",
      icon: <PeopleIcon />,
    },
    {
      title: "Play Services Started",
      path: "/dashboard/free-trial-started",
      icon: <CardGiftcardIcon />,
    },
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
    {
      title: "Domestic Revenue",
      path: "/dashboard/domestic-revenue",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      title: "International Revenue",
      path: "/dashboard/international-revenue",
      icon: <AccountBalanceWalletIcon />,
    },
    {
      title: "Non Subscribed Users",
      path: "/dashboard/UnsubscribedUsers",
      icon: <UnsubscribeIcon />,
    },
    {
      title: "Location Analytics",
      path: "/dashboard/top-cities",
      icon: <LocationCityIcon />,
    },
    // { title: "Category", path: "/dashboard/category", icon: <CategoryIcon /> },
    // {
    //   title: "Manage Content",
    //   path: "/dashboard/content",
    //   icon: <EditNoteIcon />,
    // },

    // {
    //   title: "Retention",
    //   path: "/dashboard/retention",
    //   icon: <SupervisedUserCircleIcon />,
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
    {
      title: "Games",
      path: "/dashboard/games",
      icon: <SportsEsportsIcon />,
    },
    {
      title: "Add Games",
      path: "/dashboard/games-list",
      icon: <ExtensionIcon />,
    },

    // { title: 'Users', path: '/dashboard/users', icon: <GroupIcon /> },
    // { title: 'Reports', path: '/dashboard/reports', icon: <AssignmentIcon /> },
    // { title: 'Achievement', path: '/dashboard/achievement', icon: <EmojiEventsIcon /> },
    // { title: 'Age Group', path: '/dashboard/age-group', icon: <GroupsIcon /> },
    // { title: 'Subscription', path: '/dashboard/subscription', icon: <CurrencyExchangeIcon /> },
    // { title: 'Admin Manager', path: '/dashboard/admin-manager', icon: <ManageAccountsIcon /> },
    // { title: 'Logs', path: '/dashboard/logs', icon: <FileCopyIcon /> },
    // { title: 'Notification', path: '/dashboard/notification', icon: <NotificationsActiveIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ boxShadow: "none", background: "#5d87ff" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {/* Admin Dashboard */}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <ProfileAvatarMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              paddingLeft: 1,
            }}
          >
            {open && (
              <img
                style={{ transition: "ease" }}
                src={logo}
                // src={
                //   "https://www.tmkocplayschool.com/assets/playSchool-logo-B4HeImJS.png"
                // }
                alt=""
                width={"40%"}
                height={"85"}
              />
            )}
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          {navSectionOne.map((ele, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={ele.path}
                sx={[
                  {
                    minHeight: 48,
                    margin: "0 10px",
                    borderRadius: "7px",
                    backgroundColor:
                      ele.path === location.pathname ? "#5d87ff" : "",
                    px: 2.5,
                  },
                  ele.path === location.pathname ? acticeTabStyle : null,
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    ele.path === location.pathname ? acticeIconStyle : null,
                    open
                      ? {
                          mr: 2,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {open ? (
                    ele.icon
                  ) : (
                    <Tooltip title={ele.title} arrow placement="right">
                      {ele.icon}
                    </Tooltip>
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={ele.title}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "auto",
          height: "100vh",
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari
          },
        }}
      >
        <DrawerHeader />
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="UnsubscribedUsers" element={<UnsubscribedUsers />} />
          <Route path="retention" element={<Retention />} />
          <Route path="help-desk" element={<Help />} />
          <Route path="games" element={<Games />} />
          <Route path="top-cities" element={<TopRegion />} />
          <Route path="funnel" element={<Funnel />} />
          <Route path="games-list" element={<GamesList />} />
          <Route path="add-games-category" element={<AddGamesCategory />} />
          <Route path="add-games/:id" element={<AddGames />} />
          <Route path="view-game/:id" element={<ViewGame />} />
          <Route path="free-trial-started" element={<FreeTrialStarted />} />
          <Route path="domestic-revenue" element={<DomesticRevenue />} />
          <Route
            path="international-revenue"
            element={<InternationalRevenue />}
          />
          <Route path="cash-free-trial-started" element={<CashFree />} />
          <Route path="razor-pay-free-trial" element={<RazorpayFreeTrial />} />
          <Route path="subscription" element={<Subscription />} />
          {/* <Route path="free-trial-ended" element={<FreeTrialEnded />} /> */}
          {/* <Route path="reports" element={<Reports />} /> */}
          {/* <Route path="achievement" element={<Achievement />} /> */}
          {/* <Route path="category" element={<Category />} /> */}
          {/* <Route path="add-category" element={<AddCategory />} /> */}
          {/* <Route path="age-group" element={<AgeGroup />} /> */}
          {/* <Route path="content" element={<Content />} /> */}
          {/* <Route path="add-content" element={<AddContent />} /> */}
          {/* <Route path="admin-manager" element={<AdminManager />} /> */}
          {/* <Route path="logs" element={<Logs />} /> */}
          {/* <Route path="notification" element={<Notification />} /> */}
        </Routes>
        <Typography
          variant="p"
          fontSize={12}
          mt={4}
          textAlign={"center"}
          color="#ccc"
          noWrap
          component="div"
        >
          Copyright © 2025 TMKOC Playschool. All Rights Reserved. <br />
          Powered by Neela Mediatech Private Limited
        </Typography>
      </Box>
    </Box>
  );
}

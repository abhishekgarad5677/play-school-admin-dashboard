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
import { Tooltip } from "@mui/material";
import { ProfileAvatarMenu } from "../Avatar/ProfileAvatarMenu";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Students from "../../pages/Students/Students";
import Subscription from "../../pages/Subscription/Subscription";
import AdminManager from "../../pages/AdminManager/AdminManager";
import Help from "../../pages/Help/Help";
import Retention from "../../pages/Retention/Retention";
import Games from "../../pages/Games/Games";
import UnsubscribedUsers from "../../pages/UnsubscribedUsers/UnsubscribedUsers";
import TopRegion from "../../pages/TopRegion/TopRegion";
import Funnel from "../../pages/Funnel/Funnel";
import GamesList from "../../pages/GamesList/GamesList";
import ViewGame from "../../pages/GamesList/ViewGame";
import AddGamesCategory from "../../pages/GamesList/AddGamesCategory";
import AddGames from "../../pages/GamesList/AddGames";
import FreeTrialStarted from "../../pages/FreeTrialStarted/FreeTrialStarted";
import DomesticRevenue from "../../pages/TotalRevenue/DomesticRevenue";
import InternationalRevenue from "../../pages/TotalRevenue/InternationalRevenue";
import CashFree from "../../pages/CashFree/CashFree";
import RazorpayFreeTrial from "../../pages/RazorpayFreeTrial/RazorpayFreeTrial";
import UserBuckets from "../../pages/bucket/UserBuckets";
import ManagePermission from "../../pages/ManagePermission/ManagePermission";
import { SideBarRoutes } from "../../utils/SideBarRoutes";
import { useSelector } from "react-redux";

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
  const user = useSelector((state) => state.auth.user); // Access the current user from Redux
  const isSuper = user?.isSuper;
  const permissions = user?.permissions || [];

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
            <Typography fontSize={16} fontWeight={500} noWrap component="div">
              Playschool Admin Dashboard
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
      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            overflow: "auto", // Enables scrolling
            "&::-webkit-scrollbar": {
              display: "none", // Hides scrollbar in Webkit browsers (Chrome, Safari)
            },
            msOverflowStyle: "none", // Hides scrollbar in Internet Explorer
            "scrollbar-width": "none", // Hides scrollbar in Firefox
          },
        }}
        variant="permanent"
        open={open}
      >
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
                alt="play-school-logo"
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
        {/* <List>
          {SideBarRoutes.map((ele, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={ele.path}
                sx={[
                  {
                    // minHeight: 10,
                    padding: "6px 0",
                    margin: "0 10px",
                    borderRadius: "7px",
                    backgroundColor:
                      ele.path === location.pathname ? "#5d87ff" : "",
                    px: 1.5,
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
                          mr: 1.5,
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
                  primary={
                    <Typography sx={{ fontSize: "14px" }}>
                      {ele.title}
                    </Typography>
                  }
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
        </List> */}
        <List>
          {(isSuper
            ? SideBarRoutes
            : SideBarRoutes.filter((route) => permissions.includes(route.path))
          ).map((ele, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={ele.path}
                sx={[
                  {
                    padding: "6px 0",
                    margin: "0 10px",
                    borderRadius: "7px",
                    backgroundColor:
                      ele.path === location.pathname ? "#5d87ff" : "",
                    px: 1.5,
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
                          mr: 1.5,
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
                  primary={
                    <Typography sx={{ fontSize: "14px" }}>
                      {ele.title}
                    </Typography>
                  }
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
          <Route index path="/dashboard" element={<Dashboard />} />
          <Route path="subscribed-users" element={<Students />} />
          <Route path="non-subscribed-users" element={<UnsubscribedUsers />} />
          <Route path="push-notification" element={<Retention />} />
          <Route path="help-desk" element={<Help />} />
          <Route path="games" element={<Games />} />
          <Route path="location-analytics" element={<TopRegion />} />
          <Route path="funnel-metrics" element={<Funnel />} />
          <Route path="manage-games" element={<GamesList />} />
          <Route path="add-games-category" element={<AddGamesCategory />} />
          <Route path="add-games/:id" element={<AddGames />} />
          <Route path="view-game/:id" element={<ViewGame />} />
          <Route path="domestic-revenue" element={<DomesticRevenue />} />
          <Route
            path="international-revenue"
            element={<InternationalRevenue />}
          />
          <Route path="cash-free-trial-started" element={<CashFree />} />
          <Route
            path="razor-pay-free-trial-users"
            element={<RazorpayFreeTrial />}
          />
          <Route path="subscription-status" element={<Subscription />} />
          <Route path="user-buckets" element={<UserBuckets />} />
          <Route path="manage-admin" element={<AdminManager />} />
          <Route path="manage-permission" element={<ManagePermission />} />
          <Route path="*" element={<h2>❌ Page Not Found</h2>} />
          {/* <Route path="play-services-started" element={<FreeTrialStarted />} /> */}
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

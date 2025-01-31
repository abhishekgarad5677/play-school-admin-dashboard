import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Users from '../../pages/Users/Users';
import logo from '../../../public/play-school-logo.png'
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CategoryIcon from '@mui/icons-material/Category';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Tooltip } from '@mui/material';
import { ProfileAvatarMenu } from '../Avatar/ProfileAvatarMenu';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Reports from '../../pages/Reports/Reports';
import Dashboard from '../../pages/Dashboard/Dashboard';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import Students from '../../pages/Students/Students';
import Achievement from '../../pages/Achievement/Achievement';
import Category from '../../pages/Category/Category';
import AgeGroup from '../../pages/AgeGroup/AgeGroup';
import Content from '../../pages/Content/Content';
import Subscription from '../../pages/Subscription/Subscription';
import AdminManager from '../../pages/AdminManager/AdminManager';
import Logs from '../../pages/Logs/Logs';
import Notification from '../../pages/Notification/Notification';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function DefaultLayout() {
  const location = useLocation();
  // const isActive = location.pathname === ele.path;

  const acticeTabStyle = {
    backgroundColor: '#5d87ff',
    color: '#fff',
  }

  const acticeIconStyle = {
    color: '#fff',
  }

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navSectionOne = [
    { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { title: 'Users', path: '/dashboard/users', icon: <GroupIcon /> },
    { title: 'Students', path: '/dashboard/students', icon: <ChildCareIcon /> },
    { title: 'Reports', path: '/dashboard/reports', icon: <AssignmentIcon /> },
    { title: 'Achievement', path: '/dashboard/achievement', icon: <EmojiEventsIcon /> },
    { title: 'Category', path: '/dashboard/category', icon: <CategoryIcon /> },
    { title: 'Age Group', path: '/dashboard/age-group', icon: <GroupsIcon /> },
    { title: 'Content', path: '/dashboard/content', icon: <EditNoteIcon /> },
    { title: 'Subscription', path: '/dashboard/subscription', icon: <CurrencyExchangeIcon /> },
    { title: 'Admin Manager', path: '/dashboard/admin-manager', icon: <ManageAccountsIcon /> },
    { title: 'Logs', path: '/dashboard/logs', icon: <FileCopyIcon /> },
    { title: 'Notification', path: '/dashboard/notification', icon: <NotificationsActiveIcon /> },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ boxShadow: 'none', background: '#5d87ff' }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 5,
                },
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <ProfileAvatarMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', paddingLeft: 1 }}>
            {open && <img style={{ transition: 'ease' }} src={logo} alt="" width={'100%'} height={'38'} />}
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List>
          {navSectionOne.map((ele, index) => (

            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={ele.path}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  ele.path === location.pathname ? acticeTabStyle : null,
                  open
                    ? {
                      justifyContent: 'initial',
                    }
                    : {
                      justifyContent: 'center',
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    ele.path === location.pathname ? acticeIconStyle : null,
                    open
                      ? {
                        mr: 3,
                      }
                      : {
                        mr: 'auto',
                      },
                  ]}
                >
                  {open ? ele.icon : (
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
        {/* <Divider /> */}
        {/* <List>
          {navSectionTwo.map((ele, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                to={ele.path}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                      justifyContent: 'initial',
                    }
                    : {
                      justifyContent: 'center',
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                        mr: 3,
                      }
                      : {
                        mr: 'auto',
                      },
                  ]}
                >
                  {open ? ele.icon : (
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
        </List> */}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1, p: 3,
          overflow: 'auto',
          height: '100vh',
          scrollbarWidth: 'none', // For Firefox
          '&::-webkit-scrollbar': {
            display: 'none', // For Chrome, Safari
          },
        }}
      >
        <DrawerHeader />
        <Routes>
          <Route index path="/" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="students" element={<Students />} />
          <Route path="reports" element={<Reports />} />
          <Route path="achievement" element={<Achievement />} />
          <Route path="category" element={<Category />} />
          <Route path="age-group" element={<AgeGroup />} />
          <Route path="content" element={<Content />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="admin-manager" element={<AdminManager />} />
          <Route path="logs" element={<Logs />} />
          <Route path="notification" element={<Notification />} />
        </Routes>
        <Typography variant="p" fontSize={12} mt={4} textAlign={'center'} color='#ccc' noWrap component="div">
          Copyright © 2024 TMKOC Playschool. All Rights Reserved. <br />
          Powered by Neela Mediatech Private Limited
        </Typography>
      </Box>
    </Box>
  );
}
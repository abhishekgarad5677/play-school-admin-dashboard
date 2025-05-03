import React, { useState } from "react";
import { Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import DashboardSummary from "./DashboardSummary";
import GameSummary from "./GameSummary";
import DashboardAudioLangauge from "./DashboardAudioLangauge";

const Dashboard = () => {
  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Dashboard",
            href: "/dashboard",
            icon: <DashboardIcon fontSize="small" />,
          },
        ]}
      />
      <Box sx={{ minHeight: "85vh", width: "100%" }}>
        <DashboardSummary />
        <GameSummary />
        <DashboardAudioLangauge />
      </Box>
    </>
  );
};

export default Dashboard;

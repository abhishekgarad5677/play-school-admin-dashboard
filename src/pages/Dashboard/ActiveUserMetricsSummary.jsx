import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid2";
import PeopleIcon from "@mui/icons-material/People";
import { useGetActiveUserMetricsQuery } from "../../redux/slices/apiSlice";

const ActiveUserMetricsSummary = () => {
  const [expanded, setExpanded] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  // ✅ API will not run until accordion opened
  const {
    data: userActiveData,
    isLoading,
    error,
  } = useGetActiveUserMetricsQuery(undefined, { skip: !hasOpenedOnce });

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (userActiveData && userActiveData?.status === true) {
      setUserData([
        {
          title: "Daily Active Users",
          size: 4,
          value: userActiveData?.data?.dau,
          icon: <PeopleIcon sx={{ fontSize: 40, color: "#E91E63" }} />,
          color: "#FFE4EC",
          valueColor: "#E91E63",
        },
        {
          title: "Weekly Active Users",
          size: 4,
          value: userActiveData?.data?.wau,
          icon: <PeopleIcon sx={{ fontSize: 40, color: "#E91E63" }} />,
          color: "#FFE4EC",
          valueColor: "#E91E63",
        },
        {
          title: "Monthly Active Users",
          size: 4,
          value: userActiveData?.data?.mau,
          icon: <PeopleIcon sx={{ fontSize: 40, color: "#E91E63" }} />,
          color: "#FFE4EC",
          valueColor: "#E91E63",
        },
      ]);
    } else {
      setUserData([]);
    }
  }, [userActiveData]);

  const renderContent = () => {
    if (!hasOpenedOnce) return null;

    if (isLoading) {
      return (
        <Grid container spacing={2}>
          <Grid size={4}>
            <Skeleton variant="rounded" width="100%" height={120} />
          </Grid>
          <Grid size={4}>
            <Skeleton variant="rounded" width="100%" height={120} />
          </Grid>
          <Grid size={4}>
            <Skeleton variant="rounded" width="100%" height={120} />
          </Grid>
        </Grid>
      );
    }

    if (error) {
      return (
        <Typography variant="body2" color="error">
          Error loading active user metrics.
        </Typography>
      );
    }

    if (!userData.length) {
      return (
        <Typography variant="body2" color="text.secondary">
          No active user metrics available.
        </Typography>
      );
    }

    return (
      <Grid container spacing={2}>
        {userData.map((card, index) => (
          <Grid size={card.size} key={index}>
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
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box mb={2}>
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => {
          setExpanded(isExpanded);
          if (isExpanded) setHasOpenedOnce(true);
        }}
        disableGutters
        sx={{ borderRadius: 3, overflow: "hidden" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography fontWeight={700}>Active User Metrics</Typography>
        </AccordionSummary>

        <AccordionDetails>{renderContent()}</AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ActiveUserMetricsSummary;

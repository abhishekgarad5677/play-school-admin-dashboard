import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordion from "@mui/material/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import WeakAttendance from "./RetentionModules/WeakAttendance/WeakAttendance";
import NotSubscribed from "./RetentionModules/NotSubscribed/NotSubscribed";
import GoogleSignup from "./RetentionModules/GoogleSignup/GoogleSignup";
import FreeTrialNotSubscribed from "./RetentionModules/FreeTrialNotSubscribed/FreeTrialNotSubscribed";

const Retention = () => {
  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&::before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
      {
        transform: "rotate(90deg)",
      },
    [`& .${accordionSummaryClasses.content}`]: {
      marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "rgba(255, 255, 255, .05)",
    }),
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  const [expanded, setExpanded] = useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Retention",
            href: "/dashboard/retention",
            icon: <SupervisedUserCircleIcon fontSize="small" />,
          },
        ]}
      />
      {/* <Paper
        sx={{ height: "90vh", width: "100%", padding: 3, overflowY: "scroll" }}
      > */}
      <div>
        {/* <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography component="span" fontWeight={500}>
              Attendance Report
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <WeakAttendance />
            </>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography component="span" fontWeight={500}>
              Registered But Not Subscribed
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <NotSubscribed />
            </>
          </AccordionDetails>
        </Accordion> */}
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography component="span" fontWeight={500}>
              Google signup completed but free trial not started
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <GoogleSignup />
            </>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel4"}
          onChange={handleChange("panel4")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography component="span" fontWeight={500}>
              Free trial expired and not subscribed
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <FreeTrialNotSubscribed />
            </>
          </AccordionDetails>
        </Accordion>
      </div>
      {/* </Paper> */}
    </>
  );
};

export default Retention;

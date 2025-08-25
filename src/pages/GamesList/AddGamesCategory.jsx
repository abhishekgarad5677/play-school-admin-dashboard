import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Grid from "@mui/material/Grid2";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useGetAddGamesMutation } from "../../redux/slices/apiSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ROLE_OPTIONS = [
  { value: "CO", label: "Cognitive" },
  { value: "LF", label: "Life" },
  { value: "CR", label: "Creative" },
  { value: "LO", label: "Logical" },
  { value: "EM", label: "Emotional" },
  { value: "AC", label: "Academic" },
  { value: "MO", label: "Motor" },
  { value: "TM", label: "Time Management" },
];

const AddGamesCategory = () => {
  const [gameName, setGameName] = useState("");
  const [ageGroup, setAgeGroup] = useState("1"); // you had a disabled OutlinedInput with value "1"
  const [personName, setPersonName] = useState([]); // selected skills
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [postAddGame, { isLoading, error, data }] = useGetAddGamesMutation();

  const handleSkillsChange = (event) => {
    const { value } = event.target;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();

    const fd = new FormData();

    // assuming these states exist:
    // gameName: string, ageGroup: string, personName: string[]

    fd.append("Name", (gameName ?? "").trim());
    fd.append("AgeGroupId", ageGroup ?? "");
    fd.append("SkillTags", (personName ?? []).join("|")); // e.g., "CO|CR|CR"

    // optional: inspect what got added (FormData isn't directly loggable)
    for (const [key, value] of fd.entries()) {
      console.log(`${key}:`, value);
    }

    postAddGame(fd);
  };

  useEffect(() => {
    if (data) {
      if (data?.status === true) {
        console.log(data);
        toast.success("Game Added successful");
        navigate("/dashboard/games-list");
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.log(error?.data?.message);

      toast.error(error?.data?.message || "An error occurred");
    }
  }, [error]);

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Add Games",
            href: "/dashboard/games-list",
            icon: <SportsEsportsIcon fontSize="small" />,
          },
          {
            label: "Add category",
            href: "/dashboard/add-games",
            icon: <AddCircleIcon fontSize="small" />,
          },
        ]}
      />

      <Link
        style={{
          textDecoration: "none",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        to={"/dashboard/games-list"}
      >
        <ArrowBackIosIcon sx={{ fontSize: 14 }} />
        back
      </Link>

      <Paper sx={{ height: "85vh", width: "100%", p: 3, marginTop: 2 }}>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Game Name
            </Typography>
            <OutlinedInput
              fullWidth
              size="small"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
            />
          </Grid>

          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              Age Group
            </Typography>
            <OutlinedInput
              fullWidth
              size="small"
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              // set disabled={true} if you want it fixed
              disabled
            />
          </Grid>

          <Grid size={6}>
            <FormControl fullWidth size="small">
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Skill Tag
              </Typography>
              <Select
                id="role"
                name="role"
                multiple
                fullWidth
                value={personName}
                onChange={handleSkillsChange}
                renderValue={(selected) =>
                  ROLE_OPTIONS.filter((o) => selected.includes(o.value))
                    .map((o) => o.label)
                    .join(", ")
                }
              >
                {ROLE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Checkbox checked={personName.includes(opt.value)} />
                    <ListItemText primary={opt.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6} />

          <Grid size={6}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !gameName.trim()}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AddGamesCategory;

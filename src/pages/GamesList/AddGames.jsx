import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
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
import { useGetAddGameCategoryMutation } from "../../redux/slices/apiSlice";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const AddGames = () => {
  const [gameName, setGameName] = useState("");
  const [level, setLevel] = useState("");
  const [isTest, setIsTest] = useState(""); // <-- NEW: true/false select state
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const [postAddGame, { isLoading, error, data }] =
    useGetAddGameCategoryMutation();

  const handleSubmit = (e) => {
    e?.preventDefault?.();

    const fd = new FormData();
    fd.append("Name", (gameName ?? "").trim());
    fd.append("TotalLevel", level ?? "");

    const isTestBool = isTest === true || isTest === "true";
    fd.append("IsTest", isTestBool ? "true" : "false");

    // ✅ coerce route param to an int and send as CategoryIds[0]
    const categoryIdInt = Number.parseInt(id, 10);
    if (Number.isNaN(categoryIdInt)) {
      console.error("Invalid category id:", id);
      return;
    }
    fd.append("CategoryIds[0]", String(categoryIdInt)); // <-- "1" (no brackets)

    for (const [k, v] of fd.entries()) console.log(k, v);
    postAddGame(fd);
  };

  useEffect(() => {
    if (data?.status === true) {
      toast.success("Game Added successfully");
      navigate(`/dashboard/view-game/${id}`);
    }
  }, [data, navigate]);

  useEffect(() => {
    if (error) {
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
        to={`/dashboard/view-game/${id}`}
      >
        <ArrowBackIosIcon sx={{ fontSize: 14 }} />
        back
      </Link>

      <Paper sx={{ height: "85vh", width: "100%", p: 3, mt: 2 }}>
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
              Total Level
            </Typography>
            <OutlinedInput
              fullWidth
              size="small"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            />
          </Grid>

          {/* NEW: True/False Select */}
          <Grid size={6}>
            <FormControl fullWidth size="small">
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Is Test
              </Typography>
              <Select
                value={isTest}
                onChange={(e) => setIsTest(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select True/False</em>
                </MenuItem>
                {/* Use real booleans so event.target.value is boolean */}
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={6} />

          <Grid size={6}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !gameName.trim() || isTest === ""}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AddGames;

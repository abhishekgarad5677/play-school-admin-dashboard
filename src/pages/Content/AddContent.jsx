import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Grid from "@mui/material/Grid2";
import EditNoteIcon from "@mui/icons-material/EditNote";

const AddContent = () => {
  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Category",
            href: "/dashboard/content",
            icon: <EditNoteIcon fontSize="small" />,
          },
          {
            label: "Add category",
            href: "/dashboard/add-content",
            icon: <AddCircleIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
        <Grid container spacing={3}>
          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Name
            </Typography>
            <OutlinedInput fullWidth size="small" />
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Version
            </Typography>
            <OutlinedInput fullWidth size="small" />
          </Grid>
          <Grid size={3}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Name Of Game
            </Typography>
            <OutlinedInput fullWidth size="small" />
          </Grid>
          <Grid size={3}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Total Number Of Levels
            </Typography>
            <OutlinedInput fullWidth size="small" />
          </Grid>
          <Grid size={3}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Select Category
            </Typography>
            <FormControl fullWidth size="small">
              {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel> */}
              <Select
                multiple
                value={personName}
                onChange={handleChange}
                input={<OutlinedInput fullWidth size="small" />}
                renderValue={(selected) => selected.join(", ")}
                // MenuProps={MenuProps}
              >
                {names?.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={3}>
            <Typography variant="subtitle1" fontWeight={"500"} gutterBottom>
              Tested
            </Typography>
            <FormControl fullWidth>
              <Select
                label="Age"
                input={<OutlinedInput fullWidth size="small" />}
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AddContent;

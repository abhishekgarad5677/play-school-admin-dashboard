import { Box, Button, Paper, TextField } from "@mui/material";
import React from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const Content = () => {
  const navigate = useNavigate();

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Content",
            href: "/dashboard/content",
            icon: <EditNoteIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* search student */}
          <TextField
            label="search content"
            variant="outlined"
            size="small"
            onChange={(e) => filterUserData(e)}
          />

          {/* add category button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              width: { xs: "100%", sm: "auto", backgroundColor: "#5D87FF" },
            }}
            onClick={() => navigate("/dashboard/add-content")}
          >
            Add Content
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default Content;

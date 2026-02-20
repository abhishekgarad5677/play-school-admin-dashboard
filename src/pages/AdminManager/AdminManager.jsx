import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";

// ✅ your nav json (keep icons if you want; we only use title+path here)
const navSectionOne = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Funnel Metrics", path: "/dashboard/funnel" },
  { title: "Subscribed Users", path: "/dashboard/students" },
  { title: "Subscription Status", path: "/dashboard/subscription" },
  {
    title: "Razorpay Free Trial Users",
    path: "/dashboard/razor-pay-free-trial",
  },
  { title: "Play Services Started", path: "/dashboard/free-trial-started" },
  { title: "User Buckets", path: "/dashboard/user-buckets" },
  { title: "Manage Admin", path: "/dashboard/manage-admin" },
  { title: "Domestic Revenue", path: "/dashboard/domestic-revenue" },
  { title: "International Revenue", path: "/dashboard/international-revenue" },
  { title: "Non Subscribed Users", path: "/dashboard/UnsubscribedUsers" },
  { title: "Location Analytics", path: "/dashboard/top-cities" },
  { title: "Push Notification", path: "/dashboard/retention" },
  { title: "Games", path: "/dashboard/games" },
  { title: "Add Games", path: "/dashboard/games-list" },
];

const AdminManager = () => {
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  // store selected routes as a Set for easy toggle
  const [selectedRoutes, setSelectedRoutes] = useState(() => new Set());
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "", routes: "" });

  const routeOptions = useMemo(() => {
    // Ensure unique by path (in case duplicates ever happen)
    const seen = new Set();
    return navSectionOne.filter(
      (i) => i?.path && !seen.has(i.path) && seen.add(i.path),
    );
  }, []);

  const handleOpen = () => {
    setOpen(true);
    // reset errors only (keep values if you want)
    setErrors({ email: "", routes: "" });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleRoute = (path) => {
    setSelectedRoutes((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const validate = () => {
    const nextErrors = { email: "", routes: "" };

    const trimmed = email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!trimmed) nextErrors.email = "Email is required.";
    else if (!emailOk) nextErrors.email = "Enter a valid email.";

    if (selectedRoutes.size === 0)
      nextErrors.routes = "Select at least one route permission.";

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.routes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const routesArray = Array.from(selectedRoutes);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("routes", JSON.stringify(routesArray)); // backend receives array via JSON

    try {
      setSubmitting(true);

      // ✅ Replace with your real API call:
      // await fetch("/api/admins", { method: "POST", body: formData });
      console.log("Submitting FormData:");
      console.log("email:", email.trim());
      console.log("routes:", routesArray);

      // success UX: reset + close
      setEmail("");
      setSelectedRoutes(new Set());
      setOpen(false);
    } catch (err) {
      console.error(err);
      // optionally show toast/snackbar
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "Manage Admin",
              href: "/dashboard/manage-admin",
              icon: <ManageAccountsIcon fontSize="small" />,
            },
          ]}
        />

        <Button variant="contained" onClick={handleOpen}>
          Add Admin
        </Button>
      </Box>

      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{ gap: 1, flexDirection: { xs: "column", sm: "row" } }}
        >
          <>AdminManager</>
        </Box>
      </Paper>

      {/* ✅ Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add Admin</DialogTitle>

        <DialogContent dividers>
          <Box component="form" id="add-admin-form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              error={Boolean(errors.email)}
              helperText={errors.email || " "}
              autoFocus
            />

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Route permissions
            </Typography>

            {errors.routes ? (
              <Typography variant="body2" sx={{ mb: 1 }} color="error">
                {errors.routes}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.75 }}>
                Select what this admin can access.
              </Typography>
            )}

            <FormGroup sx={{ maxHeight: 320, overflow: "auto", pr: 1 }}>
              {routeOptions.map((item) => (
                <FormControlLabel
                  key={item.path}
                  control={
                    <Checkbox
                      checked={selectedRoutes.has(item.path)}
                      onChange={() => toggleRoute(item.path)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {item.path}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-admin-form"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminManager;

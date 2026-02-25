import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

const PermissionModal = ({
  open,
  onClose,
  onSubmit,
  submitting,

  // dropdown options: [{ title, path }]
  availableRoutes,
}) => {
  const [selectedPath, setSelectedPath] = useState("");
  const [error, setError] = useState("");

  const routeList = useMemo(() => availableRoutes || [], [availableRoutes]);

  // reset modal state when opened/closed
  useEffect(() => {
    if (!open) {
      setSelectedPath("");
      setError("");
    }
  }, [open]);

  const handleLocalSubmit = (e) => {
    e.preventDefault();

    if (!selectedPath) {
      setError("Please select a permission route.");
      return;
    }

    const selectedObj = routeList.find((r) => r.path === selectedPath);
    if (!selectedObj) {
      setError("Invalid selection. Please select again.");
      return;
    }

    // ✅ send required keys
    onSubmit({
      name: selectedObj.title,
      frontendRoute: selectedObj.path,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Permission</DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          id="add-permission-form"
          onSubmit={handleLocalSubmit}
        >
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.75 }}>
            Select a route to create a permission.
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          {routeList.length === 0 ? (
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              No new routes available to add.
            </Typography>
          ) : (
            <FormControl fullWidth error={Boolean(error)}>
              <InputLabel id="permission-route-label">
                Permission Route
              </InputLabel>
              <Select
                labelId="permission-route-label"
                value={selectedPath}
                label="Permission Route"
                onChange={(e) => {
                  setSelectedPath(e.target.value);
                  setError("");
                }}
              >
                {routeList.map((item) => (
                  <MenuItem key={item.path} value={item.path}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>{error || " "}</FormHelperText>
            </FormControl>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="add-permission-form"
          variant="contained"
          disabled={submitting || routeList.length === 0}
        >
          {submitting ? "Saving..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionModal;

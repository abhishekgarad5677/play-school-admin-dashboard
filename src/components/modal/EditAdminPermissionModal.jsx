import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { useGetPermissionsQuery } from "../../redux/slices/roleBaseSlice";

const EditAdminPermissionModal = ({
  open,
  onClose,
  onSubmit,
  userData, // user data passed as props
  submitting,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  // Call permissions API inside modal to get the full list of permissions
  const { data: permissionsData, isLoading } = useGetPermissionsQuery();

  // Set the current permissions from userData when modal opens
  useEffect(() => {
    if (userData && userData.permissions) {
      const currentPermissions = new Set(
        userData.permissions.map((permission) => permission.id),
      );
      setSelectedPermissions(currentPermissions);
    }
  }, [open, userData]);

  const handleTogglePermission = (id) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert selected permissions (array) into individual entries for FormData
    const formData = new FormData();
    formData.append("userId", userData.userId); // Add userId field

    // Append each permissionId as a separate key-value pair in FormData
    selectedPermissions.forEach((id) => {
      formData.append("permissionIds", id); // Sends each id as a separate key
    });

    // Submit the FormData to the parent via onSubmit
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Admin Permissions</DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          id="edit-admin-permission-form"
          onSubmit={handleSubmit}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {userData?.userName} ({userData?.email})
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Select permissions for {userData?.userName}
          </Typography>

          {isLoading ? (
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              Loading permissions...
            </Typography>
          ) : (
            <FormGroup sx={{ maxHeight: 320, overflow: "auto", pr: 1 }}>
              {permissionsData?.data?.map((permission) => (
                <FormControlLabel
                  key={permission.id}
                  control={
                    <Checkbox
                      checked={selectedPermissions.has(permission.id)}
                      onChange={() => handleTogglePermission(permission.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {permission.name}
                      </Typography>
                      {/* <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {permission.frontendRoute || "No route"}
                      </Typography> */}
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="edit-admin-permission-form"
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAdminPermissionModal;

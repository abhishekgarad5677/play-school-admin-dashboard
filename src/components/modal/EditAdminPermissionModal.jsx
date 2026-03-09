// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   Divider,
//   TextField,
//   Alert,
// } from "@mui/material";
// import { useGetPermissionsQuery } from "../../redux/slices/roleBaseSlice";

// const EditAdminPermissionModal = ({
//   open,
//   onClose,
//   onSubmit,
//   userData, // user data passed as props
//   submitting,
// }) => {
//   const [selectedPermissions, setSelectedPermissions] = useState(new Set());
//   const [securityPassword, setSecurityPassword] = useState(""); // For security password
//   const [errorMessage, setErrorMessage] = useState(""); // For error message
//   const [passwordError, setPasswordError] = useState(""); // For password error

//   useEffect(() => {
//     console.log("innder called");

//     // Reset the states when the modal opens
//     setErrorMessage("");
//     setPasswordError("");
//     setSecurityPassword("");
//   }, [open]); // Run the effect whenever the `open` prop changes

//   // Call permissions API inside modal to get the full list of permissions
//   const { data: permissionsData, isLoading } = useGetPermissionsQuery();

//   // Set the current permissions from userData when modal opens
//   useEffect(() => {
//     if (userData && userData.permissions) {
//       const currentPermissions = new Set(
//         userData.permissions.map((permission) => permission.id),
//       );
//       setSelectedPermissions(currentPermissions);
//     }
//   }, [open, userData]);

//   const handleTogglePermission = (id) => {
//     setSelectedPermissions((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Check if at least one permission is selected
//     if (selectedPermissions.size === 0) {
//       setErrorMessage("Please select at least one permission.");
//       return;
//     }

//     // Check if the entered password matches the one in the .env file
//     if (securityPassword !== import.meta.env.VITE_SECURITY_PASSWORD) {
//       setPasswordError("Incorrect security password.");
//       return;
//     }

//     // Clear any previous error messages
//     setErrorMessage("");
//     setPasswordError("");

//     // Convert selected permissions (array) into individual entries for FormData
//     const formData = new FormData();
//     formData.append("userId", userData.userId); // Add userId field

//     // Append each permissionId as a separate key-value pair in FormData
//     selectedPermissions.forEach((id) => {
//       formData.append("permissionIds", id); // Sends each id as a separate key
//     });

//     // Submit the FormData to the parent via onSubmit
//     onSubmit(formData);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Edit Admin Permissions</DialogTitle>

//       <DialogContent dividers>
//         <Box
//           component="form"
//           id="edit-admin-permission-form"
//           onSubmit={handleSubmit}
//         >
//           <Typography variant="h6" sx={{ mb: 1 }}>
//             {userData?.userName} ({userData?.email})
//           </Typography>

//           <Divider sx={{ my: 1 }} />

//           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
//             Select permissions for {userData?.userName}
//           </Typography>

//           {isLoading ? (
//             <Typography variant="body2" sx={{ opacity: 0.75 }}>
//               Loading permissions...
//             </Typography>
//           ) : (
//             <FormGroup sx={{ maxHeight: 320, overflow: "auto", pr: 1 }}>
//               {permissionsData?.data?.map((permission) => (
//                 <FormControlLabel
//                   key={permission.id}
//                   control={
//                     <Checkbox
//                       checked={selectedPermissions.has(permission.id)}
//                       onChange={() => handleTogglePermission(permission.id)}
//                     />
//                   }
//                   label={
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                         {permission.name}
//                       </Typography>
//                     </Box>
//                   }
//                 />
//               ))}
//             </FormGroup>
//           )}

//           {/* Security password field */}
//           <TextField
//             fullWidth
//             label="Security Password"
//             type="password"
//             value={securityPassword}
//             onChange={(e) => setSecurityPassword(e.target.value)}
//             margin="normal"
//             error={Boolean(passwordError)}
//             helperText={passwordError || " "}
//           />

//           {/* Show error message if no permission is selected */}
//           {errorMessage && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {errorMessage}
//             </Alert>
//           )}
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2 }}>
//         <Button onClick={onClose} disabled={submitting}>
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           form="edit-admin-permission-form"
//           variant="contained"
//           disabled={submitting}
//         >
//           {submitting ? "Saving..." : "Submit"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditAdminPermissionModal;

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
  TextField,
  Alert,
  IconButton, // Import IconButton
} from "@mui/material";
import { useGetPermissionsQuery } from "../../redux/slices/roleBaseSlice";
import Visibility from "@mui/icons-material/Visibility"; // Import Visibility icon
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Import VisibilityOff icon

const EditAdminPermissionModal = ({
  open,
  onClose,
  onSubmit,
  userData, // user data passed as props
  submitting,
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [securityPassword, setSecurityPassword] = useState(""); // For security password
  const [errorMessage, setErrorMessage] = useState(""); // For error message
  const [passwordError, setPasswordError] = useState(""); // For password error
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  useEffect(() => {
    console.log("innder called");

    // Reset the states when the modal opens
    setErrorMessage("");
    setPasswordError("");
    setSecurityPassword("");
  }, [open]); // Run the effect whenever the `open` prop changes

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

    // Check if at least one permission is selected
    if (selectedPermissions.size === 0) {
      setErrorMessage("Please select at least one permission.");
      return;
    }

    // Check if the entered password matches the one in the .env file
    if (securityPassword !== import.meta.env.VITE_SECURITY_PASSWORD) {
      setPasswordError("Incorrect security password.");
      return;
    }

    // Clear any previous error messages
    setErrorMessage("");
    setPasswordError("");

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
                    </Box>
                  }
                />
              ))}
            </FormGroup>
          )}

          {/* Security password field */}
          <TextField
            fullWidth
            label="Security Password"
            type={showPassword ? "text" : "password"} // Toggle between text and password
            value={securityPassword}
            onChange={(e) => setSecurityPassword(e.target.value)}
            margin="normal"
            error={Boolean(passwordError)}
            helperText={passwordError || " "}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)} // Toggle the password visibility
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {/* Show error message if no permission is selected */}
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
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

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   Typography,
//   Divider,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import { useGetPermissionsQuery } from "../../redux/slices/roleBaseSlice";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

// // ✅ Password rule (example):
// // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
// const PASSWORD_REGEX =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=\[\]{};:'",.<>\/\\|`~]).{8,}$/;

// const AddAdminModal = ({ open, onClose, onSubmit, submitting }) => {
//   const [userName, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false); // Toggle for showing/hiding password

//   // store selected permissions as Set of permission IDs
//   const [selectedPermissionIds, setSelectedPermissionIds] = useState(
//     () => new Set(),
//   );

//   const [errors, setErrors] = useState({
//     userName: "",
//     email: "",
//     password: "",
//     permissions: "",
//   });

//   // ✅ Call permissions API inside modal
//   const {
//     data: permissionsData,
//     isLoading,
//     error,
//     refetch,
//   } = useGetPermissionsQuery(undefined, {
//     skip: !open, // fetch only when modal opens
//   });

//   // Reset form when opening/closing
//   useEffect(() => {
//     if (!open) {
//       setUserName("");
//       setEmail("");
//       setPassword("");
//       setSelectedPermissionIds(new Set());
//       setErrors({ userName: "", email: "", password: "", permissions: "" });
//     } else {
//       // optional: refetch permissions when modal opens
//       refetch?.();
//     }
//   }, [open, refetch]);

//   const permissions = useMemo(() => {
//     if (permissionsData?.status === true) return permissionsData.data || [];
//     return [];
//   }, [permissionsData]);

//   const togglePermission = (id) => {
//     setSelectedPermissionIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const validate = () => {
//     const nextErrors = {
//       userName: "",
//       email: "",
//       password: "",
//       permissions: "",
//     };

//     const trimmedName = userName.trim();
//     if (!trimmedName) nextErrors.userName = "User name is required.";

//     const trimmedEmail = email.trim();
//     const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
//     if (!trimmedEmail) nextErrors.email = "Email is required.";
//     else if (!emailOk) nextErrors.email = "Enter a valid email.";

//     if (!password) nextErrors.password = "Password is required.";
//     else if (!PASSWORD_REGEX.test(password)) {
//       nextErrors.password =
//         "Password must be 8+ chars and include uppercase, lowercase, number and special character.";
//     }

//     if (selectedPermissionIds.size === 0)
//       nextErrors.permissions = "Select at least one permission.";

//     setErrors(nextErrors);
//     return (
//       !nextErrors.userName &&
//       !nextErrors.email &&
//       !nextErrors.password &&
//       !nextErrors.permissions
//     );
//   };

//   const handleLocalSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     onSubmit({
//       UserName: userName.trim(),
//       Email: email.trim(),
//       Password: password,
//       PermissionIds: Array.from(selectedPermissionIds),
//     });
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Add Admin</DialogTitle>

//       <DialogContent dividers>
//         <Box component="form" id="add-admin-form" onSubmit={handleLocalSubmit}>
//           <TextField
//             fullWidth
//             label="User Name"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//             margin="normal"
//             error={Boolean(errors.userName)}
//             helperText={errors.userName || " "}
//             autoFocus
//           />

//           <TextField
//             fullWidth
//             label="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             margin="normal"
//             error={Boolean(errors.email)}
//             helperText={errors.email || " "}
//           />

//           <TextField
//             fullWidth
//             label="Password"
//             type={showPassword ? "text" : "password"} // Toggle between text and password
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//             error={Boolean(errors.password)}
//             helperText={errors.password || " "}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Divider sx={{ my: 1.5 }} />

//           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
//             Route permissions
//           </Typography>

//           {errors.permissions ? (
//             <Typography variant="body2" sx={{ mb: 1 }} color="error">
//               {errors.permissions}
//             </Typography>
//           ) : (
//             <Typography variant="body2" sx={{ mb: 1, opacity: 0.75 }}>
//               Select what this admin can access.
//             </Typography>
//           )}

//           {isLoading ? (
//             <Typography variant="body2" sx={{ opacity: 0.75 }}>
//               Loading permissions...
//             </Typography>
//           ) : error ? (
//             <Typography variant="body2" color="error">
//               Failed to load permissions.
//             </Typography>
//           ) : (
//             <FormGroup sx={{ maxHeight: 320, overflow: "auto", pr: 1 }}>
//               {permissions.map((p) => (
//                 <FormControlLabel
//                   key={p.id}
//                   control={
//                     <Checkbox
//                       checked={selectedPermissionIds.has(p.id)}
//                       onChange={() => togglePermission(p.id)}
//                     />
//                   }
//                   label={
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                         {p.name}
//                       </Typography>
//                     </Box>
//                   }
//                 />
//               ))}
//             </FormGroup>
//           )}
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, py: 2 }}>
//         <Button onClick={onClose} disabled={submitting}>
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           form="add-admin-form"
//           variant="contained"
//           disabled={submitting}
//         >
//           {submitting ? "Saving..." : "Submit"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AddAdminModal;

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useGetPermissionsQuery } from "../../redux/slices/roleBaseSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ✅ Password rule (example):
// min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=\[\]{};:'",.<>\/\\|`~]).{8,}$/;

const AddAdminModal = ({ open, onClose, onSubmit, submitting }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityPassword, setSecurityPassword] = useState(""); // State for security password
  const [showPassword, setShowPassword] = useState(false); // Toggle for showing/hiding password

  // store selected permissions as Set of permission IDs
  const [selectedPermissionIds, setSelectedPermissionIds] = useState(
    () => new Set(),
  );

  const [errors, setErrors] = useState({
    userName: "",
    email: "",
    password: "",
    securityPassword: "", // Added error for security password
    permissions: "",
  });

  // ✅ Call permissions API inside modal
  const {
    data: permissionsData,
    isLoading,
    error,
    refetch,
  } = useGetPermissionsQuery(undefined, {
    skip: !open, // fetch only when modal opens
  });

  // Reset form when opening/closing
  useEffect(() => {
    if (!open) {
      setUserName("");
      setEmail("");
      setPassword("");
      setSecurityPassword(""); // Reset security password
      setSelectedPermissionIds(new Set());
      setErrors({
        userName: "",
        email: "",
        password: "",
        permissions: "",
        securityPassword: "",
      });
    } else {
      // optional: refetch permissions when modal opens
      refetch?.();
    }
  }, [open, refetch]);

  const permissions = useMemo(() => {
    if (permissionsData?.status === true) return permissionsData.data || [];
    return [];
  }, [permissionsData]);

  const togglePermission = (id) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {
      userName: "",
      email: "",
      password: "",
      permissions: "",
      securityPassword: "", // Added validation for security password
    };

    const trimmedName = userName.trim();
    if (!trimmedName) nextErrors.userName = "User name is required.";

    const trimmedEmail = email.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!trimmedEmail) nextErrors.email = "Email is required.";
    else if (!emailOk) nextErrors.email = "Enter a valid email.";

    if (!password) nextErrors.password = "Password is required.";
    else if (!PASSWORD_REGEX.test(password)) {
      nextErrors.password =
        "Password must be 8+ chars and include uppercase, lowercase, number and special character.";
    }

    if (selectedPermissionIds.size === 0)
      nextErrors.permissions = "Select at least one permission.";

    const securityPasswordEnv = import.meta.env.VITE_SECURITY_PASSWORD;
    if (securityPassword !== securityPasswordEnv) {
      nextErrors.securityPassword = "Incorrect security password.";
    }

    setErrors(nextErrors);
    return (
      !nextErrors.userName &&
      !nextErrors.email &&
      !nextErrors.password &&
      !nextErrors.permissions &&
      !nextErrors.securityPassword
    );
  };

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      UserName: userName.trim(),
      Email: email.trim(),
      Password: password,
      PermissionIds: Array.from(selectedPermissionIds),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Admin</DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="add-admin-form" onSubmit={handleLocalSubmit}>
          <TextField
            fullWidth
            label="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            margin="normal"
            error={Boolean(errors.userName)}
            helperText={errors.userName || " "}
            autoFocus
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            error={Boolean(errors.email)}
            helperText={errors.email || " "}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle between text and password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            error={Boolean(errors.password)}
            helperText={errors.password || " "}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Security Password"
            type="password"
            value={securityPassword}
            onChange={(e) => setSecurityPassword(e.target.value)}
            margin="normal"
            error={Boolean(errors.securityPassword)}
            helperText={errors.securityPassword || " "}
          />

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Route permissions
          </Typography>

          {errors.permissions ? (
            <Typography variant="body2" sx={{ mb: 1 }} color="error">
              {errors.permissions}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.75 }}>
              Select what this admin can access.
            </Typography>
          )}

          {isLoading ? (
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              Loading permissions...
            </Typography>
          ) : error ? (
            <Typography variant="body2" color="error">
              Failed to load permissions.
            </Typography>
          ) : (
            <FormGroup sx={{ maxHeight: 320, overflow: "auto", pr: 1 }}>
              {permissions.map((p) => (
                <FormControlLabel
                  key={p.id}
                  control={
                    <Checkbox
                      checked={selectedPermissionIds.has(p.id)}
                      onChange={() => togglePermission(p.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {p.name}
                      </Typography>
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
          form="add-admin-form"
          variant="contained"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminModal;

import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useGetDeleteGameMutation } from "../../redux/slices/apiSlice";
import { useEffect, useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ALLOWED_PASSWORDS = ["LASSI", "tmkoc@123"];

export default function GameDeleteModal({
  open,
  handleClose,
  rowId,
  postGetGames,
  id,
}) {
  const [postDeleteGame, { isLoading, error, data }] =
    useGetDeleteGameMutation();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isMatch = ALLOWED_PASSWORDS.map((p) => p.toLowerCase()).includes(
    password.trim().toLowerCase()
  );

  const handleDeleteGame = () => {
    if (!isMatch) return; // safety: only proceed if password matches
    const formData = new FormData();
    formData.append("gameId", rowId); // ✅ do NOT append password
    postDeleteGame(formData);
    handleClose();
    setPassword("");
    setShowPassword(false);
  };

  useEffect(() => {
    if (data) {
      const fd = new FormData();
      fd.append("categoryId", id);
      postGetGames(fd); // refresh list after delete
    }
  }, [data, id, postGetGames]);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setShowPassword(false);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" mb={2} fontWeight="600">
          Are you sure you want to delete this game?
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Enter password to enable delete.
        </Typography>

        <TextField
          fullWidth
          size="small"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          {/* Show the Delete button ONLY when password matches */}
          {isMatch && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteGame}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Yes, Delete"}
            </Button>
          )}
          <Button variant="contained" onClick={handleClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
} from "@mui/material";

const ViewFeedbackModal = ({ open, onClose, feedback }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>View Feedback</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1">
            <strong>Feedback Message:</strong>
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {feedback}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewFeedbackModal;

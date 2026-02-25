import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  TextField,
} from "@mui/material";
import { freeTrialClickedButNotStarted, phoneNumberAddedButFreeTrialNotClicked, subscriptionCancelled } from "../../utils/constant";

const EditFeedbackModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  activeTab,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherFeedback, setOtherFeedback] = useState("");
  const [error, setError] = useState(false);
  const [selectVal, setSeclectVal] = useState([]);

  // Define feedback options for different active tabs
  // const phoneNumberAddedButFreeTrialNotClicked = [
  //   "Forgot to click the free trial",
  //   "Confused by the trial process",
  //   "No interest in the trial",
  //   "Didn't understand the benefits of the trial",
  // ]; 

  // const freeTrialClickedButNotStarted = [
  //   "Forgot to start the trial",
  //   "Wasn't ready to use the app yet",
  //   "Confused by how to start the trial",
  //   "No interest in the trial",
  // ];

  // const subscriptionCancelled = [
  //   "Did not find the app useful",
  //   "Had technical issues",
  //   "Was too expensive",
  //   "Found a better alternative",
  // ];

  // Set the feedback options based on the active tab
  useEffect(() => {
    if (activeTab === 0) {
      setSeclectVal(phoneNumberAddedButFreeTrialNotClicked);
    } else if (activeTab === 1) {
      setSeclectVal(freeTrialClickedButNotStarted);
    } else if (activeTab === 2) {
      setSeclectVal(subscriptionCancelled);
    }
  }, [activeTab]);

  useEffect(() => {
    if (initialData) {
      // If callCenterFeedback exists in the selected reasons array, select that reason
      if (selectVal.includes(initialData?.callCenterFeedback)) {
        setSelectedReason(initialData?.callCenterFeedback);
        setOtherFeedback(""); // Clear the otherFeedback if it's a predefined reason
      } else {
        // If not found, select "Other (please specify)" and set the input field to the feedback
        setSelectedReason("Other (please specify)");
        setOtherFeedback(initialData?.callCenterFeedback || ""); // Fill the input with custom feedback
      }
    }
  }, [initialData, selectVal]);

  const handleSubmit = () => {
    if (
      !selectedReason ||
      (selectedReason === "Other (please specify)" && !otherFeedback.trim())
    ) {
      setError(true); // Set error state when the reason or custom feedback is empty
      return;
    }

    setError(false); // Reset error state if the message is valid

    const formData = new FormData();
    formData.append("email", initialData?.email); // Send selected reason or custom feedback
    if (selectedReason === "Other (please specify)") {
      formData.append("message", otherFeedback); // Send custom feedback if "Other"
    } else {
      formData.append("message", selectedReason); // Send selected reason or custom feedback
    }

    onSubmit(formData); // Submit the form
    setSelectedReason(""); // Clear selected reason after submission
    setOtherFeedback(""); // Clear custom feedback after submission
    onClose()
  };

  const handleClose = () => {
    setSelectedReason(""); // Clear the selected reason on close
    setOtherFeedback(""); // Clear custom feedback on close
    onClose(); // Close the modal
  };

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
    if (event.target.value !== "Other (please specify)") {
      setOtherFeedback(""); // Clear the custom feedback if the reason is not "Other"
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Feedback</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            marginTop: 2,
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Feedback Reason</InputLabel>
            <Select
              value={selectedReason}
              onChange={handleReasonChange}
              label="Feedback Reason"
              error={error}
            >
              {/* Populating the dropdown based on the active tab */}
              {selectVal?.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
              <MenuItem value="Other (please specify)">
                Other (please specify)
              </MenuItem>
            </Select>
            {error && !selectedReason && (
              <span style={{ color: "red" }}>
                Please select a feedback reason
              </span>
            )}
          </FormControl>

          {/* Textfield for 'Other' feedback */}
          {selectedReason === "Other (please specify)" && (
            <TextField
              label="Please specify"
              value={otherFeedback}
              onChange={(e) => setOtherFeedback(e.target.value)}
              fullWidth
              multiline
              rows={4}
              error={error && !otherFeedback.trim()}
              helperText={
                error && !otherFeedback.trim()
                  ? "Please provide more details."
                  : ""
              }
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFeedbackModal;

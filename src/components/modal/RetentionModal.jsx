import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";

const RetentionModal = ({
  open,
  onClose,
  onSubmit,
  predefinedOptions,
  selectedRow,
  isLoading,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customPara, setCustomPara] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedTime, setSelectedTime] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setSelectedOption("");
      setCustomTitle("");
      setCustomPara("");
      setDateRange([null, null]);
      setSelectedTime(null);
      setErrors({});
    }
  }, [open]);

  const handleSubmit = () => {
    const newErrors = {};

    if (!selectedOption) newErrors.selectedOption = "Please select an option.";

    if (selectedOption === "custom") {
      if (!customTitle.trim()) newErrors.customTitle = "Custom title required.";
      if (!customPara.trim())
        newErrors.customPara = "Custom paragraph required.";
      //   if (!startDate || !endDate) newErrors.dateRange = "Date range required.";
      //   if (!selectedTime) newErrors.time = "Time required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalData =
      selectedOption === "custom"
        ? {
            type: "custom",
            title: customTitle,
            para: customPara,
            dateRange: [startDate, endDate],
            time: selectedTime,
          }
        : {
            type: "predefined",
            ...predefinedOptions.find((opt) => opt.id === Number(selectedOption)),
          };

    onSubmit(finalData, selectedRow);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography fontWeight={500} variant="h6" mb={3}>
          Select Action {selectedRow?.title && `for: ${selectedRow.title}`}
        </Typography>

        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            {predefinedOptions.map((opt) => (
              <FormControlLabel
                key={opt.id}
                value={opt.id}
                control={<Radio />}
                label={
                  <Box mb={1}>
                    <Typography fontWeight="bold">{opt.title}</Typography>
                    <Typography variant="body2">{opt.description}</Typography>
                  </Box>
                }
              />
            ))}
            <FormControlLabel
              value="custom"
              control={<Radio />}
              label="Custom"
            />
          </RadioGroup>

          {selectedOption === "custom" && (
            <Box mt={2}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Custom Title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  size="small"
                  error={Boolean(errors.customTitle)}
                  helperText={errors.customTitle}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Custom Paragraph"
                  value={customPara}
                  onChange={(e) => setCustomPara(e.target.value)}
                  error={Boolean(errors.customPara)}
                  helperText={errors.customPara}
                />

                {/* <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select date range"
                  customInput={
                    <TextField
                      size="small"
                      fullWidth
                      label="Date Range"
                      error={Boolean(errors.dateRange)}
                      helperText={errors.dateRange}
                    />
                  }
                />

                <DatePicker
                  selected={selectedTime}
                  onChange={(date) => setSelectedTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  placeholderText="Select time"
                  customInput={
                    <TextField
                      size="small"
                      fullWidth
                      label="Time"
                      error={Boolean(errors.time)}
                      helperText={errors.time}
                    />
                  }
                /> */}
              </Stack>
            </Box>
          )}

          <Typography variant="body2" color="error" mt={1}>
            {errors.selectedOption}
          </Typography>

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            {/* <Button variant="contained" sx={{ ml: 2 }} onClick={handleSubmit}>
              Submit
            </Button> */}
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              onClick={handleSubmit}
              disabled={isLoading} // disable while loading
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Modal>
  );
};

export default RetentionModal;

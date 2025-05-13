import { useEffect, useState } from "react";
import TableSkeleton from "../../../../components/skeleton/TableSkeleton";
import { CommonTable } from "../../../../components/table/Table";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  Button,
  Modal,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";

const WeakAttendanceTable = ({ data, isLoading }) => {
  useEffect(() => {
    console.log(
      "=====================WeakAttendanceTable====================",
      data?.data
    );
  }, [data]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "value", headerName: "Student count", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        // <Button variant="contained" onClick={() => handleOpen(params.row)}>
        //   Open Modal
        // </Button>
        <NotificationsActiveIcon
          onClick={() => handleOpen(params.row)}
          sx={{ color: "#5d87ff", cursor: "pointer" }}
        />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customPara, setCustomPara] = useState("");

  const predefinedOptions = [
    {
      id: "opt1",
      title: "Reminder",
      description: "Student has below average attendance",
    },
    {
      id: "opt2",
      title: "Warning",
      description: "This is a formal warning notice",
    },
  ];

  const handleOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOption("");
    setCustomTitle("");
    setCustomPara("");
  };

  return (
    <>
      <Box mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Attendance Summary Table
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click the bell icon to take action for each group.
        </Typography>
      </Box>

      {isLoading && data?.data.length > 0 ? (
        <TableSkeleton rows={4} columns={4} />
      ) : (
        <CommonTable
          userTableData={data?.data}
          columns={columns}
          pageSizeOptions={[]}
        />
      )}
      <Modal open={open} onClose={handleClose}>
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
          <Typography fontWeight={500} variant="h5" mb={3}>
            Select Action for: {selectedRow?.title}
          </Typography>

          <FormControl component="fieldset">
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
                <TextField
                  fullWidth
                  label="Custom Title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  margin="normal"
                  sixe="small"
                />
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Custom Paragraph"
                  value={customPara}
                  onChange={(e) => setCustomPara(e.target.value)}
                  margin="normal"
                />
              </Box>
            )}

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => {
                  const selectedData =
                    selectedOption === "custom"
                      ? { title: customTitle, para: customPara }
                      : predefinedOptions.find(
                          (opt) => opt.id === selectedOption
                        );

                  console.log("Final Selection:", selectedRow, selectedData);
                  handleClose();
                }}
              >
                Submit
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default WeakAttendanceTable;

import { useEffect, useState, useRef } from "react";
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
  Stack,
  Card,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RetentionModal from "../../../../components/modal/RetentionModal";
import { usePostWeakAttendanceMutation } from "../../../../redux/slices/apiSlice";
import { getMappedId } from "../../../../utils/Hooks";
import { toast } from "react-toastify";
import { attendanceMessages } from "../../../../utils/constant";

const WeakAttendanceTable = ({ data, isLoading, date }) => {
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "value", headerName: "Student count", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <NotificationsActiveIcon
          onClick={() => handleOpen(params.row)}
          sx={{ color: "#5d87ff", cursor: "pointer" }}
        />
      ),
    },
  ];

  const [
    postWeakAttendance,
    { isLoading: loadingData, error, data: waekAttendanceData },
  ] = usePostWeakAttendanceMutation();

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [predefinedOptions, setPredefinedOptions] = useState([]);

  // const predefinedOptions = [
  //   {
  //     id: "1",
  //     title: "TMKOC Playschool",
  //     description: "Student has below average attendance",
  //   },
  // ];

  const handleOpen = (row) => {
    setSelectedRow(row);
    switch (row.id) {
      case 1:
        setPredefinedOptions(attendanceMessages.low);
        break;
      case 2:
        setPredefinedOptions(attendanceMessages.medium);
        break;
      case 3:
        setPredefinedOptions(attendanceMessages.high);
        break;
      default:
        setPredefinedOptions([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (data, row) => {
    if (data && row && date) {
      if (data.type === "custom") {
        const formData = new FormData();
        formData.append("percentageId", getMappedId(date, row.id));
        formData.append("title", data.title);
        formData.append("body", data.para);
        console.log(getMappedId(date, row.id));

        postWeakAttendance(formData);
      } else {
        const formData = new FormData();
        formData.append("percentageId", getMappedId(date, row.id));
        formData.append("title", data.title);
        formData.append("body", data.description);
        console.log(getMappedId(date, row.id));
        postWeakAttendance(formData);
      }
    }
  };

  useEffect(() => {
    if (waekAttendanceData && waekAttendanceData?.status === true) {
      toast.success(waekAttendanceData?.message);
      handleClose();
    }
  }, [waekAttendanceData]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.errors?.title[0]);
    }
  }, [error]);

  return (
    <Card elevation={1} sx={{ p: 3, borderRadius: 3 }}>
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

      <RetentionModal
        open={open}
        onClose={handleClose}
        onSubmit={(data, row) => handleSubmit(data, row)}
        selectedRow={selectedRow}
        predefinedOptions={predefinedOptions}
        isLoading={loadingData}
      />
    </Card>
  );
};

export default WeakAttendanceTable;

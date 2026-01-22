import React, { useEffect } from "react";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  formatDateToReadableString,
  formatTimeFromDecimalMinutes,
  formatTimeFromSeconds,
  getAgeForStudent,
} from "../../utils/Hooks";
import { useGetStudentDetailsMutation } from "../../redux/slices/apiSlice";

const StudentDetailsModal = ({ open, onClose, studentId }) => {
  const [getDetails, { data, isLoading }] = useGetStudentDetailsMutation();

  useEffect(() => {
    if (open && studentId) {
      const formData = new FormData();
      formData.append("UserId", studentId);
      getDetails(formData);
    }
  }, [open, studentId]);

  console.log(data);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleIcon />
          Student Details
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: "100%", p: 3 }}>
            {/* Student Info */}
            <Typography variant="h6" gutterBottom>
              Student Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Name:</strong> {data?.data?.studentName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {data?.data?.email}
                </Typography>
                <Typography>
                  <strong>Report Generated Count:</strong>{" "}
                  {data?.data?.reportCardGeneatedCount}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  <strong>Report Period:</strong> {data?.data?.fromDate} →{" "}
                  {data?.data?.toDate}
                </Typography>
                <Typography>
                  <strong>Attendance:</strong>{" "}
                  {data?.data?.attendancePercentage}%
                </Typography>
                <Typography>
                  <strong>Age:</strong> {getAgeForStudent(data?.data?.dob)}
                </Typography>
              </Grid>
            </Grid>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">Present Days</Typography>
                    <Typography variant="h5">
                      {data?.data?.presentDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">Absent Days</Typography>
                    <Typography variant="h5">
                      {data?.data?.absentDays}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">
                      Total Screen Time
                    </Typography>
                    <Typography variant="h5">
                      {formatTimeFromDecimalMinutes(
                        data?.data?.totalScreenTime,
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary">
                      Avg Time / Day
                    </Typography>
                    <Typography variant="h5">
                      {formatTimeFromDecimalMinutes(
                        data?.data?.avgTimeSpentPerDay,
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Daily Screen Time Table */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Daily Screen Time
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Screen Time</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.data?.dailyScreenTime?.map((item) => (
                    <TableRow key={item.date}>
                      <TableCell>
                        {formatDateToReadableString(item.date)}
                      </TableCell>
                      <TableCell align="right">
                        {formatTimeFromDecimalMinutes(item.screenTime)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* Game Play Info Table */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Game Play Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Game Name</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Time Spent</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Stars</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data?.data?.gamePlayInfo?.length > 0 ? (
                    data.data.gamePlayInfo.map((game, index) => (
                      <TableRow key={index}>
                        <TableCell>{game.gameName}</TableCell>
                        <TableCell align="right">
                          {formatTimeFromSeconds(game.timeSpentInSeconds)}
                        </TableCell>
                        <TableCell align="right">{game.stars}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No game activity found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetailsModal;

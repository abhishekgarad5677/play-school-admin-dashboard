import React, { useEffect } from "react";
import PeopleIcon from "@mui/icons-material/People";
import {
  Box,
  Paper,
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
import Grid from "@mui/material/Grid2";
import {
  formatDateToReadableString,
  formatTimeFromDecimalMinutes,
  formatTimeFromSeconds,
  getAgeForStudent,
} from "../../utils/Hooks";
import { useGetUserBucketStudentDetailsMutation } from "../../redux/slices/apiSlice";

const UserBucketStudentDetailsModal = ({ open, onClose, studentId }) => {
  const [getDetails, { data, isLoading }] =
    useGetUserBucketStudentDetailsMutation();

  useEffect(() => {
    if (open && studentId) {
      const formData = new FormData();
      formData.append("UserId", studentId);
      getDetails(formData);
    }
  }, [open, studentId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PeopleIcon />
          User Activity Details
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: "100%", p: 3 }}>
            {/* ✅ Student Info — always shown */}
            <Typography variant="h6" gutterBottom>
              Child's Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={6}>
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
              <Grid size={6}>
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

            {/* ✅ Condition: if both 0 show no activity, else show full details */}
            {data?.data?.presentDays === 0 && data?.data?.absentDays === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 6,
                  mt: 3,
                  gap: 2,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <PeopleIcon sx={{ fontSize: 60, color: "text.disabled" }} />
                <Typography variant="h6" color="text.secondary">
                  No Activity Found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.disabled"
                  textAlign="center"
                >
                  This user hasn't recorded any activity yet.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Stats Cards */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid size={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary">
                          Present Days
                        </Typography>
                        <Typography variant="h5">
                          {data?.data?.presentDays}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary">
                          Absent Days
                        </Typography>
                        <Typography variant="h5">
                          {data?.data?.absentDays}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={3}>
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
                  <Grid size={3}>
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
              </>
            )}
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

export default UserBucketStudentDetailsModal;

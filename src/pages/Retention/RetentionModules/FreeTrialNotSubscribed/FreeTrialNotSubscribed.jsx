import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import {
  useGetFreeTrialExpiredNOTSubscribedDataMutation,
  useGetSendNotificationFreeTrialExpiredNOTSubscribedMutation,
} from "../../../../redux/slices/apiSlice";
import RetentionModal from "../../../../components/modal/RetentionModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableSkeleton from "../../../../components/skeleton/TableSkeleton";
import { TableWithExport } from "../../../../components/table/TableWithExport";
import { useFormattedDate } from "../../../../utils/Hooks";

const FreeTrialNotSubscribed = ({ expanded }) => {
  const [
    postNotSubscribed,
    { isLoading: loadingData, error, data: notSubscribedData },
  ] = useGetSendNotificationFreeTrialExpiredNOTSubscribedMutation();

  const [
    postGetData,
    { isLoading, error: errorLoadingData, data: notificationData },
  ] = useGetFreeTrialExpiredNOTSubscribedDataMutation();

  const [data, setData] = useState();
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (expanded === "panel4") {
      const formData = new FormData();
      formData.append("name", "freetrialpending");
      postGetData(formData);
    }
  }, [expanded]);

  useEffect(() => {
    if (notificationData) {
      setData(notificationData?.data?.data?.notifications);
      setRowCount(notificationData?.data?.data?.totalCount);
    }
  }, [notificationData]);

  const predefinedOptions = [
    {
      id: 1,
      title: "TMKOC Playschool",
      description:
        "Your Free Trial Has Expired! Subscribe Now to Continue Your Child's Learning Journey!",
    },
    {
      id: 2,
      title: "TMKOC Playschool",
      description:
        "Oh no! Free Trial Expired? No Worries, Subscribe Now & Resume Your Kid's Fun Learning Journey!",
    },
    {
      id: 3,
      title: "TMKOC Playschool",
      description:
        "Resume Your Child's Fun Learning Journey by Subscribing to TMKOC Playschool App Now!",
    },
  ];

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (notSubscribedData && notSubscribedData?.status === true) {
      toast.success(notSubscribedData?.message);
      handleClose();
    }
  }, [notSubscribedData]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.errors?.title[0]);
    }
  }, [error]);

  const handleSubmit = (data, row) => {
    if (data && row) {
      if (data.type === "custom") {
        const formData = new FormData();
        formData.append("Name", "freetrialpending");
        formData.append("Title", data.title);
        formData.append("Body", data.para);
        postNotSubscribed(formData);
      } else {
        const formData = new FormData();
        formData.append("Name", "freetrialpending");
        formData.append("Title", data.title);
        formData.append("Body", data.description);
        postNotSubscribed(formData);
      }
    }
  };

  const selectedRow = {
    id: "1",
    title: "Free trial due and pending",
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Sent On",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    },
    { field: "title", headerName: "Title", width: 250 },
    { field: "body", headerName: "Body", width: 350 },
    { field: "sentCount", headerName: "Sent Count", width: 250 },
    { field: "openedCount", headerName: "Open Count", width: 250 },
    // { field: "failedCount", headerName: "Fail Count", width: 250 },
  ];

  return (
    <>
      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Send Notification Reminder
        </Button>
      </Box>
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <TableWithExport
            userTableData={data?.map((d) => ({ ...d, id: d.id }))}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
            rowCount={rowCount}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        )}
      </Paper>
      <RetentionModal
        open={open}
        onClose={handleClose}
        onSubmit={(data, row) => handleSubmit(data, row)}
        selectedRow={selectedRow}
        predefinedOptions={predefinedOptions}
        isLoading={loadingData}
      />
    </>
  );
};

export default FreeTrialNotSubscribed;

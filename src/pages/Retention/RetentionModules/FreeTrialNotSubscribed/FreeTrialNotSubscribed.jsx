import { Box, Typography, Button, Stack } from "@mui/material";
import { usePostNotSubscribedMutation } from "../../../../redux/slices/apiSlice";
import RetentionModal from "../../../../components/modal/RetentionModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const FreeTrialNotSubscribed = () => {
  const [
    postNotSubscribed,
    { isLoading: loadingData, error, data: notSubscribedData },
  ] = usePostNotSubscribedMutation();

  const predefinedOptions = [
    {
      id: 1,
      title: "TMKOC Playschool",
      description:
        "Your Free Trial Has Expired! Subscribe Now to Continue Your Child's Learning Progress!",
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
        formData.append("title", data.title);
        formData.append("body", data.para);
        // postNotSubscribed(formData);
      } else {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("body", data.description);
        // postNotSubscribed(formData);
      }
    }
  };

  const selectedRow = {
    id: "1",
    title: "Free trial expired and not subscribed",
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#fff",
        border: "1px solid #000",
        textAlign: "center",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography variant="h6" color="textSecondary" fontWeight={600}>
          Send Notification to free trial expired and not subscribed
        </Typography>

        {/* <Typography variant="body2" color="text.secondary" align="center">
          This user hasn’t subscribed to receive notifications. You can still
          send a manual reminder prompting them to enable notifications for
          updates, offers, and alerts.
        </Typography> */}

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Send Notification Reminder
        </Button>
      </Stack>
      <RetentionModal
        open={open}
        onClose={handleClose}
        onSubmit={(data, row) => handleSubmit(data, row)}
        selectedRow={selectedRow}
        predefinedOptions={predefinedOptions}
        isLoading={loadingData}
      />
    </Box>
  );
};

export default FreeTrialNotSubscribed;

import { Box, Typography, Button, Stack } from "@mui/material";
import { usePostNotSubscribedMutation } from "../../../../redux/slices/apiSlice";
import RetentionModal from "../../../../components/modal/RetentionModal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NotSubscribed = () => {
  const [
    postNotSubscribed,
    { isLoading: loadingData, error, data: notSubscribedData },
  ] = usePostNotSubscribedMutation();

  const predefinedOptions = [
    {
      id: 1,
      title: "TMKOC Playschool",
      description: "You’re missing out on full access — subscribe today!",
    },
    {
      id: 2,
      title: "TMKOC Playschool",
      description: "Unlock more games and learning with a subscription!",
    },
    {
      id: 3,
      title: "TMKOC Playschool",
      description:
        "Subscribe now to get the most out of your playschool journey!",
    },
    {
      id: 4,
      title: "TMKOC Playschool",
      description: "More fun, more learning — just one step away!",
    },
    {
      id: 5,
      title: "TMKOC Playschool",
      description: "Join the full experience — subscribe and explore it all!",
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
        postNotSubscribed(formData);
      } else {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("body", data.description);
        postNotSubscribed(formData);
      }
    }
  };

  const selectedRow = {
    id: "1",
    title: "non subscribed users",
    description: "Student has below average attendance",
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
          Send Notification to Non-Subscribed Users
        </Typography>

        {/* <Typography variant="body2" color="text.secondary" align="center">
          This user hasn’t subscribed to receive notifications. You can still
          send a manual reminder prompting them to enable notifications for
          updates, offers, and alerts.
        </Typography> */}

        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
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

export default NotSubscribed;

import { Box, Paper } from "@mui/material";
import React from "react";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";

const Notification = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Notification",
                        href: "/dashboard/notification",
                        icon: <NotificationsActiveIcon fontSize="small" />
                    }
                ]}
            />
            <Paper sx={{ height: "85vh", width: '100%', padding: 3 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    mb={2}
                    sx={{
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                    }}
                >
                    <>Notification</>
                </Box>
            </Paper>
        </>
    )
}

export default Notification;
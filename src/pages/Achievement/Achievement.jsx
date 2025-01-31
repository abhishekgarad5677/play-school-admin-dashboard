import { Box, Paper } from "@mui/material";
import React from "react";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";

const Achievement = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Achievement",
                        href: "/dashboard/students",
                        icon: <EmojiEventsIcon fontSize="small" />
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
                    <>Achievement</>
                </Box>
            </Paper>
        </>
    )
}

export default Achievement;
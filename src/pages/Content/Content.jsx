import { Box, Paper } from "@mui/material";
import React from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import EditNoteIcon from '@mui/icons-material/EditNote';

const Content = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Content",
                        href: "/dashboard/content",
                        icon: <EditNoteIcon fontSize="small" />
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
                    <>Content</>
                </Box>
            </Paper>
        </>
    )
}

export default Content;
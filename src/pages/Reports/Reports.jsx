import { Box, Paper } from "@mui/material";
import React from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";

const Reports = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Reports",
                        href: "/dashboard/reports",
                        icon: <AssignmentIcon fontSize="small" />
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
                    <>reports</>
                </Box>
            </Paper>
        </>
    )
}

export default Reports;
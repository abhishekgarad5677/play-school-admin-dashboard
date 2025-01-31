import { Box, Paper } from "@mui/material";
import React from "react";
import GroupsIcon from '@mui/icons-material/Groups';
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";

const AgeGroup = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "AgeGroup",
                        href: "/dashboard/age-group",
                        icon: <GroupsIcon fontSize="medium" />
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
                    <>AgeGroup</>
                </Box>
            </Paper>
        </>
    )
}

export default AgeGroup;
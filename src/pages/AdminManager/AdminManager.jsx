import { Box, Paper } from "@mui/material";
import React from "react";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";

const AdminManager = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Admin Manager",
                        href: "/dashboard/admin-manager",
                        icon: <ManageAccountsIcon fontSize="small" />
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
                    <>AdminManager</>
                </Box>
            </Paper>
        </>
    )
}

export default AdminManager;
import { Box, Paper } from "@mui/material";
import React from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

const Subscription = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Subscription",
                        href: "/dashboard/subscription",
                        icon: <CurrencyExchangeIcon fontSize="small" />
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
                    <>Subscription</>
                </Box>
            </Paper>
        </>
    )
}

export default Subscription;
import { Box, Paper } from "@mui/material";
import React from "react";
import CategoryIcon from '@mui/icons-material/Category';
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";

const Category = () => {
    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Category",
                        href: "/dashboard/category",
                        icon: <CategoryIcon fontSize="small" />
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
                    <>Category</>
                </Box>
            </Paper>
        </>
    )
}

export default Category;
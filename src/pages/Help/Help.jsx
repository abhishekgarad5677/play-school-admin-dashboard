import { Box, Button, Chip, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { CommonTable } from "../../components/table/Table";
import { useFormattedDate } from "../../utils/Hooks";
import { useGetQueryMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import GroupIcon from "@mui/icons-material/Group";

const Help = () => {
  const [postQuery, { isLoading, error, data: queryData }] =
    useGetQueryMutation();

  const [data, setData] = useState();

  useEffect(() => {
    postQuery({});
  }, []);

  useEffect(() => {
    if (queryData) {
      setData(queryData?.data);
      console.log(queryData?.data);
    }
  }, [queryData]);

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "phoneNumber", headerName: "Phone Number", width: 200 },
    { field: "email", headerName: "Email", width: 300 },
    { field: "query", headerName: "Query", width: 280 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      renderCell: (params) => useFormattedDate(params?.row?.updatedAt),
    },
  ];

  if (error) {
    return (
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <h1>Something went wrong</h1>
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Help Desk",
            href: "/dashboard/help-desk",
            icon: <GroupIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{
            gap: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* search student */}
          <TextField
            label="search"
            variant="outlined"
            size="small"
            onChange={(e) => filterUserData(e)}
          />
        </Box>

        {/* students table data */}
        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <CommonTable
            userTableData={data}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
          />
        )}
      </Paper>
    </>
  );
};

export default Help;

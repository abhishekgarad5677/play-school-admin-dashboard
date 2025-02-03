import { Box, Button, Chip, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import ChildCareIcon from '@mui/icons-material/ChildCare'
import { CommonTable } from "../../components/table/Table";
import { useFormattedDate } from "../../utils/Hooks";
import { useGetallstudentsinfoMutation } from "../../redux/slices/apiSlice";
import TableSkeleton from "../../components/skeleton/TableSkeleton";

const Students = () => {

    const [data, setData] = useState();

    const [postDataStudent, { isLoading, error, data: studentsData }] = useGetallstudentsinfoMutation();

    useEffect(() => {
        postDataStudent({})
    }, []);

    useEffect(() => {
        if (studentsData) {
            setData(studentsData?.data);
        }
    }, [studentsData]);

    const columns = [
        {
            field: "parentName",
            headerName: "Parent Name",
            width: 150,
            renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* <UserAvatar name={params?.row?.parentName} /> */}
                    <span>{params?.row?.parentName}</span>
                </div>
            ),
        },
        { field: 'studentId', headerName: 'Student ID', width: 100 },
        { field: 'childsName', headerName: "Child's Name", width: 150 },
        { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
        { field: 'email', headerName: 'Email', width: 230 },
        { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150, renderCell: (params) => useFormattedDate(params?.row?.dateOfBirth) },
        {
            field: 'gender',
            headerName: 'Gender',
            width: 100,
            renderCell: (params) => (
                <Chip
                    size="small"
                    label={params?.row?.gender}
                    sx={{
                        backgroundColor: params?.row?.gender === "Boy" ? "#448aff" : "#e666fb",
                        color: "white",
                        fontWeight: "medium",
                        padding: "5px",
                    }}
                />
            )
        },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'country', headerName: 'Country', width: 150 },
        { field: 'ageGroup', headerName: 'Age Group', width: 100 },
        {
            field: "activitityPrefs",
            headerName: "Activity Preferences",
            width: 250,
            renderCell: (params) => (
                params?.row?.activitityPrefs.map((activity) => {
                    return <Chip sx={{ marginRight: 1 }} size="small" key={activity} label={activity} />
                })
            )
        },
        { field: 'planName', headerName: 'Plan Name', width: 150 },
        { field: 'registeredDate', headerName: 'Registered Date', width: 200, renderCell: (params) => useFormattedDate(params?.row?.registeredDate) },
        { field: 'planExpiryDate', headerName: 'Plan Expiry Date', width: 200, renderCell: (params) => useFormattedDate(params?.row?.planExpiryDate) },
        { field: 'lastActiveDate', headerName: 'Last Active Date', width: 200, renderCell: (params) => useFormattedDate(params?.row?.lastActiveDate) },
        { field: 'languageName', headerName: 'Language', width: 150 }
    ];


    return (
        <>
            <CustomBreadcrumbs
                items={[
                    {
                        label: "Students",
                        href: "/dashboard/students",
                        icon: <ChildCareIcon fontSize="small" />
                    }
                ]}
            />
            <Paper sx={{ height: "auto", width: '100%', padding: 3 }}>
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
                    {/* search student */}
                    <TextField
                        label="search student"
                        variant="outlined"
                        size="small"
                        onChange={(e) => filterUserData(e)}
                    />
                </Box>

                {/* students table data */}
                {isLoading ? <TableSkeleton rows={10} columns={6} /> : (
                    <CommonTable
                        userTableData={data}
                        columns={columns}
                        pageSizeOptions={[10, 15, 20, 50, 100]}
                    />
                )}

            </Paper>
        </>
    )
}

export default Students;
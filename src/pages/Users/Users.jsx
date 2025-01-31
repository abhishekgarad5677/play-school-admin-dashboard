import * as React from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState, useContext } from 'react';
import { useEffect } from 'react';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EditUser } from '../../components/modal/EditUser';
import { AddUser } from '../../components/modal/AddUser';
import { DeleteUser } from '../../components/modal/DeleteUser';
import { UserContext } from '../../utils/UserContext';
import { CommonTable } from '../../components/table/Table';
import { LoadingData } from '../../components/loader/LoadingData';
import CustomBreadcrumbs from '../../components/breadcrumb/CustomBreadcrumbs';
import GroupIcon from '@mui/icons-material/Group';

const Users = () => {

    const [userTableData, setUserTabelData] = useState([])
    const [loadingData, setLoadingData] = useState(true)
    const [userData, setUserData] = useState()

    // user list data
    const { allUsersData, setAllUsersData } = useContext(UserContext)

    // set user data for displaying in table
    useEffect(() => {
        if (allUsersData) {
            setUserTabelData(allUsersData)
            setTimeout(() => setLoadingData(false), 1000)
        }
    }, [allUsersData])

    // user table columns
    const columns = [
        { field: 'id', headerName: 'User ID', width: 200 },
        { field: 'fullName', headerName: 'Name', width: 230 },
        { field: 'email', headerName: 'Email', width: 400 },
        { field: 'role', headerName: 'Role', width: 250, },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <div>
                    <IconButton
                        aria-label="add"
                        color="primary"
                        onClick={() => handleEdit(params.row)}
                    >
                        <Tooltip title="Edit">
                            <EditIcon />
                        </Tooltip>
                    </IconButton>

                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDelete(params.row)}
                    >
                        <Tooltip title="Delete">
                            <DeleteIcon />
                        </Tooltip>
                    </IconButton>
                </div>
            ),
        },
    ];

    // state for edit user modal
    const [openEditModal, setOpenEditModal] = useState(false);
    const handleOpenEdit = () => setOpenEditModal(true);
    const handleCloseEdit = () => setOpenEditModal(false);

    // state for add user modal
    const [openAddModal, setOpenAddModal] = useState(false);
    const handleOpenAdd = () => setOpenAddModal(true);
    const handleCloseAdd = () => setOpenAddModal(false);

    // state for Delete user modal
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const handleOpenDelete = () => setOpenDeleteModal(true);
    const handleCloseDelete = () => setOpenDeleteModal(false);

    // trigger edit user modal
    const handleEdit = (data) => {
        // console.log(data);
        setUserData(data)
        handleOpenEdit()
    };

    // trigger delete user modal
    const handleDelete = (data) => {
        setUserData(data)
        handleOpenDelete()
    };

    // filter user data
    const filterUserData = (e) => {
        console.log(e.target.value);
        const value = e.target.value.toLowerCase();

        if (!value) {
            setUserTabelData(allUsersData);
        } else {
            const newdata = allUsersData?.filter((ele) => {
                return ele.fullName.toLowerCase().includes(value) || ele.email.toLowerCase().includes(value);
            });
            setUserTabelData(newdata);
        }
    };

    // loader till the data is being fetched
    if (loadingData) return <LoadingData />

    return (
        <>
            <CustomBreadcrumbs
                items={[
                    { label: "Users", href: "/dashboard/users", icon: <GroupIcon fontSize="small" /> }
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
                    {/* search user */}
                    <TextField
                        label="search user"
                        variant="outlined"
                        size="small"
                        onChange={(e) => filterUserData(e)}
                    />
                    {/* add user button */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            width: { xs: '100%', sm: 'auto' },
                        }}
                        onClick={() => handleOpenAdd()}
                    >
                        Add User
                    </Button>
                </Box>

                {/* user table data */}
                <CommonTable
                    userTableData={userTableData}
                    columns={columns}
                    pageSizeOptions={[10, 15, 20, 50, 100]}
                />

                {/* Edit user modal */}
                {openEditModal && <EditUser
                    open={openEditModal}
                    handleClose={handleCloseEdit}
                    userData={userData}
                />}

                {/* Add user modal */}
                {openAddModal && <AddUser
                    open={openAddModal}
                    handleClose={handleCloseAdd}
                    setAllUsersData={setAllUsersData}
                    allUsersData={allUsersData}
                    setUserTabelData={setUserTabelData}
                />}

                {/* Delete user modal */}
                {openDeleteModal && <DeleteUser
                    open={openDeleteModal}
                    handleClose={handleCloseDelete}
                    userData={userData}
                    setUserTabelData={setUserTabelData}
                />}

            </Paper>
        </>
    );
}

export default Users;
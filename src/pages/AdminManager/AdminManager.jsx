import React, { useState, useEffect } from "react";
import { Box, Button, Paper, Tooltip } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import AddAdminModal from "../../components/modal/AddAdminModal";
import EditAdminModal from "../../components/modal/EditAdminPermissionModal"; // Import the Edit Admin Modal
import EditIcon from "@mui/icons-material/Edit";

// ✅ Assume you have this mutation in RTK Query
import {
  useCreateAdminMutation,
  useGetAdminListQuery,
  useUpdateAdminPermissionMutation,
} from "../../redux/slices/roleBaseSlice";
import { CommonTable } from "../../components/table/Table";
import TableSkeleton from "../../components/skeleton/TableSkeleton";

const AdminManager = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // To store user data for editing
  const [tableData, setTableData] = useState([]);

  const [createAdmin, { isLoading: submitting }] = useCreateAdminMutation();
  const [updateAdminPermission, { isLoading: updating }] =
    useUpdateAdminPermissionMutation();

  const {
    data: adminUsersData,
    isLoading,
    error,
    refetch,
  } = useGetAdminListQuery();

  const columns = [
    { field: "userName", headerName: "User Name", width: 200 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Edit User Permissions">
          <EditIcon
            sx={{ color: "#5d87ff", cursor: "pointer" }}
            onClick={() => handleOpenEditModal(params.row)} // Open edit modal on click
          />
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    if (adminUsersData?.status === true) {
      setTableData(adminUsersData?.data || []);
    }
  }, [adminUsersData]);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleSubmit = async (payload) => {
    // Handle admin creation
    try {
      const formData = new FormData();
      formData.append("UserName", payload.UserName);
      formData.append("Email", payload.Email);
      formData.append("Password", payload.Password);

      payload.PermissionIds.forEach((id) => {
        formData.append("PermissionIds", id); // Send array elements separately
      });

      await createAdmin(formData).unwrap();
      await refetch();
      setOpenAddModal(false);
    } catch (err) {
      console.error("Create admin failed:", err);
    }
  };

  const handleEditSubmit = async (payload) => {
    try {
      await updateAdminPermission(payload).unwrap();
      setOpenEditModal(false);
      refetch(); // Refresh the table after updating permissions
    } catch (err) {
      console.error("Update permissions failed:", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 1,
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "Manage Admin",
              href: "/dashboard/manage-admin",
              icon: <ManageAccountsIcon fontSize="small" />,
            },
          ]}
        />

        <Button variant="contained" onClick={handleOpenAddModal}>
          Add Admin
        </Button>
      </Box>

      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <CommonTable
            userTableData={tableData.map((d) => ({ ...d, id: d.userId })) || []}
            columns={columns}
            pageSizeOptions={[10, 15, 20, 50, 100]}
          />
        )}
      </Paper>

      {/* Add Admin Modal */}
      <AddAdminModal
        open={openAddModal}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      {/* Edit Admin Permission Modal */}
      {selectedUser && (
        <EditAdminModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          onSubmit={handleEditSubmit}
          userData={selectedUser} // Pass selected user data to the modal
          submitting={updating}
        />
      )}
    </>
  );
};

export default AdminManager;

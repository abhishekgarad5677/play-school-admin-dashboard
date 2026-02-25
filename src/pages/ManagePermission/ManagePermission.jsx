import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { SideBarRoutes } from "../../utils/SideBarRoutes";
import {
  useCreatePermissionMutation,
  useGetPermissionsQuery,
  // useCreatePermissionMutation,
} from "../../redux/slices/roleBaseSlice";
import { CommonTable } from "../../components/table/Table";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import PermissionModal from "../../components/modal/PermissionModal";

const BLOCKED_PATHS = new Set(["/manage-admin", "/manage-permission"]);

const ManagePermission = () => {
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);

  const {
    data: permissionsData,
    isLoading,
    refetch,
  } = useGetPermissionsQuery();
  const [createPermission, { isLoading: creating }] =
    useCreatePermissionMutation();

  useEffect(() => {
    if (permissionsData?.status === true) {
      setTableData(permissionsData?.data || []);
    }
  }, [permissionsData]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Name", width: 250 },
    // { field: "frontendRoute", headerName: "Route", width: 300 },
  ];

  const existingPermissionRoutes = useMemo(() => {
    const s = new Set();
    (permissionsData?.data || []).forEach((p) => {
      if (p?.frontendRoute) s.add(p.frontendRoute);
    });
    return s;
  }, [permissionsData]);

  const availableRoutes = useMemo(() => {
    const seen = new Set();

    return (SideBarRoutes || [])
      .filter((r) => r?.path)
      .filter((r) => !BLOCKED_PATHS.has(r.path))
      .filter((r) => !existingPermissionRoutes.has(r.path))
      .filter((r) => {
        if (seen.has(r.path)) return false;
        seen.add(r.path);
        return true;
      })
      .map((r) => ({ title: r.title, path: r.path }));
  }, [existingPermissionRoutes]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreatePermission = async ({ name, frontendRoute }) => {
    try {
      const formData = new FormData();
      formData.append("Name", name);
      formData.append("FrontendRoute", frontendRoute);
      formData.append("Description", "");

      await createPermission(formData).unwrap();

      setOpen(false);

      // ✅ Immediately fetch updated permission list
      await refetch();
    } catch (e) {
      console.error("Create permission failed:", e);
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
              label: "Manage Permission",
              href: "/manage-permission",
              icon: <ManageAccountsIcon fontSize="small" />,
            },
          ]}
        />

        <Button variant="contained" onClick={handleOpen}>
          Add Permission
        </Button>
      </Box>

      <Paper sx={{ height: "85vh", width: "100%", padding: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={2}
          sx={{ gap: 1, flexDirection: { xs: "column", sm: "row" } }}
        >
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <CommonTable
              userTableData={tableData}
              columns={columns}
              pageSizeOptions={[10, 15, 20, 50, 100]}
            />
          )}
        </Box>
      </Paper>

      <PermissionModal
        open={open}
        onClose={handleClose}
        onSubmit={handleCreatePermission}
        submitting={creating}
        availableRoutes={availableRoutes}
      />
    </>
  );
};

export default ManagePermission;

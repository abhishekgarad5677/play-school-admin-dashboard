import { useEffect, useState } from "react";
import { Box, Button, Paper, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useGetAllGameCategoriesMutation } from "../../redux/slices/apiSlice";
import { CommonTable } from "../../components/table/Table";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const GamesList = () => {
  const [data, setData] = useState();

  const navigate = useNavigate();

  const [postGetGames, { isLoading, error, data: gamesData }] =
    useGetAllGameCategoriesMutation();

  useEffect(() => {
    postGetGames({});
  }, []);

  useEffect(() => {
    if (gamesData && gamesData?.status === true) {
      setData(gamesData?.data);
      console.log(gamesData?.data);
    }
  }, [gamesData]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Game Name", width: 250 },
    { field: "numberOfGames", headerName: "Number Of Games", width: 200 },
    { field: "ageGroup", headerName: "Age Group", width: 200 },
    { field: "skillTags", headerName: "Skill Tags", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}
        >
          {/* <Tooltip title="Add">
            <AddCircleIcon
              //   onClick={() => handleOpen(params.row)}
              sx={{ color: "#5d87ff", cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <EditIcon
              //   onClick={() => handleOpen(params.row)}
              sx={{ color: "#5d87ff", cursor: "pointer" }}
            />
          </Tooltip> */}
          <Tooltip title="View">
            <RemoveRedEyeIcon
              onClick={() => navigate(`/dashboard/view-game/${params.row.id}`)}
              sx={{ color: "#5d87ff", cursor: "pointer" }}
            />
          </Tooltip>
          {/* <DeleteIcon
            //   onClick={() => handleOpen(params.row)}
            sx={{ color: "#5d87ff", cursor: "pointer" }}
          /> */}
        </Box>
      ),
    },
  ];

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
              label: "Add Games",
              href: "/dashboard/games-list",
              icon: <SportsEsportsIcon fontSize="small" />,
            },
          ]}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            width: { xs: "100%", sm: "auto", backgroundColor: "#5D87FF" },
          }}
          onClick={() => navigate("/dashboard/add-games-category")}
        >
          Add Category
        </Button>
      </Box>
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
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
export default GamesList;

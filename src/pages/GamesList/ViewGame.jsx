import { useEffect, useState } from "react";
import { Box, Button, Paper, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {
  useGetGamesByCategoryMutation,
  useGetAllGameCategoriesMutation,
} from "../../redux/slices/apiSlice";
import { CommonTable } from "../../components/table/Table";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteIcon from "@mui/icons-material/Delete";
import GameDeleteModal from "./GameDeleteModal";

const ViewGame = () => {
  const [data, setData] = useState();

  const { id } = useParams(); // Assuming you want to use the id from the URL

  const [postGetGames, { isLoading, error, data: gamesData }] =
    useGetGamesByCategoryMutation();

  useEffect(() => {
    const formData = new FormData();
    formData.append("categoryId", id); // Append the id to the FormData
    postGetGames(formData);
  }, [id]);

  useEffect(() => {
    if (gamesData && gamesData?.status === true) {
      setData(gamesData?.data);
      console.log(gamesData?.data);
    }
  }, [gamesData]);

  const [open, setOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const handleOpen = (rowId) => {
    setSelectedRowId(rowId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const columns = [
    { field: "id", headerName: "Game Id", width: 150 },
    { field: "gameName", headerName: "Game Name", width: 250 },
    { field: "totalLevel", headerName: "Total Level", width: 200 },
    { field: "isTest", headerName: "isTest", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
          <Tooltip title="Delete">
            <DeleteIcon
              onClick={() =>
                handleOpen(params.id ?? params.row?.id ?? params.row?.gameId)
              }
              sx={{ color: "#5d87ff", cursor: "pointer" }}
            />
          </Tooltip>
        </Box>
      ),
    },
  ];

  const navigate = useNavigate();

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
          onClick={() => navigate(`/dashboard/add-games/${id}`)}
        >
          Add Game
        </Button>
      </Box>
      <Link
        style={{
          textDecoration: "none",
          color: "#1976d2",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
        to={"/dashboard/games-list"}
      >
        <ArrowBackIosIcon sx={{ fontSize: 14 }} />
        back
      </Link>
      <Paper sx={{ height: "auto", width: "100%", padding: 3, marginTop: 2 }}>
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
      <GameDeleteModal
        open={open}
        handleClose={handleClose}
        rowId={selectedRowId}
        postGetGames={postGetGames}
        id={id}
      />
    </>
  );
};
export default ViewGame;

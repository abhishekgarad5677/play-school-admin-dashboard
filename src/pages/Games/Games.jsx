import { useEffect, useState } from "react";
import { Box, Paper, TextField } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import { useGetGamesMutation } from "../../redux/slices/apiSlice";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import { CommonTable } from "../../components/table/Table";
import { formatPlayTime } from "../../utils/Hooks";

const Games = () => {
  const [data, setData] = useState();

  const [postGetGames, { isLoading, error, data: gamesData }] =
    useGetGamesMutation();

  useEffect(() => {
    postGetGames({});
  }, []);

  useEffect(() => {
    if (gamesData && gamesData?.status === true) {
      setData(gamesData?.data?.allGamesData);
    }
  }, [gamesData]);

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "name", headerName: "Game Name", width: 250 },
    { field: "playCount", headerName: "Play Count", width: 200 },
    {
      field: "playTimeInMinutes",
      headerName: "Duration Played",
      width: 250,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{formatPlayTime(params?.row?.playTimeInMinutes)}</span>
        </div>
      ),
    },
  ];

  return (
    <>
      <CustomBreadcrumbs
        items={[
          {
            label: "Games",
            href: "/dashboard/games",
            icon: <SportsEsportsIcon fontSize="small" />,
          },
        ]}
      />
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        {/* <Box
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

          <TextField
            label="search game"
            variant="outlined"
            size="small"
            onChange={(e) => filterUserData(e)}
          />
        </Box> */}

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

export default Games;

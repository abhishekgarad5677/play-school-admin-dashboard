// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Chip,
//   Paper,
//   Tab,
//   Tabs,
//   TextField,
//   Tooltip,
// } from "@mui/material";
// import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
// import {
//   useFreeTrialClickedButNotStartedMutation,
//   usePhoneNumberAddedFreeTrialNotClickedMutation,
//   useSubscriptionCancelledMutation,
// } from "../../redux/slices/apiSlice";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import CustomRangeSelect from "../../utils/CustomRangeSelect";
// import DatePicker from "react-datepicker";
// import { dateFilterOptions } from "../../utils/constant";
// import PropTypes from "prop-types";
// import InfoIcon from "@mui/icons-material/Info";
// import TableSkeleton from "../../components/skeleton/TableSkeleton";
// import { TableWithExport } from "../../components/table/TableWithExport";
// import {
//   formatDateToReadableString,
//   useFormattedDate,
// } from "../../utils/Hooks";
// import ListAltIcon from "@mui/icons-material/ListAlt";
// import EditIcon from "@mui/icons-material/Edit";
// import AddCircleIcon from "@mui/icons-material/AddCircle";

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// CustomTabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// const UserBuckets = () => {
//   const [date, setDate] = useState("today");
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [value, setValue] = useState(0);
//   const [data, setData] = useState();
//   const [rowCount, setRowCount] = useState(0);
//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 10,
//   });

//   const handleDateChange = (event) => {
//     const selectedDate = event.target.value;
//     setDate(selectedDate);

//     if (selectedDate === "custom") {
//       // Store the custom date range in sessionStorage
//       sessionStorage.setItem("selectedDate", selectedDate);
//       sessionStorage.setItem("startDate", startDate);
//       sessionStorage.setItem("endDate", endDate);
//     } else {
//       // Store the selected date (e.g., "today", "yesterday", etc.)
//       sessionStorage.setItem("selectedDate", selectedDate);
//       sessionStorage.removeItem("startDate");
//       sessionStorage.removeItem("endDate");
//     }
//   };

//   useEffect(() => {
//     const storedDate = sessionStorage.getItem("selectedDate");
//     const storedStartDate = sessionStorage.getItem("startDate");
//     const storedEndDate = sessionStorage.getItem("endDate");

//     if (storedDate) {
//       setDate(storedDate); // Set the stored date to default value
//     }
//     if (storedStartDate && storedEndDate) {
//       setDateRange([new Date(storedStartDate), new Date(storedEndDate)]); // Set the date range if custom is selected
//     }
//   }, []);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const [postDataStudent, { isLoading, error, data: studentsData }] =
//     usePhoneNumberAddedFreeTrialNotClickedMutation();

//   const [
//     postFreeTrialCliked,
//     {
//       isLoading: freeTrialClikedLoading,
//       error: freeTrialClikedError,
//       data: freeTrialClikedData,
//     },
//   ] = useFreeTrialClickedButNotStartedMutation();

//   const [
//     postSubCancelled,
//     {
//       isLoading: subCancelledLoading,
//       error: subCancelledError,
//       data: subCancelledData,
//     },
//   ] = useSubscriptionCancelledMutation();

//   useEffect(() => {
//     const formData = new FormData();

//     if (date !== "custom") {
//       formData.append("FilterType", date);
//     } else if (date === "custom" && startDate && endDate) {
//       formData.append("FilterType", date);
//       formData.append("FromDate", formatDateToReadableString(startDate));
//       formData.append("ToDate", formatDateToReadableString(endDate));
//     }

//     formData.append("PageSize", paginationModel.pageSize);
//     formData.append("PageNumber", paginationModel.page + 1); // API is 1-indexed
//     // formData.append("statusType", value);
//     if (value === 0) {
//       postDataStudent(formData);
//     } else if (value === 1) {
//       postFreeTrialCliked(formData);
//     } else if (value === 2) {
//       postSubCancelled(formData);
//     }
//   }, [date, startDate, endDate, paginationModel, value]);

//   useEffect(() => {
//     if (studentsData && value === 0) {
//       setData(studentsData?.data?.users);
//       setRowCount(studentsData?.data?.totalUsers);
//     } else if (freeTrialClikedData && value === 1) {
//       setData(freeTrialClikedData?.data?.users);
//       setRowCount(freeTrialClikedData?.data?.totalUsers);
//     } else if (subCancelledData && value === 2) {
//       setData(subCancelledData?.data?.users);
//       setRowCount(subCancelledData?.data?.totalUsers);
//     }
//   }, [studentsData, freeTrialClikedData, subCancelledData]);

//   const columns = [
//     { field: "name", headerName: "Parent's Name", width: 300 },
//     { field: "childName", headerName: "Child name", width: 300 },
//     { field: "phoneNumber", headerName: "Phone Number", width: 300 },
//     {
//       field: "action",
//       headerName: "Action",
//       width: 200,
//       renderCell: (params) => (
//         <Box
//           sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}
//         >
//           <Tooltip title="Add">
//             <AddCircleIcon sx={{ color: "#5d87ff", cursor: "pointer" }} />
//           </Tooltip>
//           {params.row.callCenterFeedback !== null && (
//             <>
//               {" "}
//               <Tooltip title="Edit">
//                 <EditIcon sx={{ color: "#5d87ff", cursor: "pointer" }} />
//               </Tooltip>
//               <Tooltip title="View">
//                 <RemoveRedEyeIcon
//                   sx={{ color: "#5d87ff", cursor: "pointer" }}
//                 />
//               </Tooltip>
//             </>
//           )}
//         </Box>
//       ),
//     },
//   ];

//   const convertToCSV = (array, keys = ["name", "phoneNumber", "childName", "callCenterFeedback"]) => {
//     const header = keys.join(",");
//     const rows = array.map((row) =>
//       keys
//         .map((key) => `"${String(row?.[key] ?? "").replace(/"/g, '""')}"`)
//         .join(","),
//     );
//     return [header, ...rows].join("\n");
//   };

//   const [isExporting, setIsExporting] = useState(false);

//   const handleBatchedExport = async () => {
//     setIsExporting(true);
//     const allData = [];
//     const batchSize = 100;
//     let page = 1;
//     let keepFetching = true;

//     while (keepFetching) {
//       const formData = new FormData();

//       formData.append("FilterType", date);

//       if (date === "custom" && startDate && endDate) {
//         formData.append("FromDate", formatDateToReadableString(startDate));
//         formData.append("ToDate", formatDateToReadableString(endDate));
//       }

//       formData.append("PageSize", batchSize);
//       formData.append("PageNumber", page);
//       //   formData.append("statusType", value);

//       try {
//         let res;
//         if (value === 0) {
//           res = await postDataStudent(formData).unwrap();
//         } else if (value === 1) {
//           res = await postFreeTrialCliked(formData).unwrap();
//         } else if (value === 2) {
//           res = await postSubCancelled(formData).unwrap();
//         }
//         console.log(res?.data);

//         const currentBatch = res?.data?.users || [];

//         allData.push(...currentBatch);

//         if (currentBatch.length < batchSize) {
//           keepFetching = false;
//         } else {
//           page += 1;
//           await new Promise((r) => setTimeout(r, 200)); // avoid API spam
//         }
//       } catch (err) {
//         console.error("Error fetching batch:", err);
//         break;
//       }
//     }

//     if (allData.length) {
//       const csv = convertToCSV(allData);

//       // 🔥 BOM prefix ensures correct UTF-8 rendering in Excel
//       const BOM = "\uFEFF";
//       const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

//       saveAs(blob, "data.csv");
//     } else {
//       alert("No data available to export.");
//     }
//     setIsExporting(false);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <CustomBreadcrumbs
//           items={[
//             {
//               label: "User Buckets",
//               href: "/dashboard/user-buckets",
//               icon: <ListAltIcon fontSize="small" />,
//             },
//           ]}
//         />
//         <Box
//           sx={{
//             marginBottom: 2,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: 3,
//           }}
//         >
//           <CustomRangeSelect
//             value={date}
//             label={"Date"}
//             onChange={handleDateChange}
//             options={dateFilterOptions}
//           />
//           {date === "custom" && (
//             <DatePicker
//               maxDate={new Date()}
//               selectsRange
//               startDate={startDate}
//               endDate={endDate}
//               onChange={(update) => {
//                 setDateRange(update);
//                 const [start, end] = update;
//                 sessionStorage.setItem("startDate", start); // Store the start date
//                 sessionStorage.setItem("endDate", end); // Store the end date
//               }}
//               dateFormat="dd/MM/yyyy"
//               placeholderText="Select date range"
//               customInput={
//                 <TextField
//                   size="small"
//                   fullWidth
//                   label="Custom Date Range"
//                   sx={{ width: 250 }}
//                 />
//               }
//             />
//           )}
//           {data?.length > 1 && (
//             <Button
//               variant="contained"
//               onClick={handleBatchedExport}
//               disabled={isExporting}
//             >
//               {isExporting ? "Exporting..." : "Export All Data"}
//             </Button>
//           )}
//         </Box>
//       </Box>
//       <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
//         <Box sx={{ width: "100%" }}>
//           <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               aria-label="basic tabs example"
//             >
//               <Tab
//                 sx={{ fontSize: 12 }}
//                 label="phone number added but free trial not clicked users"
//                 {...a11yProps(0)}
//               />
//               <Tab
//                 sx={{ fontSize: 12 }}
//                 label="free trial clicked but free trial not started users"
//                 {...a11yProps(1)}
//               />
//               <Tab
//                 sx={{ fontSize: 12 }}
//                 label="subscription cancelled users"
//                 {...a11yProps(2)}
//               />
//             </Tabs>
//           </Box>
//           {isLoading || freeTrialClikedLoading ? (
//             <TableSkeleton rows={10} columns={6} />
//           ) : (
//             <TableWithExport
//               userTableData={data?.map((d) => ({ ...d, id: d?.email }))}
//               columns={columns}
//               pageSizeOptions={[10, 15, 20, 50, 100, 200]}
//               rowCount={rowCount}
//               paginationModel={paginationModel}
//               onPaginationModelChange={setPaginationModel}
//             />
//           )}
//         </Box>
//       </Paper>
//     </>
//   );
// };

// export default UserBuckets;

import React, { useEffect, useState } from "react";
import { Box, Button, Paper, Tab, Tabs, Tooltip } from "@mui/material";
import CustomBreadcrumbs from "../../components/breadcrumb/CustomBreadcrumbs";
import {
  useAddFeedbackMutation,
  useFreeTrialClickedButNotStartedMutation,
  usePhoneNumberAddedFreeTrialNotClickedMutation,
  useSubscriptionCancelledMutation,
} from "../../redux/slices/apiSlice";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CustomRangeSelect from "../../utils/CustomRangeSelect";
import DatePicker from "react-datepicker";
import { dateFilterOptions } from "../../utils/constant";
import { formatDateToReadableString, useFormattedDate } from "../../utils/Hooks";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PropTypes from "prop-types";
import { TableWithExport } from "../../components/table/TableWithExport";
import TableSkeleton from "../../components/skeleton/TableSkeleton";
import ViewFeedbackModal from "../../components/modal/ViewFeedbackModal";
import AddFeedbackModal from "../../components/modal/AddFeedbackModal";
import EditFeedbackModal from "../../components/modal/EditFeedbackModal";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserBuckets = () => {
  const [date, setDate] = useState("today");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [value, setValue] = useState(0);
  const [data, setData] = useState();
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [addFeedback] = useAddFeedbackMutation();

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    if (selectedDate === "custom") {
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.setItem("startDate", startDate);
      sessionStorage.setItem("endDate", endDate);
    } else {
      sessionStorage.setItem("selectedDate", selectedDate);
      sessionStorage.removeItem("startDate");
      sessionStorage.removeItem("endDate");
    }
  };

  useEffect(() => {
    const storedDate = sessionStorage.getItem("selectedDate");
    const storedStartDate = sessionStorage.getItem("startDate");
    const storedEndDate = sessionStorage.getItem("endDate");

    if (storedDate) {
      setDate(storedDate);
    }
    if (storedStartDate && storedEndDate) {
      setDateRange([new Date(storedStartDate), new Date(storedEndDate)]);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [postDataStudent, { isLoading, data: studentsData }] =
    usePhoneNumberAddedFreeTrialNotClickedMutation();
  const [
    postFreeTrialCliked,
    { isLoading: freeTrialClikedLoading, data: freeTrialClikedData },
  ] = useFreeTrialClickedButNotStartedMutation();
  const [
    postSubCancelled,
    { isLoading: subCancelledLoading, data: subCancelledData },
  ] = useSubscriptionCancelledMutation();

  const handleSubmit = async (formData) => {
    try {
      await addFeedback(formData); // Trigger the API mutation

      const formDataForFetch = new FormData();
      if (date !== "custom") {
        formDataForFetch.append("FilterType", date);
      } else if (date === "custom" && startDate && endDate) {
        formDataForFetch.append("FilterType", date);
        formDataForFetch.append(
          "FromDate",
          formatDateToReadableString(startDate),
        );
        formDataForFetch.append("ToDate", formatDateToReadableString(endDate));
      }

      formDataForFetch.append("PageSize", paginationModel.pageSize);
      formDataForFetch.append("PageNumber", paginationModel.page + 1);

      if (value === 0) {
        postDataStudent(formDataForFetch);
      } else if (value === 1) {
        postFreeTrialCliked(formDataForFetch);
      } else if (value === 2) {
        postSubCancelled(formDataForFetch);
      }

      setOpenModal(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  useEffect(() => {
    const formData = new FormData();
    if (date !== "custom") {
      formData.append("FilterType", date);
    } else if (date === "custom" && startDate && endDate) {
      formData.append("FilterType", date);
      formData.append("FromDate", formatDateToReadableString(startDate));
      formData.append("ToDate", formatDateToReadableString(endDate));
    }

    formData.append("PageSize", paginationModel.pageSize);
    formData.append("PageNumber", paginationModel.page + 1);

    if (value === 0) {
      postDataStudent(formData);
    } else if (value === 1) {
      postFreeTrialCliked(formData);
    } else if (value === 2) {
      postSubCancelled(formData);
    }
  }, [date, startDate, endDate, paginationModel, value]);

  useEffect(() => {
    if (studentsData && value === 0) {
      setData(studentsData?.data?.users);
      setRowCount(studentsData?.data?.totalUsers);
    } else if (freeTrialClikedData && value === 1) {
      setData(freeTrialClikedData?.data?.users);
      setRowCount(freeTrialClikedData?.data?.totalUsers);
    } else if (subCancelledData && value === 2) {
      setData(subCancelledData?.data?.users);
      setRowCount(subCancelledData?.data?.totalUsers);
    }
  }, [studentsData, freeTrialClikedData, subCancelledData]);

  const columns = [
    { field: "name", headerName: "Parent's Name", width: 300 },
    { field: "childName", headerName: "Child name", width: 300 },
    { field: "phoneNumber", headerName: "Phone Number", width: 300 },
    // {
    //   field: "createdAt",
    //   headerName: "Date",
    //   width: 180,
    //   renderCell: (params) => useFormattedDate(params?.row?.createdAt),
    // },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}
        >
          {params.row.callCenterFeedback === null && (
            <Tooltip title="Add Feedback">
              <AddCircleIcon
                sx={{ color: "#5d87ff", cursor: "pointer" }}
                onClick={() => handleAddFeedback(params)}
              />
            </Tooltip>
          )}
          {params.row.callCenterFeedback !== null && (
            <>
              <Tooltip title="Edit Feedback">
                <EditIcon
                  sx={{ color: "#5d87ff", cursor: "pointer" }}
                  onClick={() => handleEditFeedback(params)}
                />
              </Tooltip>
              <Tooltip title="View Feedback">
                <RemoveRedEyeIcon
                  sx={{ color: "#5d87ff", cursor: "pointer" }}
                  onClick={() => handleViewFeedback(params)}
                />
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  const handleAddFeedback = (params) => {
    setSelectedUser(params.row);
    setOpenModal(true);
  };

  const handleEditFeedback = (params) => {
    setSelectedUser(params.row);
    setOpenEditModal(true);
  };

  const handleViewFeedback = (params) => {
    setSelectedUser(params.row);
    setOpenViewModal(true); // Open the view modal on view icon click
  };

  const convertToCSV = (
    array,
    keys = ["name", "phoneNumber", "childName", "callCenterFeedback"],
  ) => {
    const header = keys.join(",");
    const rows = array.map((row) =>
      keys
        .map((key) => `"${String(row?.[key] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );
    return [header, ...rows].join("\n");
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleBatchedExport = async () => {
    setIsExporting(true);
    const allData = [];
    const batchSize = 100;
    let page = 1;
    let keepFetching = true;

    while (keepFetching) {
      const formData = new FormData();

      formData.append("FilterType", date);

      if (date === "custom" && startDate && endDate) {
        formData.append("FromDate", formatDateToReadableString(startDate));
        formData.append("ToDate", formatDateToReadableString(endDate));
      }

      formData.append("PageSize", batchSize);
      formData.append("PageNumber", page);
      //   formData.append("statusType", value);

      try {
        let res;
        if (value === 0) {
          res = await postDataStudent(formData).unwrap();
        } else if (value === 1) {
          res = await postFreeTrialCliked(formData).unwrap();
        } else if (value === 2) {
          res = await postSubCancelled(formData).unwrap();
        }
        console.log(res?.data);

        const currentBatch = res?.data?.users || [];

        allData.push(...currentBatch);

        if (currentBatch.length < batchSize) {
          keepFetching = false;
        } else {
          page += 1;
          await new Promise((r) => setTimeout(r, 200)); // avoid API spam
        }
      } catch (err) {
        console.error("Error fetching batch:", err);
        break;
      }
    }

    if (allData.length) {
      const csv = convertToCSV(allData);

      // 🔥 BOM prefix ensures correct UTF-8 rendering in Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

      saveAs(blob, "data.csv");
    } else {
      alert("No data available to export.");
    }
    setIsExporting(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CustomBreadcrumbs
          items={[
            {
              label: "User Buckets",
              href: "/user-buckets",
              icon: <ListAltIcon fontSize="small" />,
            },
          ]}
        />
        <Box
          sx={{
            marginBottom: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <CustomRangeSelect
            value={date}
            label={"Date"}
            onChange={handleDateChange}
            options={dateFilterOptions}
          />
          {date === "custom" && (
            <DatePicker
              maxDate={new Date()}
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
                const [start, end] = update;
                sessionStorage.setItem("startDate", start);
                sessionStorage.setItem("endDate", end);
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date range"
              customInput={
                <TextField
                  size="small"
                  fullWidth
                  label="Custom Date Range"
                  sx={{ width: 250 }}
                />
              }
            />
          )}
          {data?.length > 1 && (
            <Button
              variant="contained"
              onClick={handleBatchedExport}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export All Data"}
            </Button>
          )}
        </Box>
      </Box>
      <Paper sx={{ height: "auto", width: "100%", padding: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{ fontSize: 12 }}
                label="phone number added but free trial not clicked users"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ fontSize: 12 }}
                label="free trial clicked but free trial not started users"
                {...a11yProps(1)}
              />
              <Tab
                sx={{ fontSize: 12 }}
                label="subscription cancelled users"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          {isLoading || freeTrialClikedLoading ? (
            <TableSkeleton rows={10} columns={6} />
          ) : (
            <TableWithExport
              userTableData={data?.map((d) => ({ ...d, id: d?.email }))}
              columns={columns}
              pageSizeOptions={[10, 20]}
              rowCount={rowCount}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          )}
        </Box>
      </Paper>

      {/* Feedback Modal */}
      <AddFeedbackModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit} // Pass the submit handler to modal
        initialData={selectedUser}
        activeTab={value}
      />

      <EditFeedbackModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSubmit={handleSubmit} // Pass the submit handler to modal
        initialData={selectedUser}
        activeTab={value}
      />

      <ViewFeedbackModal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)} // Close the view modal
        feedback={selectedUser?.callCenterFeedback} // Pass feedback to the modal
      />
    </>
  );
};

export default UserBuckets;

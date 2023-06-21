import React, { useMemo, useState, useContext, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import FeedIcon from "@mui/icons-material/Feed";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserContext } from "../../UserContext";
import { toast } from "react-toastify";
import { useFetch } from "../../api/report";
const Report_table = (props) => {
  const [rowSelection, setRowSelection] = useState({});
  //   const [selectedRow, setSelectedrow] = useState("");
  const [data, setData] = useState({});
  const { sendRequest } = useFetch();
  const { user } = useContext(UserContext);
  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
      },

      {
        accessorKey: "reportname",
        header: "Menu name",
      },
      {
        accessorKey: "categoryname",
        header: "Category name",
      },
      {
        accessorKey: "DateCreated",
        header: "Date Created",
      },
      {
        accessorKey: "Createdby",
        header: "Created by",
      },
      {
        accessorKey: "DateModified",
        header: "Date Modified",
      },
      {
        accessorKey: "Modifiedby",
        header: "Modified by",
      },
      {
        accessorKey: "Status",
        header: "Status",
      },
    ],
    []
  );

  const getHandler = async (data, dat2) => {
    try {
      setData("");
      const result = await toast.promise(
        sendRequest(
          `/g/record/${user.barangay}/${user.district}/${user.city}/${user.province}/${user.region}/`,
          "GET"
        ),
        {
          pending: "Please wait data is loading",
          success: "Data loaded",
          error: `Error`,
        }
      );
      if (result && result.error) return toast.error({ error: result.error });
      setData(result);
      // setLocation(data);
      // if (!dat2) {
      //   setStatebutton(true);
      //   setRowSelection("");
      // }
    } catch (e) {
      console.log(e);
      toast.error({ error: e.message });
    }
  };

  let shouldlog = useRef(true);
  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableMultiRowSelection={false} //use radio buttons instead of checkboxes
        enableRowSelection
        getRowId={(row) => row._id} //give each row a more useful id
        //add onClick to row to select upon clicking anywhere in the row
        muiTableBodyRowProps={({ row }) => ({
          //implement row selection click events manually
          //getting the data id
          onClick: () => {
            setRowSelection(() => ({
              [row.id]: [row.id],
            })),
              props.rsetup([row.original]);
          },

          sx: {
            cursor: "pointer",
          },
        })}
        positionToolbarAlertBanner="none"
        muiTableContainerProps={{ sx: { maxHeight: "650px" } }}
        onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
        state={{ rowSelection, showProgressBars: data ? false : true }} //pass our managed row selection state to the table to use
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
          density: "spacious",
          columnVisibility: {
            gender: false,
            Createdby: false,
            DateCreated: false,
            Status: false,
            _id: false,
          },
        }}
        renderToolbarInternalActions={({ table }) => (
          <Box>
            {/* add custom button to print table  */}

            {/* along-side built-in buttons in whatever order you want them */}
            <MRT_ToggleGlobalFilterButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
            <Tooltip arrow placement="bottom" title="Refresh">
              <IconButton
                onClick={() => {
                  getHandler();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </div>
  );
};

export default Report_table;

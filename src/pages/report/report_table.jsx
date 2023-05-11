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

import { toast } from "react-toastify";

import { useFetch } from "../../api/report";
import { UserContext } from "../../UserContext";

// popup delete
import Notiflix from "notiflix";

const Report_table = (props) => {
  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState("");

  const [statebutton, setStatebutton] = useState(true);

  const { user } = useContext(UserContext);
  // hooks
  const { sendRequest } = useFetch();

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
      },
      {
        accessorKey: "reportname",
        header: "Report name",
      },
      {
        accessorKey: "menuname",
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

  const [data, setData] = useState({});

  const [reportdata, setReportdata] = useState({
    _id: "",
    menuname: "",
  });

  let shouldlog = useRef(true);

  const getHandler = async () => {
    setData("");
    try {
      //alert loading
      const result = await toast.promise(sendRequest("/g/record", "GET"), {
        pending: "Please wait data is loading",
        success: "Data loaded",
        error: `Error`,
      });
      if (result && result.error) return toast.error({ error: result.error });
      setData(result);
    } catch (e) {
      console.log(e);
      setLoggeedMessage({ error: e.message });
    }
  };

  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  props.receivereload(getHandler);
  props.receiveonreloadsetup(getHandler);

  useEffect(() => {
    let datapass;
    for (name in rowSelection) {
      datapass = name;
    }
    getdata(datapass);
  }, [rowSelection, data]);

  const getdata = async (newdata) => {
    if (newdata) {
      const result = await sendRequest(`/g/r/record/${newdata}`, "GET");
      setStatebutton(false);
      props.reportid(result[0]);
      setReportdata({
        ...reportdata,
        _id: result[0]._id,
        menuname: result[0].menuname,
      });
    }
  };

  const handle_refresh = () => {
    setRowSelection("");
    getHandler("");
    setStatebutton(true);
  };

  const handle_delete = () => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this case no ${reportdata.menuname}?`,
      "Yes",
      "No",
      async function okCb() {
        const details = {
          _id: reportdata._id,
          Modifiedby: user,
        };
        const result = await sendRequest("/d/record", "POST", details);
        if (result.error) return toast.error(result.error);
        toast.success(result.success);
        handle_refresh();
      },
      function cancelCb() {
        return;
      },
      {
        width: "320px",
        borderRadius: "8px",
        // etc...
      }
    );
  };

  return (
    <div>
      <div className="container-fluid border shadow p-3 mb-5 bg-body d-flex justify-content-center ">
        <div className="row  d-flex flex-row ">
          <div className="col-sm-3 col-lg-3 ">
            <Button
              style={{ height: "100%", width: "100%" }}
              variant="contained"
              startIcon={
                <AddCircleIcon style={{ height: "50px", width: "50px" }} />
              }
              size="large"
              color="success"
              onClick={() => {
                props.onadd("add");
              }}
            >
              Create <br /> report
            </Button>
          </div>
          <div className="col-sm-3 col-lg-3 ">
            <Button
              style={{ height: "100%", width: "100%" }}
              variant="contained"
              startIcon={
                <ModeEditIcon style={{ height: "50px", width: "50px" }} />
              }
              size="large"
              color="info"
              disabled={statebutton ? true : false}
              onClick={() => {
                props.onadd("edit");
              }}
            >
              Edit <br /> report
            </Button>
          </div>
          <div className="col-sm-3 col-lg-3 ">
            <Button
              variant="contained"
              endIcon={<DeleteIcon style={{ height: "50px", width: "50px" }} />}
              style={{ height: "100%", width: "100%" }}
              size="large"
              color="error"
              disabled={statebutton ? true : false}
              onClick={() => {
                handle_delete();
              }}
            >
              Delete <br /> report
            </Button>
          </div>
          <div className="col-sm-3 col-lg-3 ">
            <Button
              variant="contained"
              endIcon={<FeedIcon style={{ height: "50px", width: "50px" }} />}
              style={{ height: "100%", width: "100%" }}
              size="large"
              color="secondary"
              disabled={statebutton ? true : false}
              onClick={() => {
                props.onsetup();
              }}
            >
              Setup <br /> report
            </Button>
          </div>
        </div>
      </div>

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
            }));
          },

          sx: {
            cursor: "pointer",
          },
        })}
        positionToolbarAlertBanner="none"
        onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
        state={{ rowSelection, showSkeletons: data ? false : true }} //pass our managed row selection state to the table to use
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
                  handle_refresh();
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

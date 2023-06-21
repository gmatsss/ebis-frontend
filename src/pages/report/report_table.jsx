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
  const [rptstp, setRptstp] = useState();
  const [location, setLocation] = useState("");
  const [reportdata, setReportdata] = useState({
    _id: "",
    menuname: "",
  });

  const getHandler = async (data, dat2) => {
    try {
      // if (!data) return handle_reset();
      handle_reset();
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
      setLoggeedMessage({ error: e.message });
    }
  };

  props.rebrgyvar(getHandler);
  props.receivereload(getHandler);
  props.receiveonreloadsetup(getHandler);

  useEffect(() => {
    getHandler();
  }, []);

  useEffect(() => {
    let datapass;
    for (name in rowSelection) {
      datapass = name;
    }
    getdata(datapass);
    setRptstp(datapass);
  }, [rowSelection, data]);

  const getdata = async (newdata) => {
    if (newdata) {
      const result = await sendRequest(`/g/r/record/${newdata}`, "GET");
      setStatebutton(false);
      props.reportid(result[0]);
      //delete
      setReportdata({
        ...reportdata,
        _id: result[0]._id,
        menuname: result[0].menuname,
      });
    }
  };

  const handle_reset = () => {
    setRowSelection("");
    setData("");
    setStatebutton(true);
  };

  const handle_delete = () => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this Report ${reportdata.menuname}?`,
      "Yes",
      "No",
      async function okCb() {
        const details = {
          _id: reportdata._id,
          Modifiedby: user.email,
        };
        const result = await sendRequest("/d/record", "POST", details);
        if (result.error) return toast.error(result.error);
        toast.success(result.success);
        getHandler(location);
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

  window.shownoModalDialog = function (arg1, arg2, arg3) {
    var i;
    var w;
    var h;
    var resizable = "no";
    var scroll = "no";
    var status = "no";
    var mdattrs = arg3.split(";");
    for (i = 0; i < mdattrs.length; i++) {
      var mdattr = mdattrs[i].split(":");
      var n = mdattr[0],
        v = mdattr[1];
      if (n) {
        n = n.trim().toLowerCase();
      }
      if (v) {
        v = v.trim().toLowerCase();
      }
      if (n == "dialogheight") {
        h = v.replace("px", "");
      } else if (n == "dialogwidth") {
        w = v.replace("px", "");
      } else if (n == "resizable") {
        resizable = v;
      } else if (n == "scroll") {
        scroll = v;
      } else if (n == "status") {
        status = v;
      }
    }
    var left = window.screenX + window.outerWidth / 2 - w / 2;
    var top = window.screenY + window.outerHeight / 2 - h / 2;
    if (top > 30) {
      top = top - 30;
    }
    var targetWin = window.open(
      arg1,
      arg2,
      "toolbar=no, location=no, directories=no, status=" +
        status +
        ", menubar=no, scrollbars=" +
        scroll +
        ", resizable=" +
        resizable +
        ", copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );

    return targetWin;
  };

  return (
    <div>
      <div className="container-fluid  p-3 mb-3 bg-body d-flex ">
        <div className="row d-flex flex-row ">
          <div className="col-sm-3 col-lg-3 ">
            <Button
              style={{ width: "100%" }}
              variant="contained"
              startIcon={
                <AddCircleIcon style={{ height: "30px", width: "30px" }} />
              }
              size="small"
              color="success"
              onClick={() => {
                props.onadd("add");
              }}
            >
              Create
            </Button>
          </div>
          <div className="col-sm-3 col-lg-3 ">
            <Button
              style={{ width: "100%" }}
              variant="contained"
              startIcon={
                <ModeEditIcon style={{ height: "30px", width: "30px" }} />
              }
              size="small"
              color="info"
              disabled={statebutton ? true : false}
              onClick={() => {
                props.onadd("edit");
              }}
            >
              Edit
            </Button>
          </div>
          <div className="col-sm-3 col-lg-3 ">
            <Button
              style={{ width: "100%" }}
              variant="contained"
              startIcon={
                <DeleteIcon style={{ height: "30px", width: "30px" }} />
              }
              size="small"
              color="error"
              disabled={statebutton ? true : false}
              onClick={() => {
                handle_delete();
              }}
            >
              Delete
            </Button>
          </div>
          <div className="col-sm-3 col-lg-3 ">
            <Button
              style={{ width: "100%" }}
              variant="contained"
              startIcon={<FeedIcon style={{ height: "30px", width: "30px" }} />}
              size="small"
              color="secondary"
              disabled={statebutton ? true : false}
              // onClick={() => {
              //   props.onsetup();
              // }}
              onClick={() =>
                window.shownoModalDialog(
                  `/report_setup#${rptstp}`,
                  "Print Window",
                  "dialogtop:50; dialogleft: 230; center:1; dialogwidth:1390; dialogheight:770; scroll:0; resizable:1"
                )
              }
            >
              Setup
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
        muiTableContainerProps={{ sx: { maxHeight: "350px" } }}
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

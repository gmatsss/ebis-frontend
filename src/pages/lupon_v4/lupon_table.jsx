import React, { useContext, useState, useRef, useEffect } from "react";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
} from "material-react-table";
import Modal from "react-bootstrap/Modal";
import { Box, IconButton, Tooltip, Button, TextField } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import RefreshIcon from "@mui/icons-material/Refresh";
// popup delete
import Notiflix from "notiflix";
//toast
import { toast } from "react-toastify";
//api
import { useFetch } from "../../api/lupon_api";

import { UserContext } from "../../UserContext";
const Lup_table = (props) => {
  const { user } = useContext(UserContext);
  // hooks
  const { sendRequest } = useFetch();

  //data
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState();

  //modals
  const [show_modal, setShow_modal] = useState(false);
  const [modal_title, setModal_title] = useState(false);

  // mrt disable state
  const [state, setState] = useState(true);

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState("");
  //setting row id to form
  const [rowid, setRowid] = useState("");

  const [caseshow, setCaseshow] = useState("");

  //state save
  const [state_saved, setState_saved] = useState(false);

  //case variable
  const [case_var, setCase_var] = useState({
    _id: "",
    caseno: "",
    case_date: new Date().toISOString().split("T")[0],
    case_nature: "",
    description: "",
  });

  //get data to database
  const handle_refresh = () => {
    setData("");
    setRowSelection("");
    setRowid("");

    props.onPassdata("");
    getHandler();
  };

  const getHandler = async () => {
    setData("");
    setState(true);

    try {
      //alert loading
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

      setData(result);

      if (result && result.error) return toast.error({ error: result.error });
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  //reload databese
  let shouldlog = useRef(true);
  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  const tableHandler = () => {
    try {
      const column = [
        {
          header: "Case no",
          accessorKey: "caseno",
        },
        { header: "Case Date", accessorKey: "case_date" },
        { header: "Case Nature", accessorKey: "case_nature" },

        { header: "Description", accessorKey: "description" },

        {
          header: "DateCreated",
          accessorKey: "DateCreated",
          enableEditing: false,
        },

        {
          header: "Createdby",
          accessorKey: "Createdby",
          enableEditing: false,
        },
        {
          header: "DateModified",
          accessorKey: "DateModified",

          enableEditing: false,
        },
        {
          header: "Modifiedby",
          accessorKey: "Modifiedby",
          enableEditing: false,
        },
        { header: "Status", accessorKey: "Status", enableEditing: false },
        { header: "_id", accessorKey: "_id", enableEditing: false },
      ];

      //insert data to table
      let row = [];
      data.forEach((x) => {
        row.push({
          _id: x._id,
          caseno: x.caseno,
          case_date: x.case_date,
          case_nature: x.case_nature,
          description: x.description,
          DateCreated: x.DateCreated,
          Createdby: x.Createdby,
          DateModified: x.DateModified,
          Modifiedby: x.Modifiedby,
          Status: x.Status,
          id: x._id,
        });
      });

      setColumns(column);
      setRows(row);
    } catch (e) {
      return toast.error(e);
    }
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    tableHandler();
  }, [data]);

  const handle_add = () => {
    setShow_modal(true);
    setRowid("");
    setRowSelection("");
  };

  const handle_cancel = () => {
    setShow_modal(false);
    setState_saved(false);
    reset_inputs();
  };

  const handle_save = async () => {
    const formData = new FormData();
    formData.append("barangay", user.barangay);
    formData.append("district", user.district);
    formData.append("city", user.city);
    formData.append("province", user.province);
    formData.append("region", user.region);
    formData.append("_id", case_var._id);
    formData.append("caseno", case_var.caseno);
    formData.append("case_date", case_var.case_date);
    formData.append("case_nature", case_var.case_nature);
    formData.append("description", case_var.description);
    formData.append("Createdby", user.email);
    formData.append("Modifiedby", user.email);

    if (!case_var.caseno || !case_var.case_nature)
      return toast.warning("Please provide caseno and case nature");

    if (state_saved) {
      try {
        const result = await sendRequest("/u/record", "POST", formData);
        if (result && result.error) throw result.error;
        handle_cancel();
        getHandler();
        setState_saved(false);
      } catch (error) {
        return toast.error(error);
      }
    } else {
      try {
        const result = await sendRequest("/create/record", "POST", formData);
        if (result && result.error) throw result.error;
        handle_cancel();
        getHandler();
      } catch (error) {
        return toast.error(error);
      }
    }
  };

  const reset_inputs = () => {
    setCase_var({
      ...case_var,
      _id: "",
      caseno: "",
      case_date: new Date().toISOString().split("T")[0],
      case_nature: "",
      description: "",
    });
  };

  //edit
  const handle_edit = (data) => {
    setShow_modal(true);
    setState_saved(true);
    setCase_var({
      ...case_var,
      _id: data._id,
      caseno: data.caseno,
      case_date: data.case_date,
      case_nature: data.case_nature,
      description: data.description,
    });
  };

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this case no ${data.caseno}?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("_id", data._id);
        formData.append("Modifiedby", user.email);
        const result = await sendRequest("/d/record", "POST", formData);
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

  const [case_id, setCase_id] = useState("");

  useEffect(() => {
    let datapass;
    for (name in rowSelection) {
      datapass = name;
    }
    getdata(datapass);
    setCase_id(datapass);
  }, [rowSelection, data]);

  const getdata = async (newdata) => {
    if (newdata) {
      const result = await sendRequest(`/g/one/record/${newdata}`, "GET");
      setCaseshow(result[0].caseno);
      props.onPassdata(result);
    }
  };

  const [statecomp, setStatecomp] = useState(true);

  useEffect(() => {
    const params = props.disablefromdocs;

    if (params === true) {
      setStatecomp(false);
    } else if (params === false) {
      setStatecomp(true);
    }
  }, [props.disablefromdocs]);

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
    <div
      style={{
        opacity: statecomp ? "1" : "0.4",
        pointerEvents: statecomp ? "auto" : "none",
      }}
    >
      <div className="mb-2 d-flex flex-row">
        <Button
          variant="contained"
          className="m-1"
          title="Add"
          size="lg"
          onClick={handle_add}
        >
          {/* <AddIcon /> */}
          Create
        </Button>

        <div>
          <Button
            style={{ pointerEvents: rowSelection ? "auto" : "none" }}
            variant="contained"
            className="m-1"
            color="success"
            title="Save"
            size="lg"
            onClick={() =>
              window.shownoModalDialog(
                `/rpt_lupon#${case_id}`,
                "Print Window",
                "dialogtop:50; dialogleft: 230; center:1; dialogwidth:1390; dialogheight:770; scroll:0; resizable:1"
              )
            }
          >
            <span className="d-flex justify-content-around">Open report</span>
          </Button>
        </div>
      </div>

      <MaterialReactTable
        columns={columns}
        data={rows}
        getRowId={(row) => row._id}
        enableMultiRowSelection={false} //use radio buttons instead of checkboxes
        enableRowSelection
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
        onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
        state={{ rowSelection, showSkeletons: data ? false : true }} //pass our managed row selection state to the table to use
        positionToolbarAlertBanner="none"
        muiTablePaperProps={{
          //table style
          sx: {
            pointerEvents: state ? (statecomp ? "auto" : "none") : "none",
            opacity: state ? (statecomp ? "1" : "0.5") : "0.5",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            pointerEvents: state ? (statecomp ? "auto" : "none") : "none",
            opacity: state ? (statecomp ? "1" : "0.5") : "0.5",
          },
        }}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box>
            <IconButton onClick={() => handle_edit(row.original)}>
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(row.original)}
            >
              <Delete />
            </IconButton>
          </Box>
        )}
        enableStickyHeader
        muiTableContainerProps={{ sx: { maxHeight: "250px" } }}
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
          density: "compact",
          columnVisibility: {
            Createdby: false,
            DateCreated: false,
            Status: false,
            _id: false,
          },
        }}
        renderBottomToolbarCustomActions={(table) =>
          rowSelection ? (
            <div>
              <h5>
                Case No: <span className="h5">{caseshow}</span>
              </h5>
            </div>
          ) : (
            <div></div>
          )
        }
        renderToolbarInternalActions={({ table }) => (
          <Box>
            {/* add custom button to print table  */}

            {/* along-side built-in buttons in whatever order you want them */}
            <MRT_ToggleGlobalFilterButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
            <Tooltip arrow placement="right" title="Refresh">
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

      <Modal
        show={show_modal}
        onHide={handle_cancel}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Lupon Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row d-flex justify-content-center">
              <div
                className="col-lg-10 d-flex flex-column justify-content-evenly"
                style={{ height: "380px" }}
              >
                <TextField
                  variant="outlined"
                  label="Case no"
                  value={case_var.caseno}
                  onChange={(e) =>
                    setCase_var({
                      ...case_var,
                      caseno: e.target.value,
                    })
                  }
                  error={!case_var.caseno ? true : false}
                />
                <TextField
                  variant="outlined"
                  label="Case Date"
                  type="date"
                  value={case_var.case_date}
                  onChange={(e) =>
                    setCase_var({
                      ...case_var,
                      case_date: e.target.value,
                    })
                  }
                  inputProps={{ min: "2019-01-24", max: "2100-05-31" }}
                />
                <TextField
                  variant="outlined"
                  label="Case Nature"
                  value={case_var.case_nature}
                  onChange={(e) =>
                    setCase_var({
                      ...case_var,
                      case_nature: e.target.value,
                    })
                  }
                  error={!case_var.case_nature ? true : false}
                />
                <TextField
                  variant="outlined"
                  label="Description"
                  multiline
                  rows={5}
                  value={case_var.description}
                  onChange={(e) =>
                    setCase_var({
                      ...case_var,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="error"
            onClick={handle_cancel}
            className="me-3"
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handle_save}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Lup_table;

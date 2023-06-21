import React, { useContext, useState, useRef, useEffect, useMemo } from "react";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
} from "material-react-table";
import Modal from "react-bootstrap/Modal";
import {
  Box,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Delete, Edit } from "@mui/icons-material";

import RefreshIcon from "@mui/icons-material/Refresh";
// popup delete
import Notiflix from "notiflix";
//toast
import { toast } from "react-toastify";
//api
import { useFetch } from "../../api/lupon_api";

import { UserContext } from "../../UserContext";

const Lupon_hearing = (props) => {
  const columns = useMemo(
    () => [
      {
        header: "Case Id",
        accessorKey: "caseid",
      },
      {
        header: "Case Date",
        accessorKey: "casedate",
      },
      { header: "Title", accessorKey: "title" },

      { header: "Hearing Status", accessorKey: "hearingstatus" },
      { header: "Hearing Remarks", accessorKey: "hearingremarks" },
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
    ],
    []
  );
  const { user } = useContext(UserContext);
  // hooks
  const { sendRequest } = useFetch();

  //data
  const [data, setData] = useState("");
  const [caseid, setCaseid] = useState();

  //modals
  const [show_modal, setShow_modal] = useState(false);

  //state save
  const [state_saved, setState_saved] = useState(false);

  //datepicker
  const [casedate, setCasedate] = useState(
    new Date().toISOString().split("T")[0]
  );

  //params for hearing
  const [casecount, setCasecount] = useState("");

  const [hearing, setHearing] = useState({
    _id: "",
    caseid: "",
    title: "",
    hearingstatus: "",
    hearingremarks: "",
  });

  const getHandler = async (data) => {
    setData("");
    setCaseid("");
    if (!data) return;
    try {
      const result = await sendRequest(`/g/h/record/${data}`, "GET");
      if (result && result.error) throw result.error;
      setData(result.hearing);
      setCaseid(data);
      setCasecount(result.count);
    } catch (e) {
      toast.error(e);
    }
  };

  props.receiveid(getHandler);
  const handle_add = () => {
    setShow_modal(true);
  };

  const handle_cancel = () => {
    setShow_modal(false);
    setState_saved(false);
    reset_inputs();
  };

  const reset_inputs = () => {
    setHearing({
      ...hearing,
      _id: "",
      caseid: "",
      title: "",
      hearingstatus: "",
      hearingremarks: "",
    });
    setCasedate(new Date().toISOString().split("T")[0]);
  };

  const handle_edit = (data) => {
    setShow_modal(true);
    setState_saved(true);
    setHearing({
      ...hearing,
      _id: data._id,
      caseid: data.caseid,
      title: data.title,
      hearingstatus: data.hearingstatus,
      hearingremarks: data.hearingremarks,
    });
    setCasedate(data.casedate);
  };

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this Hearing?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("_id", data._id);
        formData.append("Modifiedby", user.email);
        const result = await sendRequest("/d/h/record", "POST", formData);
        if (result.error) return toast.error(result.error);
        toast.success(result.success);
        getHandler(data.caseid);
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

  const handle_save = async () => {
    //  props.onStateform("SAVED");
    // console.log(casedate);
    // const date = casedate.$M + casedate.$D + casedate.$y;
    const formData = new FormData();
    formData.append("_id", hearing._id);
    formData.append("caseid", caseid);
    formData.append("casedate", casedate);
    formData.append("title", hearing.title);
    formData.append("hearingstatus", hearing.hearingstatus);
    formData.append("hearingremarks", hearing.hearingremarks);
    formData.append("Createdby", user.email);
    formData.append("Modifiedby", user.email);

    if (!casedate || !hearing.hearingstatus || !hearing.title)
      return toast.warning("Please provide hearing date, title and status");
    if (state_saved) {
      try {
        const result = await sendRequest("/u/h/record", "POST", formData);
        if (result && result.error) throw result.error;
        handle_cancel();
        getHandler(caseid);
        setState_saved(false);
      } catch (error) {
        return toast.error(error);
      }
    } else {
      try {
        const result = await sendRequest("/create/h/record", "POST", formData);
        if (result && result.error) throw result.error;
        handle_cancel();
        getHandler(caseid);
      } catch (error) {
        return toast.error(error);
      }
    }
  };

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={data}
        renderTopToolbarCustomActions={({ table, row }) => (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              color="success"
              disabled={caseid ? (casecount === 3 ? true : false) : true}
              onClick={() => {
                handle_add();
              }}
              variant="contained"
            >
              Add
            </Button>
          </Box>
        )}
        state={{ showProgressBars: data ? false : true }} //pass our managed row selection state to the table to use
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
        muiTableContainerProps={{ sx: { maxHeight: "165px" } }}
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
          density: "compact",
          columnVisibility: {
            Createdby: false,
            DateCreated: false,
            Status: false,
            _id: false,
            caseid: false,
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
            <Tooltip arrow placement="right" title="Refresh">
              <IconButton
                onClick={() => {
                  getHandler(caseid);
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
        onHide={() => {
          handle_cancel();
        }}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Hearing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row d-flex justify-content-center">
              <div
                className="col-lg-10 d-flex flex-column justify-content-evenly"
                style={{ height: "385px" }}
              >
                <TextField
                  variant="outlined"
                  label="Hearing Date"
                  type="date"
                  value={casedate}
                  onChange={(e) => setCasedate(e.target.value)}
                  inputProps={{ min: "2019-01-24", max: "2100-05-31" }}
                />

                {/* <TextField
                  variant="outlined"
                  label="Hearing Title"
                  value={hearing.title}
                  onChange={(e) =>
                    setHearing({
                      ...hearing,
                      title: e.target.value,
                    })
                  }
                  error={!hearing.title ? true : false}
                /> */}

                <FormControl variant="outlined">
                  <InputLabel id="demo-simple-select-label">
                    Hearing Title
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Hearing Status"
                    value={hearing.title}
                    onChange={(e) =>
                      setHearing({
                        ...hearing,
                        title: e.target.value,
                      })
                    }
                    error={!hearing.hearingstatus ? true : false}
                  >
                    <MenuItem
                      value={
                        !hearing.hearingstatus
                          ? "1st Hearing"
                          : hearing.hearingstatus !== "1st Hearing"
                          ? "1st Hearing"
                          : hearing.hearingstatus
                      }
                    >
                      1st Hearing
                    </MenuItem>
                    <MenuItem value={"2nd Hearing"}>2nd Hearing</MenuItem>
                    <MenuItem value={"3rd Hearing"}>3rd Hearing</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="outlined">
                  <InputLabel id="demo-simple-select-label">
                    Hearing Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Hearing Status"
                    value={hearing.hearingstatus}
                    onChange={(e) =>
                      setHearing({
                        ...hearing,
                        hearingstatus: e.target.value,
                      })
                    }
                    error={!hearing.hearingstatus ? true : false}
                  >
                    <MenuItem
                      value={
                        !hearing.hearingstatus
                          ? "Settled"
                          : hearing.hearingstatus !== "Settled"
                          ? "Settled"
                          : hearing.hearingstatus
                      }
                    >
                      Settled
                    </MenuItem>

                    {state_saved === true && casecount === 2 ? (
                      <MenuItem value={"For Remediation"}>
                        For Remediation
                      </MenuItem>
                    ) : casecount === 2 || casecount === 3 ? (
                      <MenuItem value={"No amicable settlement"}>
                        No amicable settlement
                      </MenuItem>
                    ) : (
                      <MenuItem value={"For Remediation"}>
                        For Remediation
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <TextField
                  label="Remark"
                  multiline
                  rows={5}
                  value={hearing.hearingremarks}
                  onChange={(e) =>
                    setHearing({
                      ...hearing,
                      hearingremarks: e.target.value,
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
            onClick={() => {
              handle_cancel();
            }}
            className="me-3"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handle_save();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Lupon_hearing;

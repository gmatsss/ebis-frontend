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
import { Delete, Edit } from "@mui/icons-material";

import RefreshIcon from "@mui/icons-material/Refresh";
// popup delete
import Notiflix from "notiflix";
//toast
import { toast } from "react-toastify";
//api
import { useFetch } from "../../../api/lupon_api";

import { UserContext } from "../../../UserContext";

const Lupon_complainant = (props) => {
  const { user } = useContext(UserContext);
  // hooks
  const { sendRequest } = useFetch();

  //data
  const [data, setData] = useState("");
  const [caseid, setCaseid] = useState();
  const [complainant, setcomplainant] = useState({
    _id: "",
    nameofcomp: "",
    genderofcomp: "",
    addressofcomp: "",
    phoneofcomp: "",
  });

  //modals
  const [show_modal, setShow_modal] = useState(false);
  const [modal_title, setModal_title] = useState(false);

  //state save
  const [state_saved, setState_saved] = useState(false);

  useEffect(() => {
    if (!props.receiveid) {
      setCaseid("");
      setData("");
      return;
    }
    getHandler(props.receiveid);
    setCaseid(props.receiveid);
  }, [props.receiveid]);

  const getHandler = async (data) => {
    setData("");
    try {
      const result = await sendRequest(`/g/c/record/${data}`, "GET");
      if (result && result.error) throw result.error;
      setData(result);
    } catch (e) {
      toast.error(e);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Case Id",
        accessorKey: "caseid",
      },
      {
        header: "Name of complainant",
        accessorKey: "nameofcomp",
      },
      { header: "Gender", accessorKey: "genderofcomp" },

      { header: "Phone", accessorKey: "phoneofcomp" },
      { header: "Address", accessorKey: "addressofcomp" },
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

  const handle_add = () => {
    setShow_modal(true);
  };

  const handle_edit = (data) => {
    setShow_modal(true);
    setState_saved(true);
    setcomplainant({
      ...complainant,
      _id: data._id,
      nameofcomp: data.nameofcomp,
      genderofcomp: data.genderofcomp,
      addressofcomp: data.addressofcomp,
      phoneofcomp: data.phoneofcomp,
    });
  };

  const handle_cancel = () => {
    setShow_modal(false);
    setState_saved(false);
    reset_inputs();
  };

  const reset_inputs = () => {
    setcomplainant({
      ...complainant,
      _id: "",
      nameofcomp: "",
      genderofcomp: "",
      addressofcomp: "",
      phoneofcomp: "",
    });
  };

  const handle_save = async () => {
    //  props.onStateform("SAVED");
    const formData = new FormData();
    formData.append("_id", complainant._id);
    formData.append("caseid", caseid);
    formData.append("nameofcomp", complainant.nameofcomp);
    formData.append("genderofcomp", complainant.genderofcomp);
    formData.append("addressofcomp", complainant.addressofcomp);
    formData.append("phoneofcomp", complainant.phoneofcomp);
    formData.append("Createdby", user.email);
    formData.append("Modifiedby", user.email);

    if (
      !complainant.nameofcomp ||
      !complainant.phoneofcomp ||
      !complainant.addressofcomp
    )
      return toast.warning(
        "Please provide name of complainant, phone number and address"
      );
    if (state_saved) {
      try {
        const result = await sendRequest("/u/c/record", "POST", formData);
        if (result && result.error) throw result.error;
        handle_cancel();
        getHandler(caseid);
        setState_saved(false);
      } catch (error) {
        return toast.error(error);
      }
    } else {
      try {
        const result = await sendRequest("/create/c/record", "POST", formData);
        if (result && result.error) throw result.error;
        handle_cancel();
        getHandler(caseid);
      } catch (error) {
        return toast.error(error);
      }
    }
  };

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this case no ${data.nameofcomp}?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("_id", data._id);
        formData.append("Modifiedby", user.email);
        const result = await sendRequest("/d/c/record", "POST", formData);
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

  return (
    <div>
      <h1>Complainant</h1>
      <MaterialReactTable
        columns={columns}
        data={data}
        renderTopToolbarCustomActions={({ table, row }) => (
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              color="success"
              disabled={caseid ? false : true}
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
        muiTableContainerProps={{ sx: { maxHeight: "250px" } }}
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
          handle_cancel;
        }}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Complainant</Modal.Title>
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
                  label="Name"
                  value={complainant.nameofcomp}
                  onChange={(e) =>
                    setcomplainant({
                      ...complainant,
                      nameofcomp: e.target.value,
                    })
                  }
                  error={!complainant.nameofcomp ? true : false}
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={complainant.genderofcomp}
                    label="Gender"
                    onChange={(e) =>
                      setcomplainant({
                        ...complainant,
                        genderofcomp: e.target.value,
                      })
                    }
                  >
                    <MenuItem
                      value={
                        !complainant.genderofcomp
                          ? "Female"
                          : complainant.genderofcomp !== "Female"
                          ? "Female"
                          : complainant.genderofcomp
                      }
                    >
                      Female
                    </MenuItem>
                    <MenuItem value={"Male"}>Male</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  type="number"
                  variant="outlined"
                  label="Phone No"
                  value={complainant.phoneofcomp}
                  onChange={(e) =>
                    setcomplainant({
                      ...complainant,
                      phoneofcomp: e.target.value,
                    })
                  }
                  error={!complainant.phoneofcomp ? true : false}
                />

                <TextField
                  variant="outlined"
                  label="Address"
                  multiline
                  rows={5}
                  value={complainant.addressofcomp}
                  onChange={(e) =>
                    setcomplainant({
                      ...complainant,
                      addressofcomp: e.target.value,
                    })
                  }
                  error={!complainant.addressofcomp ? true : false}
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

export default Lupon_complainant;

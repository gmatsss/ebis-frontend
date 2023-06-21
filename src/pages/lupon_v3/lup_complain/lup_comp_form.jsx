import React, { useState, useContext } from "react";
import {
  TextField,
  InputLabel,
  FormControl,
  Button,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button_lex from "../../../share/FormElements/Button";

import { UserContext } from "../../../UserContext";

//hooks
import { useFetch } from "../../../api/lupon";

const lup_comp_form = (props) => {
  const { user } = useContext(UserContext);
  //api
  const { sendRequest } = useFetch();

  let thisdate = new Date().toISOString().split("T")[0];

  //editshow
  const [showedit, setShowedit] = useState(false);

  //save state
  const [statesave, setStatesave] = useState(true);

  //form disabled
  const [commandAction, setCommandAction] = useState(false);

  const [param, setParam] = useState(0);

  //data in holder
  const [datain, setDatain] = useState("-");
  //form ustate code
  const [complaint, setComplaint] = useState({
    _id: "",
    compdate: thisdate,
    compnature: "",
    compstatus: "Filed",
    description: "",
  });

  //modals
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const reset_input = () => {
    setComplaint({
      compdate: thisdate,
      compnature: "",
      description: "",
      compstatus: "Filed",
    });
  };

  const handle_add = () => {
    if (!props.paramscasedata)
      return toast.warning("Please select case data in the table");

    // setChange(true);
    setShowedit(false);
    setCommandAction(true);
    setStatesave(false);
    setShow(true);
    // props.onReload("add");
    // props.ondisable(true);
  };

  const handle_cancel = () => {
    setCommandAction(false);
    reset_input();
    setShow(false);
    props.onReload("cancel");
    props.ondisable(false);
  };

  //validation
  const validate = () => {
    if (!complaint.compdate) return "Complain date field is required";
    if (!complaint.compnature) return "Complain nature field is required";
    if (!complaint.compstatus) return "Complain status field is required";
  };

  const handle_saved = async () => {
    const formData = new FormData();

    formData.append("compid", props.paramscasedata);
    formData.append("_id", complaint._id);
    formData.append("compdate", complaint.compdate);
    formData.append("compnature", complaint.compnature);
    formData.append("description", complaint.description);
    formData.append("compstatus", complaint.compstatus);
    formData.append("Createdby", user);
    formData.append("Modifiedby", user);

    if (statesave) {
      try {
        const val = validate();
        if (val) return toast.warning(val);

        const result = await sendRequest("/u/c/record", "POST", formData);

        //need throw err to access catch
        if (result.error) throw result.error;
        toast.success(result.success);
        reset_input();
        setCommandAction(false);
        props.onReload("saved");
        setShow(false);
        props.ondisable(false);
      } catch (err) {
        return toast.error(err);
      }
    } else {
      try {
        const val = validate();
        if (val) return toast.warning(val);

        const result = await sendRequest("/create/c/record", "POST", formData);

        //need throw err to access catch
        if (result.error) throw result.error;
        toast.success(result.success);
        reset_input();
        setCommandAction(false);
        props.onReload("saved");
        props.ondisable(false);
        setShow(false);
      } catch (err) {
        return toast.error(err);
      }
    }
  };

  const onEdit = (params) => {
    setShow(true);
    setComplaint({
      ...complaint,
      _id: params._id,
      compdate: params.compdate,
      compnature: params.compnature,
      description: params.description,
      compstatus: params.compstatus,
    });
    setStatesave(true);
    setCommandAction(true);
    setShowedit(true);
    props.onReload("edit");
  };

  const onCountReceived = (param) => {
    if (param === "add") {
      handle_add();
    } else if (param === "edit") {
      props.receivedataform(onEdit);
    }
  };

  props.receivemodal(onCountReceived);

  return (
    <Modal
      show={show}
      onHide={handle_cancel}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        {showedit ? (
          <Modal.Title>Edit Complain {complaint.compnature}</Modal.Title>
        ) : (
          <Modal.Title>Create Complain</Modal.Title>
        )}
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <div className="row d-flex flex-row justify-content-around ">
            <div className="col-lg-12 d-flex flex-column ">
              <TextField
                variant="standard"
                label="Complaint Date"
                type="date"
                className="m-3"
                value={!complaint.compdate ? thisdate : complaint.compdate}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    compdate: e.target.value,
                  })
                }
                inputProps={{ min: "2019-01-24", max: "2100-05-31" }}
                style={
                  commandAction
                    ? { pointerEvents: "auto", opacity: "1" }
                    : { pointerEvents: "none", opacity: "1" }
                }
              />

              <TextField
                id="standard-basic"
                label="Nature of complain"
                variant="standard"
                className="m-3"
                value={complaint.compnature}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    compnature: e.target.value,
                  })
                }
                style={
                  commandAction
                    ? { pointerEvents: "auto", opacity: "1" }
                    : { pointerEvents: "none", opacity: "1" }
                }
              />
              <FormControl
                variant="standard"
                className="m-3"
                style={
                  commandAction
                    ? { pointerEvents: "auto", opacity: "1" }
                    : { pointerEvents: "none", opacity: "1" }
                }
              >
                <InputLabel id="demo-simple-select-label">
                  Complain status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={!complaint.compstatus ? "Filed" : complaint.compstatus}
                  onChange={(e) =>
                    setComplaint({
                      ...complaint,
                      compstatus: e.target.value,
                    })
                  }
                >
                  <MenuItem
                    value={
                      !complaint.compstatus
                        ? "Filed"
                        : complaint.compstatus !== "Filed"
                        ? "Filed"
                        : complaint.compstatus
                    }
                  >
                    Filed
                  </MenuItem>

                  <MenuItem value={"For Remediation"}>For Remediation</MenuItem>
                  <MenuItem value={"Passed to lupon"}>Passed to lupon</MenuItem>
                  <MenuItem value={"Settled"}>Settled</MenuItem>
                  <MenuItem value={"No amicable settlement"}>
                    No amicable settlement
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                className="m-3"
                id="standard-multiline-static"
                label="Description"
                variant="standard"
                value={complaint.description}
                multiline
                maxRows={10}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    description: e.target.value,
                  })
                }
                style={
                  commandAction
                    ? { pointerEvents: "auto", opacity: "1" }
                    : { pointerEvents: "none", opacity: "1" }
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
        <Button variant="contained" color="success" onClick={handle_saved}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default lup_comp_form;

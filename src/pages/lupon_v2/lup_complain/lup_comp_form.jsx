import React, { useState, useEffect } from "react";
import { TextField, InputLabel, FormControl } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";

import Button_lex from "../../../share/FormElements/Button";

//hooks
import { useFetch } from "../../../api/lupon";

const lup_comp_form = (props) => {
  //api
  const { sendRequest } = useFetch();

  let thisdate = new Date().toISOString().split("T")[0];
  //changing button
  const [change, setChange] = useState(false);

  //save state
  const [statesave, setStatesave] = useState(true);

  //form disabled
  const [commandAction, setCommandAction] = useState(false);
  const disableComponent = (status) => {
    setCommandAction(status);
  };
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

  const Datareceived = (datain) => {
    setDatain(datain);
  };

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
    setChange(true);
    setCommandAction(true);
    setStatesave(false);
    props.onReload("add");
    props.ondisable(true);
  };

  const handle_cancel = () => {
    setChange(false);
    setCommandAction(false);
    reset_input();
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
        setChange(false);
        props.onReload("saved");
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
        setChange(false);
        props.onReload("saved");
        props.ondisable(false);
        setStatesave(true);
      } catch (err) {
        return toast.error(err);
      }
    }
  };

  const onEdit = (params) => {
    setComplaint({
      ...complaint,
      _id: params.id,
      compdate: params.compdate,
      compnature: params.compnature,
      description: params.description,
      compstatus: params.compstatus,
    });
    setChange(true);
    setCommandAction(true);
    props.onReload("edit");
    props.ondisable(true);
  };

  props.receivedataform(onEdit);

  return (
    <div className="container-fluid">
      <div className="d-flex flex-row ">
        {!change ? (
          <Button_lex
            variant="primary"
            title="Add"
            size="lg"
            onClick={handle_add}
          >
            {/* <AddIcon /> */}
            Create
          </Button_lex>
        ) : (
          <Button_lex
            variant="success"
            className="btn-component"
            title="Save"
            size="lg"
            onClick={handle_saved}
          >
            <span className="d-flex justify-content-around">
              {/* <SaveIcon /> */}
              Save
            </span>
          </Button_lex>
        )}

        {!change ? (
          <div></div>
        ) : (
          <Button_lex
            variant="danger"
            className="btn-component ms-1"
            title="Add"
            size="lg"
            onClick={handle_cancel}
          >
            <span className="d-flex justify-content-around">
              {/* <CancelIcon /> */}
              Cancel
            </span>
          </Button_lex>
        )}
      </div>
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
  );
};

export default lup_comp_form;

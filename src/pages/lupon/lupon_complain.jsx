import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { TextField, InputLabel, FormControl } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Lupon_complain = (props) => {
  var thisdate = new Date().toISOString().split("T")[0];

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
    compdate: "",
    compnature: "",
    description: "",
    compstatus: "",
  });

  const Datareceived = (datain) => {
    setDatain(datain);
  };

  const reset_input = () => {
    setComplaint({
      compdate: thisdate,
      compnature: "",
      description: "",
      compstatus: "",
    });
  };
  //instructions
  const onCountReceived = async (param) => {
    // console.log(param);
    setParam(param);
    if (param == "ADD") {
      reset_input();
      setCommandAction(true);
    } else if (param == "CANCEL") {
      reset_input();
      setCommandAction(false);
    } else if (param == "REFRESH") {
      reset_input();

      setCommandAction(false);
    } else if (param == "SAVED") {
      // handle_saved();
    } else if (param == "EDIT") {
      setCommandAction(true);
    }
  };

  //passing data to complainant every change in the state of complaint
  useEffect(() => {
    props.Passcomplain(complaint);
  }, [complaint]);

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes ex datain is changing

    //setting datain datas
    const data_table = datain[0];

    // console.log(data_table);
    //ustate using form ustate
    setComplaint({
      ...complaint,
      compdate: data_table.compdate,
      compnature: data_table.compnature,
      description: data_table.description,
      compstatus: data_table.compstatus,
    });
  }, [datain]);

  props.PassdataCreator_2(Datareceived);
  //instructions
  props.receiverCreator2(onCountReceived);

  return (
    <div className="container-sm card shadow bg-body rounded">
      <div className="card-body mx-4">
        <div className="row text-center text-info ">
          <h1>Complaint</h1>
          <hr />
        </div>
        <div className="row d-flex flex-row justify-content-around ">
          <div className="col-lg-5 col-md-12 col-sm-12 d-flex flex-column ">
            <TextField
              variant="standard"
              label="Complaint Date"
              type="date"
              value={complaint.compdate}
              onChange={(e) =>
                setComplaint({
                  ...complaint,
                  compdate: e.target.value,
                })
              }
              inputProps={{ min: "2019-01-24", max: "2100-05-31" }}
              className="m-3"
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
                value={complaint.compstatus}
                onChange={(e) =>
                  setComplaint({
                    ...complaint,
                    compstatus: e.target.value,
                  })
                }
                // disabled={!commandAction ? "disabled" : ""}
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
          </div>
          <div className="col-lg-5 col-md-12 col-sm-12 ">
            <TextField
              className="mt-5"
              id="standard-multiline-static"
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              sx={{
                width: { sm: "100%", md: "100%", lg: "100%" },
                "& .MuiInputBase-root": {
                  height: 150,
                },
              }}
              inputProps={{ style: { fontSize: 16 } }}
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
    </div>
  );
};

export default Lupon_complain;

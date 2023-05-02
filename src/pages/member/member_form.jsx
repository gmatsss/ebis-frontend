import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { UserContext } from "../../UserContext";
import { toast } from "react-toastify";
import { useFetch } from "../../api/member";
const Member_form = (props) => {
  // api
  const { sendRequest } = useFetch();
  const { user } = useContext(UserContext);
  //disable
  const [commandAction, setCommandAction] = useState(false);

  const [member, setMember] = useState({
    code: "",
    fname: "",
    lname: "",
    position: "",
    gender: "",
  });

  const reset_input = () => {
    setMember({
      code: "",
      fname: "",
      lname: "",
      position: "",
      gender: "",
    });
  };

  const onCountReceived = async (param) => {
    // console.log(param);

    if (param == "ADD") {
      setCommandAction(true);
    } else if (param == "CANCEL") {
      reset_input();
      setCommandAction(false);
    } else if (param == "REFRESH") {
      reset_input();
      setCommandAction(false);
    } else if (param == "SAVED") {
      handle_saved();
    } else if (param == "EDIT") {
      // setInsave("Edit");
      // setCommandAction(true);
    }
  };

  const handle_saved = async () => {
    try {
      if (!member.code) return toast.error(`Please Type a Code`);
      if (!member.fname) return toast.error(`Please Type a First name`);
      if (!member.lname) return toast.error(`Please Type a Last name`);

      const details = {
        code: member.code,
        fname: member.fname,
        lname: member.lname,
        position: member.position,
        gender: member.gender,

        Modifiedby: user,
        Createdby: user,
      };

      const result = await sendRequest("/create/record", "POST", details);

      if (result && result.error) throw result.error;

      toast.success(result.success);
      props.onreload(true);
      reset_input();
      setCommandAction(false);
    } catch (e) {
      toast.error(e);
    }
  };
  props.receivecomandata(onCountReceived);
  return (
    <Box
      className=" d-flex flex-row  justify-content-center mt-4 "
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "100%" },
      }}
      noValidate
      autoComplete="off"
    >
      <div className="">
        <TextField
          required
          label="Code"
          name="code"
          style={{
            width: "30%",
            pointerEvents: commandAction ? "auto" : "none",
          }}
          onChange={(e) =>
            setMember({
              ...member,
              code: e.target.value,
            })
          }
          value={member.code}
          error={commandAction ? (!member.code ? true : false) : false}
          helperText={
            commandAction ? (!member.code ? "Code is required" : "") : false
          }
        />

        <TextField
          required
          style={{
            width: "70%",
            pointerEvents: commandAction ? "auto" : "none",
          }}
          label="First Name"
          name="fname"
          onChange={(e) =>
            setMember({
              ...member,
              fname: e.target.value,
            })
          }
          value={member.fname}
          error={commandAction ? (!member.fname ? true : false) : false}
          helperText={
            commandAction
              ? !member.fname
                ? "First name is required"
                : ""
              : false
          }
        />
        <TextField
          required
          style={{
            width: "70%",
            pointerEvents: commandAction ? "auto" : "none",
          }}
          label="Last Name"
          name="lname"
          onChange={(e) =>
            setMember({
              ...member,
              lname: e.target.value,
            })
          }
          value={member.lname}
          error={commandAction ? (!member.lname ? true : false) : false}
          helperText={
            commandAction
              ? !member.lname
                ? "Last name is required"
                : ""
              : false
          }
        />
      </div>
      <div className="">
        <TextField
          style={{
            width: "80%",
            marginTop: "79px",
            pointerEvents: commandAction ? "auto" : "none",
          }}
          label="Position"
          name="position"
          onChange={(e) =>
            setMember({
              ...member,
              position: e.target.value,
            })
          }
          value={member.position}
        />
        <TextField
          style={{
            width: "80%",
            pointerEvents: commandAction ? "auto" : "none",
          }}
          label="Gender"
          name="gender"
          onChange={(e) =>
            setMember({
              ...member,
              gender: e.target.value,
            })
          }
          value={member.gender}
        />
      </div>
    </Box>
  );
};

export default Member_form;

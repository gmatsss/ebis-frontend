import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-grid-system";
import { TextField, Box } from "@mui/material";
import Button from "../../share/FormElements/Button";
import { toast } from "react-toastify";

//api
import { useFetch } from "../../api/citizen";

//css
import "../../App.css";

//logged in user
import { UserContext } from "../../UserContext";

// props is the parameter if diable buttons or form
const citizen_form = (props) => {
  const { user } = useContext(UserContext);

  const { sendRequest } = useFetch();
  const [loggedMessage, setLoggeedMessage] = useState();

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState();

  const [Code, setCode] = useState("");
  const [Description, setDescription] = useState("");

  //table disable
  const [param, setParam] = useState(0);

  const [commandAction, setCommandAction] = useState(true);

  const disableComponent = (status) => {
    setCommandAction(status);
  };

  //changing button
  const [change, setChange] = useState(0);

  //add
  const createHandler = async () => {
    const param = "addRecord";
    setParam(param);
    const change = 1;
    setChange(change);
    console.log(param);
    props.onCountChanged(param);
    disableComponent(false);
  };

  //cancel
  const cancelHandler = async () => {
    const param = "cancelRecord";
    setParam(param);
    const change = null;
    setChange(change);
    props.onCountChanged(param);
    disableComponent(true);
    resetInputField();
  };

  //refresh code
  const refreshAddTable = () => {
    const param = "refreshTable";
    setParam(param);
    console.log("Control.jsx inc=" + param);
    props.onCountChanged(param);
    resetInputField();
  };

  // Reset Input Field handler
  const resetInputField = () => {
    setCode("");
    setDescription("");
  };

  /*
  const inputHandler = (e) => {
    setFormState((formValue) => {
      return {
        ...formValue,
        [e.target.name]: {
          value: e.target.value,
          name: e.target.value,
          isValid: true,
        },
      };
    });
 
  };

  useEffect(() => {
    //console.log(formState);
  }, [formState]);
*/
  const submitHandler = async () => {
    try {
      if (!Code) {
        return toast.error(`Please Type a Code`);
      }
      if (!Description) {
        return toast.error(`Please Type a Description`);
      }

      setLoading(true);
      const details = {
        Code: Code,
        Description: Description,
        Modifiedby: user,
        Createdby: user,
      };

      const result = await sendRequest("/create/record", "POST", details);
      setLoading(false);
      if (result) {
        //enable react table
        const change = null;
        setChange(change);
        refreshAddTable();

        //disable
        disableComponent(true);
        //console.log("pasok up");
        const res = await sendRequest("/g/record", "GET");
        console.log("pasok=" + res);
        setData(res);
        resetInputField();
      }
      // getHandler()

      if (result && result.error) {
        //enabaling mrt if error
        const param = "saved";
        setParam(param);
        props.onCountChanged(param);
        console.log(param);
        toast.error(result.error);
        resetInputField();
      }
      //import toastfy later
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          {!change ? (
            <Col lg={6}>
              <Button
                variant="success"
                className="btn-component"
                title="Add"
                size="lg"
                onClick={createHandler}
              >
                ADD
              </Button>
            </Col>
          ) : (
            <Col lg={6}>
              <Button
                variant="primary"
                className="btn-component"
                title="Saved"
                onClick={submitHandler}
                isLoading={isLoading}
              >
                Saved
              </Button>
            </Col>
          )}
          {!change ? (
            <Col lg={6}>
              <Button
                variant="warning"
                className="btn-component"
                title="Refresh"
                onClick={refreshAddTable}
              >
                Refresh
              </Button>
            </Col>
          ) : (
            <Col lg={6}>
              <Button
                variant="danger"
                className="btn-component"
                title="Cancel"
                onClick={cancelHandler}
              >
                Cancel
              </Button>
            </Col>
          )}
        </Row>
        <br />
        {loggedMessage && loggedMessage.error}

        <Row>
          <Col xs={12} md={12} lg={12}>
            <TextField
              type="text"
              className="form-control"
              label="Code"
              name="Code"
              variant="outlined"
              placeholder="Code"
              value={Code}
              onChange={(e) => setCode(e.target.value)}
              error={!commandAction ? (!Code ? true : false) : false}
              helperText={
                !commandAction ? (!Code ? "Code is required" : "") : false
              }
              autoComplete="off"
              disabled={commandAction ? "disabled" : ""}
              style={
                commandAction
                  ? { backgroundColor: "lightgrey" }
                  : { backgroundColor: "" }
              }
            />
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <TextField
              type="text"
              className="form-control"
              label="Description"
              name="Description"
              placeholder="Description"
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              error={!commandAction ? (!Description ? true : false) : false}
              helperText={
                !commandAction
                  ? !Description
                    ? "Description is required"
                    : ""
                  : false
              }
              autoComplete="off"
              disabled={commandAction ? "disabled" : ""}
              style={
                commandAction
                  ? { backgroundColor: "lightgrey" }
                  : { backgroundColor: "" }
              }
            />
          </Col>
        </Row>
        <br></br>

        <br />
      </Container>
    </>
  );
};

export default citizen_form;

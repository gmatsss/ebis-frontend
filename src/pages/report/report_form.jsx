import Modal from "react-bootstrap/Modal";
import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useFetch } from "../../api/report";
import { UserContext } from "../../UserContext";
const Report_form = (props) => {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();
  // modal state
  const [show, setShow] = useState(false);
  //save state
  const [insave, setInsave] = useState("");
  const handleClose = () => {
    setShow(false);
    reset_input();
    setInsave("");
  };

  const reset_input = () => {
    setReport({
      reportname: "",
      menuname: "",
      categoryname: "",
    });
  };

  const [report, setReport] = useState({
    _id: "",
    reportname: "",
    menuname: "",
    categoryname: "",
  });

  const onreceived = (data) => {
    if (data === "add") {
      setShow(true);
    } else if (data === "edit") {
      setShow(true);
      setInsave("edit");
      setReport({
        ...report,
        _id: props.reportone._id,
        reportname: props.reportone.reportname,
        menuname: props.reportone.menuname,
        categoryname: props.reportone.categoryname,
      });
    }
  };

  props.receiveadd(onreceived);

  const handle_saved = async () => {
    if (insave === "edit") {
      try {
        if (!report.reportname || !report.menuname || !report.categoryname)
          return toast.warning("Please fill out the required fields");

        const details = {
          _id: report._id,
          reportname: report.reportname,
          menuname: report.menuname,
          categoryname: report.categoryname,
          Modifiedby: user,
        };
        const result = await sendRequest("/u/record", "POST", details);
        if (result && result.error) throw result.error;
        setShow(false);
        toast.success(result);
        reset_input();
        props.onreload();
        setInsave("");
      } catch (error) {
        return toast.error(error);
      }
    } else {
      try {
        if (!report.reportname || !report.menuname || !report.categoryname)
          return toast.warning("Please fill out the required fields");

        const details = {
          reportname: report.reportname,
          menuname: report.menuname,
          categoryname: report.categoryname,
          Modifiedby: user,
          Createdby: user,
        };
        const result = await sendRequest("/create/record", "POST", details);
        if (result && result.error) throw result.error;
        setShow(false);
        toast.success(result);
        reset_input();
        props.onreload();
      } catch (error) {
        return toast.error(error);
      }
    }
  };

  return (
    <div>
      <Modal
        size="md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <div className="d-flex flex-column  w-75 ">
            <TextField
              label="Report name"
              variant="outlined"
              className="m-2"
              value={report.reportname}
              onChange={(e) =>
                setReport({
                  ...report,
                  reportname: e.target.value,
                })
              }
              error={!report.reportname ? true : false}
            />
            <TextField
              label="Menu name"
              variant="outlined"
              className="m-2"
              value={report.menuname}
              onChange={(e) =>
                setReport({
                  ...report,
                  menuname: e.target.value,
                })
              }
              error={!report.menuname ? true : false}
            />
            <TextField
              label="Category name"
              variant="outlined"
              className="m-2"
              value={report.categoryname}
              onChange={(e) =>
                setReport({
                  ...report,
                  categoryname: e.target.value,
                })
              }
              error={!report.categoryname ? true : false}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            className="me-3"
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handle_saved}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Report_form;

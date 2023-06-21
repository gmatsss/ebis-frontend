import Modal from "react-bootstrap/Modal";
import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import { Button } from "@mui/material";
import MaterialReactTable from "material-react-table";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

//uselogged
import { UserContext } from "../../../UserContext";

//hooks
import { useFetch as fetchlupon } from "../../../api/lupon_api";
import { useFetch as fetchmember } from "../../../api/member";

const Lup_memmodal = (props) => {
  const { user } = useContext(UserContext);
  //api
  const { sendRequest: luponreq } = fetchlupon();
  const { sendRequest } = fetchmember();
  const [show, setShow] = useState(false);
  const [caseid, setCaseid] = useState(false);
  const [memberid, setMemberid] = useState(false);

  const handleClose = () => {
    setRowSelection("");
    setShow(false);
  };

  const handle_saved = async () => {
    const formData = new FormData();

    formData.append("memberid", memberid);
    formData.append("caseid", caseid);
    formData.append("Createdby", user.email);
    formData.append("Modifiedby", user.email);

    try {
      if (!memberid) return toast.warning("Please select member");
      const result = await luponreq(`/create/member/record`, "POST", formData);
      if (result.error) throw result.error;
      toast.success(result.success);
      setShow(false);
      props.onreload("");
    } catch (error) {
      toast.error(error);
    }
  };

  const onInstrcut = async (param) => {
    setCaseid(param);
    setShow(true);
    getHandler();
  };

  props.receivdatashow(onInstrcut);

  const columns = useMemo(
    () => [
      //column definitions...

      {
        accessorKey: "code",
        header: "Member Code",
      },
      {
        accessorKey: "fname",
        header: "First Name",
      },
      {
        accessorKey: "lname",
        header: "Last Name",
      },

      {
        accessorKey: "position",
        header: "position",
      },
      {
        accessorKey: "gender",
        header: "gender",
      },
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

  const [data, setData] = useState({});

  const getHandler = async () => {
    setData("");
    try {
      //alert loading
      const result = await sendRequest(
        `/g/record/${user.barangay}/${user.district}/${user.city}/${user.province}/${user.region}/`,
        "GET"
      );
      if (result && result.error) return toast.error({ error: result.error });
      setData(result);
    } catch (e) {
      toast.error(e);
    }
  };

  const [rowSelection, setRowSelection] = useState("");

  useEffect(() => {
    let datapass;
    for (name in rowSelection) {
      datapass = name;
    }
    setMemberid(datapass);
  }, [rowSelection]);

  // reamark modal variables

  const [insave, setInsave] = useState("");
  const [showremark, setShowremark] = useState(false);
  const [Idparam, setIdparam] = useState({
    memberid: "",
    caseid: "",
  });
  const [memberparam, setMemberparam] = useState({
    id: "",
    remark: "",
  });

  //reset caseid and memid fro actions tom
  useEffect(() => {
    if (!props.receiveidaction) {
      setIdparam({
        ...Idparam,
        memberid: "",
        caseid: "",
      });
      return;
    }

    setIdparam({
      ...Idparam,
      memberid: props.receiveidaction.memberid,
      caseid: props.receiveidaction.caseid,
    });
  }, [props.receiveidaction]);

  const handleCloseRemark = () => {
    setShowremark(false);
    setMemberparam({
      ...memberparam,
      remark: "",
      id: "",
    });
    setInsave("");
  };

  const onactioninstruct = (data) => {
    if (data === "add") {
      setShowremark(true);
    } else {
      setMemberparam({
        remark: data.remark,
        id: data.id,
      });
      setShowremark(true);
      setInsave("edit");
    }
  };

  props.receiveactionparam(onactioninstruct);

  const handle_saved_remark = async () => {
    const formData = new FormData();
    formData.append("memberid", Idparam.memberid);
    formData.append("caseid", Idparam.caseid);
    formData.append("id", memberparam.id);
    formData.append("remark", memberparam.remark);
    formData.append("Createdby", user.email);
    formData.append("Modifiedby", user.email);
    if (!memberparam.remark) return toast.warning("Please enter remark");
    if (insave === "edit") {
      try {
        const result = await luponreq("/u/a/record", "POST", formData);

        if (result.error) throw result.error;
        toast.success(result.success);
        props.reloadremark(true);
        handleCloseRemark();
        setInsave("");
      } catch (error) {
        return toast.error(error);
      }
    } else {
      try {
        const result = await luponreq(
          "/create/action/record",
          "POST",
          formData
        );

        if (result.error) throw result.error;
        toast.success(result.success);
        props.reloadremark(true);
        handleCloseRemark();
      } catch (error) {
        return toast.error(error);
      }
    }
  };

  return (
    <div>
      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Select member for this case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MaterialReactTable
            columns={columns}
            data={data}
            getRowId={(row) => row._id}
            enableMultiRowSelection={false} //use radio buttons instead of checkboxes
            enableRowSelection
            positionToolbarAlertBanner="none"
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
            muiTableContainerProps={{ sx: { maxHeight: "250px" } }}
            onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
            state={{ rowSelection, showSkeletons: data ? false : true }} //pass our managed row selection state to the table to use
            initialState={{
              pagination: { pageSize: 10, pageIndex: 0 },
              density: "compact",
              columnVisibility: {
                gender: false,
                Createdby: false,
                DateCreated: false,
                Status: false,
                _id: false,
              },
            }}
          />
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

      <Modal
        size="md"
        show={showremark}
        onHide={handleCloseRemark}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Member action </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            className="mx-5"
            id="outlined-multiline-flexible"
            label="Remark"
            multiline
            rows={10}
            style={{ width: "80%" }}
            value={memberparam.remark}
            onChange={(e) =>
              setMemberparam({
                ...memberparam,
                remark: e.target.value,
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="error"
            onClick={handleCloseRemark}
            className="me-3"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handle_saved_remark}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Lup_memmodal;

//sfc stateless function
import React, { useState, useMemo, useEffect, useRef, useContext } from "react";
//usercontent
import { UserContext } from "../../../UserContext";
import { toast } from "react-toastify";
import { useFetch } from "../../../api/location";
import MaterialReactTable from "material-react-table";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import Modal from "react-bootstrap/Modal";
import TextField from "@mui/material/TextField";
import { Delete, Edit } from "@mui/icons-material";

// popup delete
import Notiflix from "notiflix";

const Prov_table = (props) => {
  const { user } = useContext(UserContext);
  //modal
  const [show, setShow] = useState(false);
  //api
  const { sendRequest } = useFetch();

  const [data, setData] = useState({});
  //optionally, you can manage the row selection state yourself

  const [insave, setInsave] = useState("");
  const [reg_id, setReg_id] = useState("");
  const [province, setProvince] = useState({
    _id: "",
    code: "",
    name: "",
  });
  const [rowSelection, setRowSelection] = useState({});
  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
      },
      {
        accessorKey: "name",
        header: "province name",
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

  const validate = () => {
    if (!province.code) return "Code is required";
    if (!province.name) return "Province name is required";
  };

  const getHandler = async (param) => {
    setData("");
    setRowSelection("");
    setReg_id("");
    try {
      //alert loading
      const result = await sendRequest(`/g/p/record/${param}`, "GET");
      if (result && result.error) throw result.error;
      setData(result);
      setReg_id(param);
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const handleClose = () => {
    setShow(false);
    setProvince({
      _id: "",
      code: "",
      name: "",
    });
    setInsave("");
  };

  const handle_saved = async () => {
    const formData = {
      reg_id: reg_id,
      _id: province._id,
      code: province.code,
      name: province.name,
      Modifiedby: user,
      Createdby: user,
    };

    if (insave === "edit") {
      try {
        console.log("Edit pasok");
        const val = validate();
        if (val) throw val;
        const result = await sendRequest("/u/c/record", "POST", formData);
        if (result.error) throw result.error;
        toast.success(result.success);
        handleClose();
        getHandler();
      } catch (error) {
        toast.error(error);
      }
    } else {
      try {
        const val = validate();
        if (val) throw val;
        const result = await sendRequest("/create/p/record", "POST", formData);
        if (result.error) throw result.error;
        toast.success(result.success);
        handleClose();
        getHandler(reg_id);
      } catch (error) {
        toast.error(error);
      }
    }
  };

  props.receiveregid(getHandler);
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
          <Modal.Title>Province</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <div className="d-flex flex-column" style={{ width: "60%" }}>
            <TextField
              color="primary"
              id="outlined-error"
              label="province Code"
              variant="standard"
              className="mb-4"
              value={province.code}
              onChange={(e) =>
                setProvince({
                  ...province,
                  code: e.target.value,
                })
              }
            />
            <TextField
              color="primary"
              id="outlined-error"
              label="Province Name"
              variant="standard"
              className="mb-4"
              value={province.name}
              onChange={(e) =>
                setProvince({
                  ...province,
                  name: e.target.value,
                })
              }
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
      <MaterialReactTable
        columns={columns}
        data={data}
        getRowId={(row) => row._id}
        positionToolbarAlertBanner="none"
        renderTopToolbarCustomActions={({ table }) => (
          <div>
            <Button
              color="secondary"
              onClick={() => {
                setShow(true);
              }}
              variant="contained"
              disabled={!reg_id ? true : false}
            >
              Add Province
            </Button>
          </div>
        )}
        muiTableBodyRowProps={({ row }) => ({
          //implement row selection click events manually
          //getting the data id

          onClick: () => {
            setRowSelection(() => ({
              //enabling selection row
              // [row.id]: true,
              // id: [row.id],

              [row.id]: [row.id],
            }));
          },

          selected: rowSelection[row.id],
          sx: {
            cursor: "pointer",
          },
        })}
        state={{ rowSelection, showSkeletons: data ? false : true }} //pass our managed row selection state to the table to use
        initialState={{
          pagination: {
            pageSize: 5,
            pageIndex: 0,
          },
          density: "compact",
          columnVisibility: {
            Createdby: false,
            DateCreated: false,
            Status: false,
            _id: false,
            imageofcomp: false,
            addressofcomp: false,
            addressofresp: false,
            imageofresp: false,
            Modifiedby: false,
            compdate: false,
            compnature: false,
            description: false,
            compstatus: false,
          },
        }}
        //customize built-in buttons in the top-right of top toolbar
      />
    </div>
  );
};

export default Prov_table;

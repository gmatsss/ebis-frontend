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

const Reg_table = (props) => {
  const { user } = useContext(UserContext);
  //modal
  const [show, setShow] = useState(false);
  //api
  const { sendRequest } = useFetch();
  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState({});
  //form ustate code
  const [region, setRegion] = useState({
    _id: "",
    code: "",
    name: "",
  });

  const [insave, setInsave] = useState("");
  const columns = useMemo(
    () => [
      {
        accessorKey: "code",
        header: "Code",
      },
      {
        accessorKey: "name",
        header: "Region name",
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

  let shouldlog = useRef(true);

  const getHandler = async () => {
    setData("");
    try {
      //alert loading
      const result = await toast.promise(sendRequest("/g/record", "GET"), {
        pending: "Please wait data is loading",
        success: "Data loaded",
        error: `Error`,
      });
      if (result && result.error) return toast.error({ error: result.error });
      setData(result);
    } catch (e) {
      // setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    setRegion({
      _id: "",
      code: "",
      name: "",
    });
    setInsave("");
  };

  const handle_edit = (data) => {
    console.log(data);
    setRegion({
      ...region,
      _id: data._id,
      code: data.code,
      name: data.name,
    });
    setInsave("edit");
    setShow(true);
  };

  const validate = () => {
    if (!region.code) return "Code is required";
    if (!region.name) return "Region name is required";
  };

  const handle_saved = async () => {
    const formData = {
      _id: region._id,
      code: region.code,
      name: region.name,
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
        const result = await sendRequest("/create/record", "POST", formData);
        if (result.error) throw result.error;
        toast.success(result.success);
        handleClose();
        getHandler();
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this Region ${data.code}?`,
      "Yes",
      "No",
      async function okCb() {
        const details = {
          _id: data._id,
          Modifiedby: data.Modifiedby,
        };
        const result = await sendRequest("/d/record", "POST", details);
        if (result.error) return toast.error(result.error);
        toast.success(result.success);
        getHandler();
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

  const handle_refresh = () => {
    getHandler();
    setRowSelection("");
  };

  useEffect(() => {
    let datapass;
    for (name in rowSelection) {
      datapass = name;
    }
    props.onPassregid(datapass);
  }, [rowSelection, data]);

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
          <Modal.Title> Region</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <div className="d-flex flex-column" style={{ width: "60%" }}>
            <TextField
              color="primary"
              id="outlined-error"
              label="Region Code"
              variant="standard"
              className="mb-4"
              value={region.code}
              onChange={(e) =>
                setRegion({
                  ...region,
                  code: e.target.value,
                })
              }
            />
            <TextField
              color="primary"
              id="outlined-error"
              label="Region Name"
              variant="standard"
              className="mb-4"
              value={region.name}
              onChange={(e) =>
                setRegion({
                  ...region,
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
        enableStickyHeader
        muiTableContainerProps={{ sx: { maxHeight: "315px" } }}
        renderTopToolbarCustomActions={({ table }) => (
          <div>
            <Button
              color="success"
              onClick={() => {
                setShow(true);
              }}
              variant="contained"
              className="me-1"
            >
              Add Region
            </Button>
            <Button
              color="primary"
              onClick={() => {
                handle_refresh();
              }}
              variant="contained"
            >
              Refresh
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
        enableRowActions
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              onClick={() => {
                handle_edit(row.original);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                handleDeleteRow(row.original); //tuloy mamaya
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        )}
        state={{ rowSelection, showSkeletons: data ? false : true }} //pass our managed row selection state to the table to use
        initialState={{
          pagination: {
            pageSize: 10,
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

export default Reg_table;

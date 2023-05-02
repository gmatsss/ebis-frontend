import React, { useMemo, useState, useRef, useEffect, useContext } from "react";
import MaterialReactTable from "material-react-table";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Rowing } from "@mui/icons-material";
import { toast } from "react-toastify";

// popup delete
import Notiflix from "notiflix";

import { useFetch } from "../../api/member";
import { UserContext } from "../../UserContext";

const Member_table = (props) => {
  const { user } = useContext(UserContext);
  // hooks
  const { sendRequest } = useFetch();

  //disable table
  const [state, setState] = useState(false);
  //change button
  const [changeB, setChangeB] = useState(false);

  const columns = useMemo(
    () => [
      //column definitions...

      {
        accessorKey: "code",
        header: "code",
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

  let shouldlog = useRef(true);

  const getHandler = async () => {
    setData("");
    setState(false);
    setChangeB(false);
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
      setLoggeedMessage({ error: e.message });
    }
  };

  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    //if using flat data and simple accessorKeys/ids, you can just do a simple assignment here.
    try {
      const details = {
        _id: values._id,
        code: values.code,
        fname: values.fname,
        lname: values.lname,
        position: values.position,
        gender: values.gender,
        Modifiedby: user,
      };

      const result = await sendRequest("/u/record", "POST", details);
      if (result && result.error) throw result.error;

      toast.success(result.success);
      getHandler();
      exitEditingMode(); //required to exit editing mode
    } catch (error) {
      toast.error(error);
    }
  };

  const handle_add = () => {
    props.discommand("ADD");
    setState(true);
    setChangeB(true);
  };

  const handle_cancel = () => {
    props.discommand("CANCEL");
    setState(false);
    setChangeB(false);
  };

  const handle_save = () => {
    props.discommand("SAVED");
  };

  const handle_refresh = () => {
    getHandler();
  };

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this case no ${data.code}?`,
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

  props.receivereload(getHandler);
  return (
    <div
      className="p-5"
      style={{
        PointerEvent: "none",
      }}
    >
      {!changeB ? (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            p: "4px",
          }}
        >
          <Button
            color="secondary"
            onClick={() => {
              handle_add();
            }}
            variant="contained"
          >
            Create Member
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              handle_refresh();
            }}
            variant="contained"
          >
            Refresh
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            p: "4px",
          }}
        >
          <Button
            color="secondary"
            onClick={() => {
              handle_save();
            }}
            variant="contained"
          >
            Save
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              handle_cancel();
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </Box>
      )}

      <MaterialReactTable
        columns={columns}
        data={data}
        editingMode="modal"
        enableEditing
        onEditingRowSave={handleSaveRow}
        muiTablePaperProps={{
          //table style
          sx: {
            pointerEvents: !state ? "auto" : "none",
            opacity: !state ? "1" : "0.5",
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>

            <Tooltip arrow placement="right" title="Delete">
              <IconButton
                color="error"
                onClick={() => handleDeleteRow(row.original)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </div>
  );
};

export default Member_table;

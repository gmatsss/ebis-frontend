import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { toast } from "react-toastify";

import MaterialReactTable from "material-react-table";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Rowing } from "@mui/icons-material";

//api
import { useFetch } from "../../api/citizen";

//logged in user
import { UserContext } from "../../UserContext";

const citizen_table = (props) => {
  //login user
  const { user } = useContext(UserContext);

  const { reload } = props;
  // hooks
  const { sendRequest } = useFetch();
  // const tableHook = useTable();

  // ulitities
  const [codeOld, setCodeOld] = useState();

  const [loggedMessage, setLoggeedMessage] = useState();
  const [isLoading, setLoading] = useState(false);

  // DATA
  const [data, setData] = useState();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  // const [validationErrors, setValidationErrors] = useState([]);

  /*
    let count = 0;
    const onCountReceived = () => {
        // alert('Clicked Count Control')
        //if (count != 0){
            getHandler();
        //}    
    }
    props.receiverCreator(onCountReceived);
    */

  const [param, setParam] = useState(0);
  const onCountReceived = (param) => {
    //console.log("Count received CountDisplay.jsx=" + param);
    setParam(param);
    // alert(param)
    if (param == "refreshTable") {
      setData("");
      setColumns("");
      setRows("");
      getHandler();
      setState(true);
    } else if (param == "addRecord") {
      title = "Add Record";
      setState(false);
      toast.success("Add button");
    } else if (param == "cancelRecord") {
      title = "Cancel Record";
      setState(true);
      toast.error("Cancel button");
    } else if (param == "saved") {
      title = "saved";
      setState(true);
    }
  };

  props.receiverCreator(onCountReceived);

  //disable mrt
  const [state, setState] = useState(true);
  useEffect(() => {
    title = "Why";
    setState(state);
    ////console.log("why");
  });

  const getHandler = async () => {
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
      setLoading(false);
      //console.log(e);
      setLoggeedMessage({ error: e.message });
    }
  };

  let title = "Citizen";
  let shouldlog = useRef(true);

  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  const tableHandler = () => {
    try {
      const column = [
        {
          header: "Code",
          accessorKey: "Code",
        },
        { header: "Description", accessorKey: "Description" },
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
      ];

      //for edit details
      let row = [];
      data.forEach((x) => {
        row.push({
          _id: x._id,
          Code: x.Code,
          Description: x.Description,
          DateCreated: x.DateCreated,
          Createdby: x.Createdby,
          DateModified: x.DateModified,
          Modifiedby: x.Modifiedby,
          Status: x.Status,
          id: x._id,
        });
      });
      setColumns(column);
      setRows(row);
    } catch (e) {
      //console.log(e);
    }
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
    tableHandler();
  }, [data]);

  //edit handle
  const editHandler = async ({ exitEditingMode, row, values }) => {
    data[row.index] = values;
    let code_old = codeOld;

    // alert(values);
    // const values = val.values
    try {
      //console.log("Editing details");
      //    setLoading(true);
      const details = {
        _id: values._id,
        Code: values.Code,
        Description: values.Description,
        Modifiedby: user,
      };
      //console.log(JSON.stringify(details));
      const result = await sendRequest("/u/record", "POST", details);
      //    setLoading(false);
      //console.log("LLT setLoading");
      if (result && result.error) return toast.error(result.error);

      toast.success(result.success);
      setRows("");
      getHandler();
    } catch (e) {
      //    setLoading(false);
      setLoggeedMessage({ error: e.message });
    }
    exitEditingMode();
    // setLoading(true); //required to exit editing mode
  };

  const handleDeleteRow = async (row) => {
    //const values = val.values
    // alert('rows=' + row);

    try {
      //console.log("Delete details");
      //setLoading(true);
      const details = {
        _id: row.getValue("_id"),
        Code: row.getValue("Code"),
        Modifiedby: user,
      };
      // alert('details' + details);
      if (
        !window.confirm(
          `Are you sure you want to delete Code ${row.getValue("Code")}`
        )
      ) {
        //console.log("Return delete..");
        return;
      }
      //console.log("Pasok" + JSON.stringify(details));
      const result = await sendRequest("/d/record", "POST", details);
      //console.log(result);
      getHandler();
      if (result && result.error)
        return setLoggeedMessage({ error: result.error });
    } catch (e) {
      setLoading(false);
      setLoggeedMessage({ error: e.message });
    }
    // exitEditingMode(); //required to exit editing mode
  };

  // { {pointerEvents: "none", opacity: "0.4"}}
  return (
    <>
      <div
        style={
          state
            ? { pointerEvents: "auto", opacity: "1" }
            : { pointerEvents: "none", opacity: "0.2" }
        }
      >
        <div>{/* code for disable material table */}</div>
        <MaterialReactTable
          columns={columns}
          data={rows}
          title="LIST OF Citizen ACCOUNTS"
          //editing mode you can change it to
          //'modal' | 'cell' | 'row' | 'table'
          editingMode="modal"
          enableEditing={true}
          onEditingRowSave={editHandler}
          initialState={{
            columnVisibility: {
              Createdby: false,
              DateCreated: false,
              Status: false,
              _id: false,
            },
          }}
          // icons={tableHook}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton
                  onClick={() => (
                    table.setEditingRow(row), setCodeOld(row.original.Code)
                  )}
                >
                  <Edit />
                </IconButton>
              </Tooltip>

              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </div>
    </>
  );
};

export default citizen_table;

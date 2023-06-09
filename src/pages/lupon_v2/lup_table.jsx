import React, { useMemo, useState, useRef, useEffect } from "react";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
} from "material-react-table";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Rowing } from "@mui/icons-material";
import Button_lex from "../../share/FormElements/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
// popup delete
import Notiflix from "notiflix";
//toast
import { toast } from "react-toastify";
//api
import { useFetch } from "../../api/lupon";
const Lup_table = (props) => {
  // hooks
  const { sendRequest } = useFetch();

  //data
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState();

  //get data to database
  const getHandler = async () => {
    props.onStateform("REFRESH");
    setData("");
    setColumns("");
    setRows("");

    setRowSelection("");
    setRowid("");
    setState(true);
    setChange(false);
    props.onPassdata("");
    props.onPassdata_2("");

    try {
      //alert loading
      const result = await toast.promise(sendRequest("/g/record", "GET"), {
        pending: "Please wait data is loading",
        success: "Data loaded",
        error: `Error`,
      });

      setData(result);

      if (result && result.error) return toast.error({ error: result.error });
    } catch (e) {
      //   setLoading(false);
      //console.log(e);
      toast.error({ error: e.message });
    }
  };

  //reload databese
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
          header: "Case no",
          accessorKey: "caseno",
        },
        { header: "Name of Complainant", accessorKey: "nameofcomp" },

        { header: "Gender", accessorKey: "genderofcomp" },
        { header: "Address", accessorKey: "addressofcomp" },
        { header: "Phone no#", accessorKey: "phoneofcomp" },
        {
          header: "Image",
          accessorKey: "imageofcomp",
          enableEditing: false,
        },
        { header: "Name of Respondent", accessorKey: "nameofresp" },

        { header: "Gender", accessorKey: "genderofresp" },
        { header: "Address", accessorKey: "addressofresp" },
        { header: "Phone no#", accessorKey: "phoneofresp" },
        {
          header: "Image",
          accessorKey: "imageofresp",
          enableEditing: false,
        },
        {
          header: "compdate",
          accessorKey: "compdate",
          enableEditing: false,
        },
        {
          header: "compnature",
          accessorKey: "compnature",
          enableEditing: false,
        },
        {
          header: "description",
          accessorKey: "description",
          enableEditing: false,
        },
        {
          header: "compstatus",
          accessorKey: "compstatus",
          enableEditing: false,
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
      ];

      //insert data to table
      let row = [];
      data.forEach((x) => {
        row.push({
          _id: x._id,
          caseno: x.caseno,
          nameofcomp: x.nameofcomp,
          genderofcomp: x.genderofcomp,
          addressofcomp: x.addressofcomp,
          phoneofcomp: x.phoneofcomp,
          imageofcomp: x.imageofcomp,
          nameofresp: x.nameofresp,
          genderofresp: x.genderofresp,
          addressofresp: x.addressofresp,
          phoneofresp: x.phoneofresp,
          imageofresp: x.imageofresp,

          compdate: x.compdate,
          compnature: x.compnature,
          description: x.description,
          compstatus: x.compstatus,

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
      return toast.error(e);
    }
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
    tableHandler();
  }, [data]);

  // mrt disable state
  const [state, setState] = useState(true);

  //changing button
  const [change, setChange] = useState(false);

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState({});
  //setting row id to form
  const [rowid, setRowid] = useState("");

  const [caseshow, setCaseshow] = useState("");

  const handle_add = () => {
    props.onStateform("ADD");
    setState(false);
    setChange(true);
    setRowid("");
    setRowSelection("");
    props.onPassdata("");
  };

  const handle_cancel = () => {
    props.onStateform("CANCEL");
    setState(true);
    setChange(false);
    setRowSelection("");
    setRowid("");
    props.onPassdata("");
  };

  const handle_save = () => {
    props.onStateform("SAVED");
  };

  //edit
  const handle_edit = (data) => {
    if (!data) return toast.warning("Please Select Case from the table");
    props.onStateform("EDIT");
    setState(false);
    setChange(true);
  };

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this case no ${data.caseno}?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("_id", data._id);
        const result = await sendRequest("/d/record", "POST", formData);
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

  props.PassreloadCreator(getHandler);

  useEffect(() => {
    let datapass;
    for (name in rowSelection) {
      datapass = name;
    }
    getdata(datapass);
  }, [rowSelection]);

  const getdata = async (newdata) => {
    if (newdata) {
      const result = await sendRequest(`/g/one/record/${newdata}`, "GET");
      setCaseshow(result[0].caseno);
      props.onPassdata(result);
    }
  };

  const [statecomp, setStatecomp] = useState(true);

  useEffect(() => {
    const params = props.disablefromcomp;

    if (params === true) {
      setStatecomp(false);
    } else if (params === false) {
      setStatecomp(true);
    }
  }, [props.disablefromcomp]);

  useEffect(() => {
    const params = props.disablefromdocs;

    if (params === true) {
      setStatecomp(false);
    } else if (params === false) {
      setStatecomp(true);
    }
  }, [props.disablefromdocs]);

  return (
    <div
      style={{
        opacity: statecomp ? "1" : "0.3",
        pointerEvents: statecomp ? "auto" : "none",
      }}
    >
      <MaterialReactTable
        columns={columns}
        data={rows}
        renderTopToolbarCustomActions={({ table }) => (
          <div>
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
                onClick={handle_save}
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
        )}
        getRowId={(row) => row._id}
        enableMultiRowSelection={false} //use radio buttons instead of checkboxes
        enableRowSelection
        muiTableBodyRowProps={({ row }) => ({
          //implement row selection click events manually
          //getting the data id
          onClick: () => {
            setRowSelection((prev) => ({
              [row.id]: !prev[row.id],
            }));
          },

          sx: {
            cursor: "pointer",
          },
        })}
        onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
        state={{ rowSelection }} //pass our managed row selection state to the table to use
        positionToolbarAlertBanner="none"
        // muiTablePaperProps={{
        //   //table style
        //   sx: {
        //     pointerEvents: statecomp ? "auto" : "none",
        //     opacity: statecomp ? "1" : "0.2",
        //   },
        // }}
        muiTableBodyCellProps={{
          sx: {
            pointerEvents: state ? (statecomp ? "auto" : "none") : "none",
            opacity: state ? (statecomp ? "1" : "0.2") : "0.2",
          },
        }}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box>
            <IconButton onClick={() => handle_edit(row.original)}>
              <Edit />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteRow(row.original)}
            >
              <Delete />
            </IconButton>
          </Box>
        )}
        enableStickyHeader
        muiTableContainerProps={{ sx: { maxHeight: "250px" } }}
        initialState={{
          pagination: { pageSize: 10, pageIndex: 0 },
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
            phoneofcomp: false,
            phoneofresp: false,
          },
        }}
        renderBottomToolbarCustomActions={(table) =>
          rowSelection ? (
            <div>
              <h5>
                Case No: <span className="h5">{caseshow}</span>
              </h5>
            </div>
          ) : (
            <div></div>
          )
        }
        renderToolbarInternalActions={({ table }) => (
          <Box>
            {/* add custom button to print table  */}

            {/* along-side built-in buttons in whatever order you want them */}
            <MRT_ToggleGlobalFilterButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            {/* <MRT_ShowHideColumnsButton table={table} /> */}
            <Tooltip arrow placement="right" title="Refresh">
              <IconButton
                onClick={() => {
                  getHandler();
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
    </div>
  );
};

export default Lup_table;

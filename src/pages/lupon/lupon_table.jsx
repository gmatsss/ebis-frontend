//sfc stateless function
import React, { useState, useMemo, useEffect, useRef } from "react";
//usercontent
import { UserContext } from "../../UserContext";

import { toast } from "react-toastify";

import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
} from "material-react-table";
import RefreshIcon from "@mui/icons-material/Refresh";
//theme
import { createTheme, ThemeProvider, useTheme } from "@mui/material";

import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Rowing } from "@mui/icons-material";

//animate
import { motion } from "framer-motion";

//popup
import Notiflix from "notiflix";

//sirlex style
import { Container, Row, Col } from "react-grid-system";
import Button_lex from "../../share/FormElements/Button";

//api
import { useFetch } from "../../api/lupon";

const lupon_table = (props) => {
  // hooks
  const { sendRequest } = useFetch();

  //data
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState();

  const [active, setActive] = useState(0);

  const getHandler = async () => {
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
      setLoading(false);
      //console.log(e);
      setLoggeedMessage({ error: e.message });
    }
  };

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      "Delete this record?",
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("_id", data.original._id);
        const result = await sendRequest("/d/record", "POST", formData);
        if (result.error) toast.error(result.error);
        handle_refresh();
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
        {
          header: "Delete",
          Cell: ({ row }) => (
            <Tooltip arrow placement="right" title="Delete">
              <Delete color="error" onClick={() => handleDeleteRow(row)} />
            </Tooltip>
          ),
          size: 20, //small column
          accessorKey: "Delete",
        },
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
      //console.log(e);
    }
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
    tableHandler();
  }, [data]);

  const globalTheme = useTheme();

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          //table
          mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
          //selection row
          primary: {
            main: "rgb(241,245,5)", //add in a custom color for the toolbar alert background stuff
          },
          //table information or tavble top commands
          info: {
            main: "rgb(0,0,0)", //add in a custom color for the toolbar alert background stuff
          },

          //table color
          background: {
            default:
              globalTheme.palette.mode === "light"
                ? "rgb(254,255,244)" //random light yellow color for the background in light mode
                : "#000", //pure black table in dark mode for fun
          },
        },
        typography: {
          button: {
            textTransform: "none", //customize typography styles for all buttons in table by default
            fontSize: "1.2rem",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem", //override to make tooltip font size larger
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              thumb: {
                color: "pink", //change the color of the switch thumb in the columns show/hide menu to pink
              },
            },
          },
        },
      }),
    [globalTheme]
  );

  // mrt disable state
  const [state, setState] = useState(true);

  //changing button
  const [change, setChange] = useState(false);

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState({});
  //setting row id to form
  const [rowid, setRowid] = useState("");

  const handle_add = () => {
    props.onStateform("ADD");
    setState(false);
    setChange(true);
    setRowid("");
    setRowSelection({});
    change_handle(0);
  };

  const handle_cancel = () => {
    props.onStateform("CANCEL");
    setState(true);
    setChange(false);
    setRowSelection({});
    setRowid("");
  };

  const handle_save = () => {
    props.onStateform("SAVED");
  };

  //refresh code
  const handle_refresh = () => {
    props.onStateform("REFRESH");
    setData("");
    setColumns("");
    setRows("");
    getHandler();
    setRowSelection({});
    setRowid("");
    setState(true);
    setChange(false);
  };

  //edit
  const handle_edit = () => {
    if (!rowid) return toast.warning("Please Select Case from the table");
    props.onStateform("EDIT");
    setState(false);
    setChange(true);
  };

  //passing data to form
  const get_id = (Data) => {
    //console.log(Data);
    setRowid(Data);
    //to pass data to lupon page component
    props.onPassdata(Data);
    props.onPassdata_2(Data);
  };

  const change_handle = (show) => {
    props.onShowpage(show);
    setActive(show);
  };

  props.PassreloadCreator(handle_refresh);

  return (
    <ThemeProvider theme={tableTheme}>
      <br />
      <div>
        <MaterialReactTable
          columns={columns}
          data={rows}
          getRowId={(row) => row._id}
          positionToolbarAlertBanner="none"
          renderTopToolbarCustomActions={({ table }) => (
            <div className="col mx-2">
              <motion.button
                whileTap={{
                  scale: 0.9,
                }}
                className={`btn btn-outline-dark  ${
                  active === 0 ? `active` : ``
                }`}
                onClick={() => {
                  change_handle(0);
                }}
              >
                Complainant / Respondent
              </motion.button>
              <motion.button
                whileTap={{
                  scale: 0.9,
                }}
                className={`btn btn-outline-dark ms-1 ${
                  active === 1 ? `active` : ``
                }`}
                onClick={() => {
                  change_handle(1);
                }}
              >
                Complain
              </motion.button>
              <motion.button
                whileTap={{
                  scale: 0.9,
                }}
                className={`btn btn-outline-dark ms-1 ${
                  active === 2 ? `active` : ``
                }`}
                onClick={() => {
                  change_handle(2);
                }}
              >
                Documents
              </motion.button>

              <motion.button
                whileTap={{
                  scale: 0.9,
                }}
                className={`btn btn-outline-dark ms-1 ${
                  active === 3 ? `active` : ``
                }`}
                onClick={() => {
                  change_handle(3);
                }}
              >
                Lupon Member / Action taken
              </motion.button>
            </div>
          )}
          muiTableBodyCellProps={{
            sx: {
              border: "0px", //remove border
              pointerEvents: state ? "auto" : "none",
              opacity: state ? "1" : "0.2",
            },
          }}
          muiTableBodyRowProps={({ row }) => ({
            //implement row selection click events manually
            //getting the data id

            onClick: () => {
              setRowSelection((prev) => ({
                //enabling selection row
                // [row.id]: true,
                // id: [row.id],

                [row.id]: !prev[row.id],
              }));
              //initialize all data then call function
              get_id([row.original]);
            },

            selected: rowSelection[row.id],
            sx: {
              cursor: "pointer",
            },
          })}
          state={{ rowSelection }}
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
          renderToolbarInternalActions={({ table }) => (
            <Box>
              {/* add custom button to print table  */}

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
                <Button_lex
                  variant="success"
                  className="btn-component ms-1"
                  title="Add"
                  size="lg"
                  onClick={handle_edit}
                >
                  <span className="d-flex justify-content-around">
                    {/* <CreateIcon /> */}
                    Edit
                  </span>
                </Button_lex>
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

              {/* along-side built-in buttons in whatever order you want them */}
              <MRT_ToggleGlobalFilterButton table={table} />
              <MRT_ToggleFiltersButton table={table} />
              <MRT_ShowHideColumnsButton table={table} />
              <Tooltip arrow placement="right" title="Refresh">
                <IconButton
                  onClick={() => {
                    handle_refresh();
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </div>
    </ThemeProvider>
  );
};

export default lupon_table;

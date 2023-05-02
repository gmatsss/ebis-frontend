import React, { useMemo, useState, useRef, useEffect } from "react";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
} from "material-react-table";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { Delete } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
// popup delete
import Notiflix from "notiflix";
//toast
import { toast } from "react-toastify";
//api
import { useFetch } from "../../../api/lupon";
const Lup_docs_table = (props) => {
  // hooks
  const { sendRequest } = useFetch();

  //data
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState();

  // mrt disable state
  const [state, setState] = useState(true);

  const viewfile = async (data) => {
    window.open(`http://localhost:8000/docs/${data.original.docname}`);
    // `http://docs.google.com/gview?url=http://localhost:8000/docs/${data.original.docname}`
  };

  const download = async (url, filename) => {
    const data = await fetch(url);
    const blob = await data.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.setAttribute("href", objectUrl);
    link.setAttribute("download", filename);
    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const getHandler = async (param) => {
    setRows("");
    setData("");
    try {
      //alert loading
      if (props.paramsdata) {
        const result = await sendRequest(
          `/g/d/record/${props.paramsdata}`,
          "GET"
        );
        if (result && result.error) throw result.error;
        setData(result);
      } else {
        const result = await sendRequest(`/g/d/record/${param}`, "GET");
        if (result && result.error) throw result.error;
        setData(result);
      }
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const tableHandler = () => {
    try {
      const column = [
        {
          header: "compid",
          accessorKey: "compid",
        },
        { header: "Document name", accessorKey: "docname" },

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
          header: "",
          Cell: ({ row }) => (
            <Tooltip arrow placement="left" title="View">
              <VisibilityIcon color="info" onClick={() => viewfile(row)} />
            </Tooltip>
          ),
          size: 10, //small column
          accessorKey: "View ",
        },
        {
          header: "",
          Cell: ({ row }) => (
            <Tooltip arrow placement="bottom" title="Download">
              <DownloadIcon
                color="success"
                onClick={() =>
                  download(
                    `http://localhost:8000/docs/${row.original.docname}`,
                    row.original.docname
                  )
                }
              />
            </Tooltip>
          ),
          size: 10, //small column
          accessorKey: "Download ",
        },
        {
          header: "",
          Cell: ({ row }) => (
            <Tooltip arrow placement="right" title="Delete">
              <Delete color="error" onClick={() => handleDeleteRow(row)} />
            </Tooltip>
          ),
          size: 10, //small column
          accessorKey: "Delete",
        },
      ];

      //insert data to table
      let row = [];
      data.forEach((x) => {
        row.push({
          compid: x.compid,
          docname: x.docname,

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

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this Document ${data.original.docname}?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("_id", data.original.id);
        const result = await sendRequest("/d/d/record", "POST", formData);
        if (result.error) toast.error(result.error);
        getHandler(data.original.compid);
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

  useEffect(() => {
    if (!data || data.length === 0) return;

    tableHandler();
  }, [data]);

  useEffect(() => {
    if (!props.paramsdata) {
      setRows("");
      setData("");
      return;
    }
    getHandler();
  }, [props.paramsdata]);

  props.receivereload(getHandler);

  return (
    <MaterialReactTable
      muiTablePaperProps={{
        //table style
        sx: {
          pointerEvents: state ? "auto" : "none",
          opacity: state ? "1" : "0.2",
        },
      }}
      columns={columns}
      data={rows}
      state={{ showProgressBars: data ? false : true }}
      positionToolbarAlertBanner="none"
      initialState={{
        pagination: {
          pageSize: 5,
          pageIndex: 0,
        },
        density: "compact",
        columnVisibility: {
          Modifiedby: false,
          DateModified: false,
          Status: false,
          _id: false,
          compid: false,
        },
      }}
      renderToolbarInternalActions={({ table }) => (
        <Box>
          {/* add custom button to print table  */}

          {/* along-side built-in buttons in whatever order you want them */}
          <MRT_ToggleGlobalFilterButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <Tooltip arrow placement="right" title="Refresh">
            <IconButton
              onClick={() => {
                getHandler(); //refresh
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    />
  );
};

export default Lup_docs_table;

import React, { useMemo, useState, useRef, useEffect, useContext } from "react";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
} from "material-react-table";
import { Box, Button, TextField, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit, Rowing } from "@mui/icons-material";

import RefreshIcon from "@mui/icons-material/Refresh";
// popup delete
import Notiflix from "notiflix";
//toast
import { toast } from "react-toastify";
//api
import { useFetch } from "../../../api/lupon";
import { UserContext } from "../../../UserContext";

const lup_comp_table = (props) => {
  const { user } = useContext(UserContext);
  // hooks
  const { sendRequest } = useFetch();

  //data
  const [data, setData] = useState("");

  // mrt disable state
  const [state, setState] = useState(true);

  //get data to database
  const getHandler = async (param) => {
    setData("");
    try {
      //alert loading
      if (props.paramsdata) {
        const result = await sendRequest(
          `/g/c/record/${props.paramsdata}`,
          "GET"
        );
        if (result && result.error) throw result.error;
        setData(result);
      } else {
        const result = await sendRequest(`/g/c/record/${param}`, "GET");
        if (result && result.error) throw result.error;
        setData(result);
      }
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "compid",
        accessorKey: "compid",
      },
      { header: "Complain date", accessorKey: "compdate" },
      { header: "Complain nature", accessorKey: "compnature" },
      { header: "Complain status", accessorKey: "compstatus" },
      {
        header: "Description",
        accessorKey: "description",
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

  useEffect(() => {
    if (!props.paramsdata) {
      setData("");
      return;
    }
    getHandler();
  }, [props.paramsdata]);

  const onCountReceived = (param) => {
    if (param == "refresh") {
      getHandler();
      setState(true);
    } else if (param == "cancel") {
      setState(true);
    } else if (param == "saved") {
      getHandler();
      setState(true);
    }
  };

  const handle_edit = (data) => {
    props.onshowmodal("edit");
    props.onform(data);
  };

  const handle_add = () => {
    props.onshowmodal("add");
  };

  const handleDeleteRow = (data) => {
    // console.log(data._id);
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this Complain ${data.compnature}?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("_id", data.id);
        formData.append("Modifiedby", user);
        const result = await sendRequest("/d/c/record", "POST", formData);
        if (result.error) toast.error(result.error);
        getHandler(data.compid);
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

  props.statecrud(onCountReceived);

  return (
    <MaterialReactTable
      muiTablePaperProps={{
        //table style
        sx: {
          pointerEvents: state ? "auto" : "none",
          opacity: state ? "1" : "0.2",
        },
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
          <Button
            color="primary"
            onClick={() => {
              handle_add();
            }}
            variant="contained"
          >
            Add Complain
          </Button>
        </Box>
      )}
      columns={columns}
      data={data}
      state={{ showProgressBars: data ? false : true }}
      positionToolbarAlertBanner="none"
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
      initialState={{
        pagination: {
          pageSize: 5,
          pageIndex: 0,
        },
        density: "compact",
        columnVisibility: {
          compid: false,
          Createdby: false,
          DateCreated: false,
          Status: false,
          _id: false,
        },
      }}
      renderToolbarInternalActions={({ table }) => (
        <Box>
          {/* add custom button to print table  */}

          {/* along-side built-in buttons in whatever order you want them */}
          <MRT_ToggleGlobalFilterButton table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
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

export default lup_comp_table;

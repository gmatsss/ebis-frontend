import React, { useMemo, useState, useEffect, useContext } from "react";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
} from "material-react-table";
import { toast } from "react-toastify";
import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useFetch } from "../../../api/lupon";

// popup delete
import Notiflix from "notiflix";

import { UserContext } from "../../../UserContext";
const Lup_action = (props) => {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();
  const [enableadd, setEnableadd] = useState(false);

  const [idparams, setIDparams] = useState();

  const [data, setData] = useState("");

  //delete member
  const [deleteid, setDeleteid] = useState();

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "id",
        header: "Id",
      },
      {
        accessorKey: "remark",
        header: "Remark",
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
    ],
    []
    //end
  );

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (!props.receivememid) {
      setEnableadd(false);
      setIDparams("");
      return;
    }

    setEnableadd(true);
    setIDparams(props.receivememid);
    props.passidtomodal(props.receivememid);
  }, [props.receivememid]);

  useEffect(() => {
    getHandler();
  }, [idparams]);

  const getHandler = async (data) => {
    setData("");
    setRowSelection("");

    if (idparams) {
      try {
        const result = await sendRequest(
          `/g/a/record/${idparams.caseid}/${idparams.memberid}`,
          "GET"
        );

        if (result.error) throw result.error;
        const myArray = result.filter(function (obj) {
          return obj.Status !== 0;
        });
        setData(myArray);
      } catch (e) {
        toast.error({ error: e.message });
      }
    } else {
      try {
        const result = await sendRequest(
          `/g/a/record/${data.caseid}/${data.memberid}`,
          "GET"
        );

        if (result.error) throw result.error;
        const myArray = result.filter(function (obj) {
          return obj.Status !== 0;
        });
        setData(myArray);
      } catch (e) {
        toast.error({ error: e.message });
      }
    }
  };

  props.receiveloadremark(getHandler);

  const handleDeleteRow = async (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this Remark?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("id", data.id);
        formData.append("remark", data.remark);
        formData.append("Createdby", user);
        formData.append("Modifiedby", user);
        const result = await sendRequest("/d/a/record", "POST", formData);
        if (result.error) return toast.error(result.error);
        toast.success(result.success);
        getHandler(result.id);
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

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      getRowId={(row) => row.memberid}
      renderTopToolbarCustomActions={({ table, row }) => (
        <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
          <Button
            color="success"
            disabled={enableadd ? false : true}
            onClick={() => props.toinstructmodal("add")}
            variant="contained"
          >
            Add remark
          </Button>
        </Box>
      )}
      state={{ showSkeletons: data ? false : true }} //pass our managed row selection state to the table to use
      positionToolbarAlertBanner="none"
      enableStickyHeader
      muiTableContainerProps={{ sx: { maxHeight: "215px" } }}
      initialState={{
        pagination: { pageSize: 10, pageIndex: 0 },
        density: "compact",
        columnVisibility: {
          Createdby: false,
          DateCreated: false,
          Status: false,
          id: false,
        },
      }}
      enableRowActions
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
          <IconButton
            onClick={() => {
              props.toinstructmodal(row.original);
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
                getHandler();
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

export default Lup_action;

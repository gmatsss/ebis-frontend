import React, { useMemo, useState, useEffect, useContext } from "react";
import MaterialReactTable, {
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleGlobalFilterButton,
  MRT_ToggleDensePaddingButton,
} from "material-react-table";
import { toast } from "react-toastify";
import { Delete, FlashlightOffRounded } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useFetch } from "../../../api/lupon";

// popup delete
import Notiflix from "notiflix";

import { UserContext } from "../../../UserContext";
const Lupon_member = (props) => {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();
  const [enableadd, setEnableadd] = useState(false);

  const [caseid, setCaseid] = useState(false);

  const [data, setData] = useState("");

  //delete member
  const [deleteid, setDeleteid] = useState();

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: "code",
        header: "Member Code",
      },
      {
        accessorKey: "luponmember",
        header: "Lupon member",
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
      { header: "memberid", accessorKey: "memberid", enableEditing: false },
    ],
    []
    //end
  );

  //optionally, you can manage the row selection state yourself
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (!props.receivdataid) {
      setData("");
      setDeleteid("");
      setEnableadd(false);
      setCaseid("");
      props.givememdid("");
      return;
    }

    setEnableadd(true);
    setCaseid(props.receivdataid);
    getHandler();
  }, [props.receivdataid]);

  const getHandler = async (param) => {
    setData("");
    setRowSelection("");
    props.givememdid("");
    try {
      //alert loading
      if (props.receivdataid) {
        const result = await sendRequest(
          `/g/m/record/${props.receivdataid}`,
          "GET"
        );

        if (result && result.error) throw result.error;
        setData(result);
      }
      //  else {
      //   const result = await sendRequest(`/g/m/record/${param}`, "GET");
      //   if (result && result.error) throw result.error;
      //   setData(result);
      // }
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  props.doreload(getHandler);

  useEffect(() => {
    let datapass;
    //if row selection have changed
    for (name in rowSelection) {
      datapass = name;
    }
    setDeleteid(datapass);
    if (!datapass) return;
    const data = { memberid: datapass, caseid: props.receivdataid };
    props.givememdid(data);
  }, [rowSelection]);

  const handleDeleteRow = (data) => {
    Notiflix.Confirm.show(
      "Delete ",
      `Delete this Member?`,
      "Yes",
      "No",
      async function okCb() {
        const formData = new FormData();
        formData.append("id", deleteid);
        formData.append("caseid", props.receivdataid);
        formData.append("Modifiedby", user.email);
        const result = await sendRequest("/d/m/record", "POST", formData);
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

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      getRowId={(row) => row.memberid}
      enableMultiRowSelection={false} //use radio buttons instead of checkboxes
      enableRowSelection
      renderTopToolbarCustomActions={({ table, row }) => (
        <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
          <Button
            color="success"
            disabled={enableadd ? false : true}
            onClick={() => {
              props.toshowmodal(caseid);
            }}
            variant="contained"
          >
            Add
          </Button>
          <Button
            color="error"
            disabled={deleteid ? false : true}
            onClick={() => {
              handleDeleteRow();
            }}
            variant="contained"
          >
            Delete
          </Button>
        </Box>
      )}
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
      onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
      state={{ rowSelection, showProgressBars: data ? false : true }} //pass our managed row selection state to the table to use
      positionToolbarAlertBanner="none"
      enableStickyHeader
      muiTableContainerProps={{ sx: { maxHeight: "215px" } }}
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

export default Lupon_member;

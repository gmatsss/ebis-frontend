import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../UserContext";
import { useFetch } from "../../api/resident";
import Select from "react-select";
import Parser from "html-react-parser";
import {
  Box,
  IconButton,
  Tooltip,
  Button,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
const Report_parse = (props) => {
  const { user } = useContext(UserContext);

  const { sendRequest } = useFetch();
  const [options, setOptions] = useState("");

  const [bclearance, setBclerance] = useState({
    name: "",
    address: "",
    dob: "",
    purpose: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [disgenreport, setDisgenreport] = useState("");

  let shouldlog = useRef(true);
  // datatable in to pass
  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  useEffect(() => {
    setDisgenreport("");
    setBclerance({
      ...bclearance,
      name: "",
      address: "",
      dob: "",
    });
    setSelectedValue("");
  }, [props.receivesetup]);

  const getHandler = async () => {
    try {
      //alert loading
      const arr = [];
      const result = await sendRequest(
        `/g/r/record/${user.barangay}/${user.district}`,
        "GET"
      );
      if (result && result.error) return toast.error({ error: result.error });
      await result.map((res) => {
        return arr.push({
          value: res._id,
          label: res.firstname + "," + res.lastname,
        });
      });
      setOptions(arr);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = async (selected) => {
    const resident_one = await sendRequest(
      `/one/r/record/${selected.value}`,
      "GET"
    );

    setBclerance({
      ...bclearance,
      name: resident_one.firstname + "," + resident_one.lastname,
      address: resident_one.address,
      dob: resident_one.dateofbirth,
    });
    setSelectedValue(selected);
  };

  const [selectedValue, setSelectedValue] = useState("");
  function Genreport() {
    if (!props.receivesetup) return;
    if (props.receivesetup.reportname === "rpt_Barangayclearance") {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-8">
              <Select
                placeholder="Select resident name"
                options={options}
                isLoading={options ? false : true}
                onChange={handleChange}
                value={selectedValue}
              />
            </div>
            <div className="col-4">
              <Button
                // style={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  display();
                }}
              >
                Generate report
              </Button>
            </div>
          </div>

          {/* <TextField
            autoFocus
            variant="outlined"
            label="Purpose"
            inputRef={(input) => {
              if (input != null) {
                input.focus();
              }
            }}
            value={bclearance.purpose}
            onChange={(e) =>
              setBclerance({
                ...bclearance,
                purpose: e.target.value,
              })
            }
          /> */}
        </div>
      );
    }
    if (props.receivesetup.reportname === "rpt_VehicleEntry") {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <Button
                // style={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  display();
                }}
              >
                Generate report
              </Button>
            </div>
          </div>
        </div>
      );
    }
    if (props.receivesetup.reportname === "rpt_BusinessClearance") {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <Button
                // style={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  display();
                }}
              >
                Generate report
              </Button>
            </div>
          </div>
        </div>
      );
    }
    if (props.receivesetup.reportname === "rpt_VehicleEntry") {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <Button
                // style={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  display();
                }}
              >
                Generate report
              </Button>
            </div>
          </div>
        </div>
      );
    }
    if (props.receivesetup.reportname === "rpt_Construction") {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <Button
                // style={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  display();
                }}
              >
                Generate report
              </Button>
            </div>
          </div>
        </div>
      );
    }
    if (props.receivesetup.reportname === "rpt_Indigency") {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-4">
              <Button
                // style={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  display();
                }}
              >
                Generate report
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  const display = () => {
    setDisgenreport(
      Parser(props.receivesetup.reportsetup, {
        replace: (domNode) => {
          if (domNode.attribs && domNode.attribs.name === "citizen_name") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {" "}
                {bclearance.name}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.name === "citizen_address") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {" "}
                {bclearance.address}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.name === "citizen_dob") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {bclearance.dob}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.name === "purpose") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {bclearance.purpose}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.name === "date_issued") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {bclearance.date}
              </span>
            );
          }
        },
      })
    );
  };

  return (
    <div className="">
      <Genreport />

      <div style={{ height: 720 }} className="overflow-auto">
        {disgenreport}
      </div>
    </div>
  );
};

export default Report_parse;

import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";

import { Button } from "@mui/material";
//api
import { useFetch } from "./api/report";
import Select from "react-select";

import Parser from "html-react-parser";
import ReactToPrint from "react-to-print";
import { UserContext } from "./UserContext";

const Rpt_lupon = () => {
  const { user } = useContext(UserContext);
  const loc = useLocation();

  const { sendRequest } = useFetch();
  const [showWindowPortal, SetShowWindowPortal] = useState(false);
  const [options, setOptions] = useState("");
  const [getreport, setGetreport] = useState("");

  const myContainer = useRef();

  let shouldlog = useRef(true);
  // datatable in to pass
  useEffect(() => {
    if (shouldlog.current) {
      shouldlog.current = false;
      getHandler();
    }
  }, []);

  const getHandler = async () => {
    try {
      //alert loading
      const arr = [];
      const result = await sendRequest(
        `/g/record/${user.barangay}/${user.district}/${user.city}/${user.province}/${user.region}/`,
        "GET"
      );
      if (result && result.error) return toast.error({ error: result.error });
      await result.map((res) => {
        return arr.push({ value: res._id, label: res.reportname });
      });
      setOptions(arr);
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const handleChange = async (selected) => {
    const result = await sendRequest(`/g/r/record/${selected.value}`, "GET");
    console.log(result);
    const getcase = await sendRequest(
      `/g/c/record/${loc.hash.replace("#", "")}`,
      "GET"
    );
    // const getcomplain = await sendRequest(
    //   `/g/comp/record/${loc.hash.replace("#", "")}`,
    //   "GET"
    // );

    // const arrayofresp = getcase.map((resp) => {
    //   return (
    //     <span style={{ borderBottom: "1px solid" }}>{resp.nameofresp}, </span>
    //   );
    // });

    // console.log(arrayofresp);
    // setGetreport(
    //   Parser(result[0].reportsetup, {
    //     replace: (domNode) => {
    //       if (domNode.attribs && domNode.attribs.name === "respondent") {
    //         return (
    //           <span style={{ borderBottom: "1px solid" }}>{arrayofresp}</span>
    //         );
    //       }
    //       if (domNode.attribs && domNode.attribs.name === "complainant") {
    //         return (
    //           <span style={{ borderBottom: "1px solid" }}>
    //             {getcase.nameofcomp}
    //           </span>
    //         );
    //       }
    //       if (domNode.attribs && domNode.attribs.name === "caseno") {
    //         return (
    //           <span style={{ borderBottom: "1px solid", color: "red" }}>
    //             {getcase.caseno}
    //           </span>
    //         );
    //       }
    //       if (domNode.attribs && domNode.attribs.name === "status") {
    //         return (
    //           <span style={{ borderBottom: "1px solid" }}>
    //             {getcomplain.compstatus}
    //           </span>
    //         );
    //       }
    //       if (domNode.attribs && domNode.attribs.name === "natureofcomplain") {
    //         return (
    //           <span style={{ borderBottom: "1px solid" }}>
    //             {getcomplain.compnature}
    //           </span>
    //         );
    //       }
    //       if (domNode.attribs && domNode.attribs.name === "dateofcomplain") {
    //         return (
    //           <span style={{ borderBottom: "1px solid" }}>
    //             {getcomplain.compdate}
    //           </span>
    //         );
    //       }
    //       if (domNode.attribs && domNode.attribs.name === "description") {
    //         return (
    //           <span style={{ borderBottom: "1px solid" }}>
    //             {getcomplain.description}
    //           </span>
    //         );
    //       }
    //     },
    //   })
    // );
  };

  const handleClose = () => {
    window.close();
  };
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-9">
            <h1>Lupon Report</h1>
            <Select
              placeholder="Select report name"
              options={options}
              isLoading={options ? false : true}
              onChange={handleChange}
            />
          </div>

          <div className="col-3 mt-1">
            <Button
              variant="contained"
              color="error"
              onClick={() => handleClose()}
              className="me-3"
            >
              Cancel
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button
                  // onClick={() => Print(false)}
                  color="success"
                  variant="contained"
                >
                  Print Report!
                </Button>
              )}
              content={() => myContainer.current}
            />
          </div>
        </div>
      </div>

      <div className="row" id="printable-content" ref={myContainer}>
        {getreport}
      </div>
    </div>
  );
};

export default Rpt_lupon;

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
      const result = await sendRequest(
        `/g/r/record/647e8bf5f379b12cb9a8473e`,
        "GET"
      );
      const getcase = await sendRequest(
        `/g/c/record/${loc.hash.replace("#", "")}`,
        "GET"
      );

      const arrayofresp = getcase.respondent.map((resp) => {
        return <span style={{ borderBottom: "1px solid" }}> {resp}, </span>;
      });

      const arrayofcomp = getcase.complainant.map((comp) => {
        return <span style={{ borderBottom: "1px solid" }}> {comp}, </span>;
      });

      const hearing = getcase.hearing.map((hear) => {
        return (
          <div
            className="container"
            style={{ borderBottom: "1px solid" }}
            key={hear._id}
          >
            <div className="row d-flex justify-content-center mt-4">
              <div className="col-5">
                <p>
                  Hearing Title:<span className="fw-bold">{hear.title}</span>
                </p>
                <p>
                  Hearing Date:
                  <span className="fw-bold">{hear.casedate}</span>
                </p>
                <p>
                  Case status:
                  <span
                    className={
                      hear.hearingstatus === "Settled"
                        ? "text-success fst-italic"
                        : "text-danger fst-italic"
                    }
                  >
                    {hear.hearingstatus}
                  </span>
                </p>
              </div>
              <div className="col-5">
                <p>
                  <span className="h5">Hearing outcome: </span>
                  <span style={{ borderBottom: "1px solid" }}>
                    {hear.hearingremarks}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      });

      // const member = getcase.members.map((mem) => {
      //   const remark = mem.remarks.map((remarks) => {
      //     return remarks.remark;
      //   });
      //   return (
      //     <div
      //       className="m-3"
      //       style={{ borderBottom: "1px solid" }}
      //       key={mem._id}
      //     >
      //       <li style={{ borderBottom: "1px solid" }}>
      //         Member name: {mem.luponmember}
      //       </li>
      //       <li style={{ borderBottom: "1px solid" }}>
      //         Position: {mem.position}
      //       </li>
      //       <li>Remarks: {remark} </li>
      //     </div>
      //   );
      // });

      setGetreport(
        Parser(result[0].reportsetup, {
          replace: (domNode) => {
            if (domNode.attribs && domNode.attribs.name === "respondent") {
              return (
                <span style={{ borderBottom: "1px solid" }}>{arrayofresp}</span>
              );
            }
            if (domNode.attribs && domNode.attribs.name === "complainant") {
              return (
                <span style={{ borderBottom: "1px solid" }}>{arrayofcomp}</span>
              );
            }
            if (domNode.attribs && domNode.attribs.name === "caseno") {
              return (
                <span
                  className="fst-italic h3"
                  style={{ borderBottom: "1px solid", color: "red" }}
                >
                  {getcase.caseno}
                </span>
              );
            }
            if (domNode.attribs && domNode.attribs.name === "casenature") {
              return (
                <span
                  className="fst-italic h5"
                  style={{ borderBottom: "1px solid" }}
                >
                  {getcase.casenature}
                </span>
              );
            }
            if (domNode.attribs && domNode.attribs.name === "description") {
              return (
                <span style={{ borderBottom: "1px solid" }}>
                  {getcase.casedesc}
                </span>
              );
            }
            if (domNode.attribs && domNode.attribs.name === "hearing") {
              return (
                <span style={{ borderBottom: "1px solid" }}>{hearing}</span>
              );
            }
          },
        })
      );
    } catch (e) {
      // console.log(e);
      toast.error({ error: e.message });
    }
  };

  // const handleChange = async (selected) => {

  //   // const getcomplain = await sendRequest(
  //   //   `/g/comp/record/${loc.hash.replace("#", "")}`,
  //   //   "GET"
  //   // );

  // };

  const handleClose = () => {
    window.close();
  };
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-9">
            <h1>Lupon Report</h1>
            {/* <Select
              placeholder="Select report name"
              options={options}
              isLoading={options ? false : true}
              onChange={handleChange}
            /> */}
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

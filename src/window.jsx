import React, { useState, useEffect, useRef } from "react";
import { MyWindowPortal } from "./MywindowPortal";
import Button_lex from "./share/FormElements/Button";
import { Button } from "@mui/material";
//api
import { useFetch } from "./api/report";
import Select from "react-select";

import Parser from "html-react-parser";
import ReactToPrint from "react-to-print";

const Window = (props) => {
  const { sendRequest } = useFetch();
  const [showWindowPortal, SetShowWindowPortal] = useState(false);
  const [options, setOptions] = useState("");
  const [getreport, setGetreport] = useState("");

  const myContainer = useRef();

  const [complainant, setComplainant] = useState("");

  const toggleWindowPortal = () => {
    SetShowWindowPortal(!showWindowPortal);
    if (showWindowPortal === false) setGetreport("");
    getHandler();
  };

  const getHandler = async () => {
    try {
      //alert loading
      const arr = [];
      const result = await sendRequest("/g/record", "GET");
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
    const getcase = await sendRequest(`/g/c/record/${props.getid}`, "GET");
    const getcomplain = await sendRequest(
      `/g/comp/record/${props.getid}`,
      "GET"
    );

    setGetreport(
      Parser(result[0].reportsetup, {
        replace: (domNode) => {
          if (domNode.attribs && domNode.attribs.id === "respondent") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {getcase.nameofresp}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.id === "complainant") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {getcase.nameofcomp}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.id === "caseno") {
            return (
              <span style={{ borderBottom: "1px solid", color: "red" }}>
                {getcase.caseno}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.id === "status") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {getcomplain.compstatus}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.id === "natureofcomplain") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {getcomplain.compnature}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.id === "dateofcomplain") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {getcomplain.compdate}
              </span>
            );
          }
          if (domNode.attribs && domNode.attribs.id === "description") {
            return (
              <span style={{ borderBottom: "1px solid" }}>
                {getcomplain.description}
              </span>
            );
          }
        },
      })
    );
  };

  // const Print = () => {
  //   const printableContent = document.getElementById("printable-content");
  //   const printWindow = window.open("", "", "height=1000,width=1000");
  //   printWindow.document.write(printableContent.innerHTML);
  //   printWindow.print();
  // };

  // class ComponentToPrint extends React.Component {
  //   render() {
  //     return <div>{getreport}</div>;
  //   }
  // }

  return (
    <div>
      <Button_lex
        onClick={toggleWindowPortal}
        variant={showWindowPortal ? "danger" : "success"}
        className="btn-component mx-1 "
      >
        {showWindowPortal ? "Close " : "Open "} Report
      </Button_lex>

      {showWindowPortal && (
        <MyWindowPortal>
          <div className="container-fluid">
            <div className="row d-flex">
              <div className="col-3">
                <h1> Case Report </h1>
              </div>
              <div className="col-6 mt-1">
                <Select
                  placeholder="Select report name"
                  options={options}
                  isLoading={options ? false : true}
                  onChange={handleChange}
                />
              </div>
              <div className="col-3 mt-1">
                <div className="d-flex justify-content-evenly">
                  <Button
                    onClick={() => SetShowWindowPortal(false)}
                    color={showWindowPortal ? "error" : "success"}
                    variant="contained"
                  >
                    Close Report
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

            {/* report page */}
            <div className="row" id="printable-content" ref={myContainer}>
              {getreport}
            </div>
          </div>
        </MyWindowPortal>
      )}
    </div>
  );
};

export default Window;

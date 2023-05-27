import React, { useState, useEffect, useRef } from "react";
import { MyWindowPortal } from "./MywindowPortal";
import Button_lex from "./share/FormElements/Button";
import { Button } from "@mui/material";
//api
import { useFetch } from "./api/report";
import Select from "react-select";

const Window = (props) => {
  const { sendRequest } = useFetch();
  const [showWindowPortal, SetShowWindowPortal] = useState(false);
  const [options, setOptions] = useState("");
  const [getreport, setGetreport] = useState("");

  const [chairman, setChairman] = useState("");

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
    setGetreport(result[0].reportsetup);
    setChairman("ako");
  };

  const Print = () => {
    var divContents = getreport;
    var a = window.open();
    a.document.write("<html>");
    a.document.write("<body>");
    a.document.write(divContents);
    a.document.write("</body></html>");
    a.document.close();
    a.print();
    a.close();
  };

  const theObj = { __html: getreport };

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
              <div className="col-2">
                <h1> Case Report </h1>
              </div>
              <div className="col-7 mt-1">
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
                    Close Print
                  </Button>
                  <Button
                    onClick={() => Print(false)}
                    color="success"
                    variant="contained"
                  >
                    Print Report!
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="row"
              id="printablediv"
              dangerouslySetInnerHTML={theObj}
            ></div>
          </div>
        </MyWindowPortal>
      )}
    </div>
  );
};

export default Window;

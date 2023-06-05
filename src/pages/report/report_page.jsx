import React, { useState } from "react";
import Report_table from "./report_table";
import Report_form from "./report_form";

const Report_page = () => {
  const onadd = (datain) => {
    addvar && addvar(datain);
  };

  let addvar = (datainfo) => {};

  const receiveadd = (handler) => {
    addvar = handler;
  };

  const onreload = (datain) => {
    reloadvar && reloadvar(datain);
  };

  let reloadvar = (datainfo) => {};

  const receivereload = (handler) => {
    reloadvar = handler;
  };

  const [reportone, setReportone] = useState("");
  const reportid = (data) => {
    setReportone(data);
  };

  const onsetup = (datain) => {
    setupvar && setupvar(datain);
  };
  let setupvar = (datainfo) => {};
  let onreloadsetupvar = (datainfo) => {};
  const receiveonreloadsetup = (handler) => {
    onreloadsetupvar = handler;
  };

  const [rebrgyvar, setRebrgyvar] = useState(true);
  const brgyvar = (datain) => {
    setRebrgyvar(datain);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <h1>Report</h1>
      </div>
      <div className="row">
        <div className="col-lg-9">
          <Report_table
            onadd={onadd}
            receivereload={receivereload}
            reportid={reportid}
            onsetup={onsetup}
            receiveonreloadsetup={receiveonreloadsetup}
            rebrgyvar={rebrgyvar}
          />
        </div>
        <div className="col-lg-3">
          <Report_form
            receiveadd={receiveadd}
            onreload={onreload}
            reportone={reportone}
            brgyvar={brgyvar}
          />
        </div>
      </div>
    </div>
  );
};

export default Report_page;

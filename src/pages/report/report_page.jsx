import React, { useState } from "react";
import Report_table from "./report_table";
import Report_form from "./report_form";
import Report_setup from "./report_setup";
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

  const receivesetup = (handler) => {
    setupvar = handler;
  };

  const onreloadsetup = (datain) => {
    onreloadsetupvar && onreloadsetupvar(datain);
  };

  let onreloadsetupvar = (datainfo) => {};

  const receiveonreloadsetup = (handler) => {
    onreloadsetupvar = handler;
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <Report_form
            receiveadd={receiveadd}
            onreload={onreload}
            reportone={reportone}
          />

          <Report_table
            onadd={onadd}
            receivereload={receivereload}
            reportid={reportid}
            onsetup={onsetup}
            receiveonreloadsetup={receiveonreloadsetup}
          />

          <Report_setup
            receivesetup={receivesetup}
            reportsetup={reportone}
            onreloadsetup={onreloadsetup}
          />
        </div>
      </div>
    </div>
  );
};

export default Report_page;

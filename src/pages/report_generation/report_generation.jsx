import React, { useState, useContext } from "react";
import Report_table from "./report_gen_table";
import Report_parse from "./report_gen_parse";
const Report_gen = () => {
  const [rersetup, setRersetup] = useState();
  const rsetup = (parms) => {
    if (!parms) return setRersetup("");
    setRersetup(parms[0]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <h1>Report gen</h1>
      </div>
      <div className="row m-2 mt-5">
        <div className="col-5">
          <Report_table rsetup={rsetup} />
        </div>
        <div className="col-7">
          <Report_parse receivesetup={rersetup} />
        </div>
      </div>
    </div>
  );
};

export default Report_gen;

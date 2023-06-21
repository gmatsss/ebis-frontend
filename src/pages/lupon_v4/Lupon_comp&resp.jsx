import React, { useState } from "react";

import Lupon_respondent from "./lupon_case/lupon_respondent";
import Lupon_complainant from "./lupon_case/Lupon_complainant";
const Lupon_r$c_page = (props) => {
  //get case id
  const [dataparams, setDataparams] = useState();
  const getid = (datain) => {
    if (datain) {
      setDataparams(datain[0]._id);
    } else {
      setDataparams("");
    }
  };

  props.receiveRespcomp(getid);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-6">
          <Lupon_respondent receiveid={dataparams} />
        </div>
        <div className="col-lg-6">
          <Lupon_complainant receiveid={dataparams} />
        </div>
      </div>
    </div>
  );
};

export default Lupon_r$c_page;

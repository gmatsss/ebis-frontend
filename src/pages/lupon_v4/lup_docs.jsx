import React, { useState, useEffect, useContext } from "react";
import Lupon_docs_form from "./lup_docs/lup_docs_form";
import Lupon_docs_table from "./lup_docs/lup_docs_table";

const Lup_docs = (props) => {
  //data caseid
  const [dataparams, setDataparams] = useState();
  const [dataparams2, setDataparams2] = useState();

  const Datareceived = (datain) => {
    if (datain) {
      setDataparams(datain[0]._id);
      setDataparams2(datain[0]._id);
    } else {
      setDataparams("");
      setDataparams2("");
    }
  };

  //page instruc
  const [disablecase, setDisablecase] = useState();
  const Instruc = (datain) => {
    setDisablecase(datain);
  };

  const realod_t = (datain) => {
    realod && realod(datain);
  };
  let realod = (datainfo) => {};
  const realod_table = (handler) => {
    realod = handler;
  };

  props.receivdatadocs(Datareceived);

  useEffect(() => {
    props.returntolupon(disablecase);
  }, [disablecase]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <Lupon_docs_form
            paramsdata={dataparams2}
            disablecase={Instruc}
            onReload_t={realod_t}
          />
        </div>
        <div className="col-lg-8 col-md-12">
          <Lupon_docs_table
            paramsdata={dataparams} //caseid
            receivereload={realod_table}
          />
        </div>
      </div>
    </div>
  );
};

export default Lup_docs;

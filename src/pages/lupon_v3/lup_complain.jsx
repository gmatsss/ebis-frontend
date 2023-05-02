import React, { useState, useEffect, useContext } from "react";
import Lup_comp_table from "./lup_complain/lup_comp_table";
import Lup_comp_form from "./lup_complain/lup_comp_form";

const lup_comp = (props) => {
  const [disablecase, setDisablecase] = useState();
  const [showmodal, setShowmodal] = useState();
  //page instruc
  let Passdatainstruc = (datainfo) => {};
  const Instruc = (datain) => {
    setDisablecase(datain);

    Passdatainstruc && Passdatainstruc(datain);
  };
  const Passdatainstruct = (handler) => {
    Passdatainstruc = handler;
  };

  //data caseid
  const [dataparams, setDataparams] = useState();
  let Passdata = (datainfo) => {};
  const Datareceived = (datain) => {
    if (datain) {
      setDataparams(datain[0]._id);
    } else {
      setDataparams("");
    }

    Passdata && Passdata(datain);
  };

  //edit dataform
  const onformdata = (datain) => {
    Passdatatoform && Passdatatoform(datain);
  };
  let Passdatatoform = (datainfo) => {};
  const Passdatatoformfunc = (handler) => {
    Passdatatoform = handler;
  };

  //received id
  props.receivdatacomp(Datareceived);

  //back to lupon compnent

  useEffect(() => {
    props.d_tablecase(disablecase);
  }, [disablecase]);

  const Instructoshow = (datain) => {
    Passdatainstrucshow && Passdatainstrucshow(datain);
  };
  let Passdatainstrucshow = (datainfo) => {};
  const Redatainstruct = (handler) => {
    Passdatainstrucshow = handler;
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 ">
          <Lup_comp_table
            paramsdata={dataparams} //caseid
            statecrud={Passdatainstruct}
            onform={onformdata}
            onshowmodal={Instructoshow}
          />
        </div>
        <div className="">
          <Lup_comp_form
            paramscasedata={dataparams} //caseid
            onReload={Instruc}
            receivedataform={Passdatatoformfunc}
            ondisable={Instruc}
            receivemodal={Redatainstruct}
          />
        </div>
      </div>
    </div>
  );
};

export default lup_comp;

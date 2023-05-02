import React, { useState } from "react";

import Lup_member from "./lup_action/lup_member";
import Lup_action from "./lup_action/lup_action";
import Lup_modal from "./lup_action/lup_modal";

const Lup_mem_act = (props) => {
  //data caseid
  const [dataparams, setDataparams] = useState();
  let Passdata = (datainfo) => {};
  const Datareceived = (datain) => {
    if (datain) {
      setDataparams(datain[0]._id);
    } else {
      setDataparams("");
    }

    // Passdata && Passdata(datain);
  };

  let Passdatashow = (datainfo) => {};
  const showmodalandadd = (datain) => {
    Passdatashow && Passdatashow(datain);
  };
  const datashow = (handler) => {
    Passdatashow = handler;
  };

  //id params to modal handlers
  const [idre, setIdre] = useState();
  const passidtomodal = (datain) => {
    if (datain) {
      setIdre(datain);
    } else {
      setIdre("");
    }
  };

  //edit remarks to form
  let editremark = (datainfo) => {};
  const onformparam = (datain) => {
    editremark && editremark(datain);
  };
  const receiveeditreamrk = (handler) => {
    editremark = handler;
  };

  const onreload = (datain) => {
    reloadin && reloadin(datain);
  };

  let reloadin = (datainfo) => {};

  const doreload = (handler) => {
    reloadin = handler;
  };

  const reloadremark = (datain) => {
    loadremark && loadremark(datain);
  };

  let loadremark = (datainfo) => {};

  const receiveloadremark = (handler) => {
    loadremark = handler;
  };

  const [regiveid, setRegiveid] = useState();
  const givememdid = (datain) => {
    if (datain) {
      setRegiveid(datain);
    } else {
      setRegiveid("");
    }
  };

  //received id
  props.receivdatamem(Datareceived);
  return (
    <div className="container-fluid">
      <div className="row ">
        <div className="col-lg-6 mt-1">
          <Lup_member
            receivdataid={dataparams}
            toshowmodal={showmodalandadd}
            doreload={doreload}
            givememdid={givememdid}
          />
        </div>
        <div className="col-lg-6 mt-1 ">
          <Lup_action
            receivememid={regiveid}
            passidtomodal={passidtomodal}
            toinstructmodal={onformparam}
            receiveloadremark={receiveloadremark}
          />
        </div>
      </div>
      <Lup_modal
        receivdatashow={datashow}
        onreload={onreload}
        receiveidaction={idre}
        reloadremark={reloadremark}
        receiveactionparam={receiveeditreamrk}
      />
    </div>
  );
};

export default Lup_mem_act;

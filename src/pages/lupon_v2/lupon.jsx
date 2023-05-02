import React, { useState } from "react";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";

//lupon components
import Lup_table from "./lup_table";
import Lup_case from "./lup_case";
import Lup_complain from "./lup_complain";
import Lup_docs from "./lup_docs";
import Lup_mem_act from "./Lup_mem_act";

const Lupon = (props) => {
  const [basicActive, setBasicActive] = useState("tab1");

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  //onclick table pass to form lupon

  //data holder
  let Passdatatocomp = (datainfo) => {};
  let Passdatatodocs = (datainfo) => {};
  let Passdata = (datainfo) => {};
  // Data holder and passing to lupon forms
  const Getdata = (datainfo) => {
    Passdata && Passdata(datainfo);
    Passdatatocomp && Passdatatocomp(datainfo);
    Passdatatodocs && Passdatatodocs(datainfo);
  };

  //bridge to pass to lupon form
  const PassdataCreator = (handler) => {
    Passdata = handler;
  };

  //data to comp
  const receivdatacomp = (handler) => {
    Passdatatocomp = handler;
  };

  const receivdatadocs = (handler) => {
    Passdatatodocs = handler;
  };

  let Passdata2 = (datainfo2) => {};
  // Data holder and passing to lupon forms
  const Getdata2 = (datainfo2) => {
    Passdata2 && Passdata2(datainfo2);
  };

  const PassdataCreator_2 = (handler2) => {
    Passdata2 = handler2;
  };

  //disable form
  const [param, setParam] = useState(1);

  let receiver = (param) => {
    // no-op
  };
  let receiver2 = (param) => {
    // no-op
  };

  let receiver3 = (param) => {
    // no-op
  };

  const trigger = (param) => {
    receiver && receiver(param);
    receiver2 && receiver2(param);
    receiver3 && receiver3(param);
  };

  const handle_caseshow = (x) => {
    if (x === true) {
      setParam(1);
    } else if (x === false) {
      setParam(0);
      setT_caseno("");
    }
  };

  const receiverCreator = (handler) => {
    receiver = handler;
  };

  //reload states
  const [reloadinfo, setreloadinfo] = useState(true);
  let Passreload = (reloadinfo) => {};
  // Data holder and passing to lupon forms
  const Getreload = (reloadinfo) => {
    Passreload && Passreload(reloadinfo);
  };
  //bridge to pass to lupon form
  const PassreloadCreator = (handler) => {
    Passreload = handler;
  };

  //complain state states
  const [handle_complain, setHandle_complain] = useState({});

  // Data holder and passing to lupon forms
  const complaindta = (handle_complain) => {
    setHandle_complain(handle_complain);
  };

  //docstate state states
  const [handle_docs, setHandle_docs] = useState();

  // Data holder and passing to lupon forms
  const docsdta = (docs) => {
    setHandle_docs(docs);
  };

  const [distab, setDistab] = useState(false);

  //instruct to disbale case table complian
  const [disablecase, setDisablecase] = useState();
  const ondisable = (parms) => {
    setDisablecase(parms);
    setDistab(parms);
  };

  //instruct to disbale case table docs
  const [disablecasedocs, setDisablecasedocs] = useState();
  const ondisabledocs = (parms) => {
    setDisablecasedocs(parms);
    setDistab(parms);
  };

  return (
    <div className="container-fluid ">
      <div className="row">
        <h1>Barangay San Antonio, Makati City, Metro Manila </h1>
      </div>
      <div className="row">
        <div className="col-lg-10">
          <Lup_table
            onPassdata={Getdata}
            onPassdata_2={Getdata2}
            onStateform={trigger}
            PassreloadCreator={PassreloadCreator}
            disablefromcomp={disablecase}
            disablefromdocs={disablecasedocs}
          />
        </div>
        <div className="col-lg-2 d-flex flex-column justify-content-center ">
          <img src={`/img/logo.jpg`} alt="" style={{ height: "300px" }} />
        </div>
      </div>

      <div className="row mt-2">
        <MDBTabs
          className="mb-3"
          style={{ pointerEvents: distab ? "none" : "auto" }}
        >
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab1")}
              active={basicActive === "tab1"}
            >
              Complainant/Respondent
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab2")}
              active={basicActive === "tab2"}
            >
              Complain
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab3")}
              active={basicActive === "tab3"}
            >
              Document
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab4")}
              active={basicActive === "tab4"}
            >
              Lupon Member/Action Taken
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={basicActive === "tab1"} className="bg-white">
            <Lup_case
              PassdataCreator={PassdataCreator}
              receiverCreator={receiverCreator}
              onReload={Getreload}
              PasscomplainCreator={handle_complain}
              receivedocs={handle_docs}
              onCaseshow={handle_caseshow}
            />
          </MDBTabsPane>
          <MDBTabsPane show={basicActive === "tab2"} className="bg-white">
            <Lup_complain
              receivdatacomp={receivdatacomp}
              d_tablecase={ondisable}
            />
          </MDBTabsPane>
          <MDBTabsPane show={basicActive === "tab3"} className="bg-white">
            <Lup_docs
              receivdatadocs={receivdatadocs}
              returntolupon={ondisabledocs}
            />
          </MDBTabsPane>
          <MDBTabsPane show={basicActive === "tab4"} className="bg-white">
            <Lup_mem_act />
          </MDBTabsPane>
        </MDBTabsContent>
      </div>
    </div>
  );
};

export default Lupon;

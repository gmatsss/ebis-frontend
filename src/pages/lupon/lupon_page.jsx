import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { motion } from "framer-motion";
import "../../share/css/gab.css";
//components
import Lupon_table from "./lupon_table";
import Lupon_complainant from "./lupon_complainant";
import Lupon_complain from "./lupon_complain";
import Lupon_docs from "./lupon_docs";

const lupon_page = () => {
  //onclick table pass to form lupon
  const [t_caseno, setT_caseno] = useState();
  const [datainfo, setDatainfo] = useState({});
  const [datainfo2, setDatainfo2] = useState({});
  //data holder
  let Passdata = (datainfo) => {};
  // Data holder and passing to lupon forms
  const Getdata = (datainfo) => {
    setT_caseno(datainfo[0].caseno);
    Passdata && Passdata(datainfo);
  };

  //bridge to pass to lupon form
  const PassdataCreator = (handler) => {
    Passdata = handler;
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

  const receiverCreator2 = (handler2) => {
    receiver2 = handler2;
  };

  const receiverCreator3 = (handler3) => {
    receiver3 = handler3;
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

  //show page
  const [show, setShow] = useState(0);
  const show_handle = (show) => {
    // console.log(show);
    setShow(show);
  };

  //docstate state states
  const [handle_docs, setHandle_docs] = useState();

  // Data holder and passing to lupon forms
  const docsdta = (docs) => {
    setHandle_docs(docs);
  };

  return (
    <div
      className="container-lg-12 px-1"
      style={{ height: "100%", backgroundColor: "" }}
    >
      <div className="row ">
        {/* sm 425px */}
        <div className="col-md-12 col-lg-12">
          <div className=" text-muted row">
            <div className="col d-flex justify-content-between">
              <div>
                <h1>Barangay San Antonio, Makati City, Metro Manila </h1>
              </div>

              <div>
                <img src={`/img/logo.jpg`} alt="" style={{ height: "70px" }} />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ opacity: param ? 1 : 0 }}
          className="row text-center text-muted"
        >
          <h3>
            Case No: <span>{t_caseno}</span>
          </h3>
        </motion.div>
      </div>
      <div className="row px-3">
        {/* sm 425px */}
        <div className="col-md-12 col-lg-12">
          <div>
            <motion.div
              style={show === 0 ? { display: "" } : { display: "none" }}
            >
              <Lupon_complainant
                PassdataCreator={PassdataCreator}
                receiverCreator={receiverCreator}
                onReload={Getreload}
                PasscomplainCreator={handle_complain}
                receivedocs={handle_docs}
                onCaseshow={handle_caseshow}
              />
            </motion.div>

            <div style={show === 1 ? { display: "" } : { display: "none" }}>
              <Lupon_complain
                PassdataCreator_2={PassdataCreator_2}
                receiverCreator2={receiverCreator2}
                Passcomplain={complaindta}
              />
            </div>

            <div style={show === 2 ? { display: "" } : { display: "none" }}>
              <Lupon_docs
                receiverCreator3={receiverCreator3}
                Passdocs={docsdta}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4 ">
        {/* sm 425px */}
        <div className="px-4  col-md-12 col-lg-12">
          <Lupon_table
            onPassdata={Getdata}
            onPassdata_2={Getdata2}
            onStateform={trigger}
            PassreloadCreator={PassreloadCreator}
            onShowpage={show_handle}
          />
        </div>
      </div>
    </div>
  );
};

export default lupon_page;

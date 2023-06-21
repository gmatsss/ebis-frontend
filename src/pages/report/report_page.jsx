import React, { useState, useEffect, useContext } from "react";
import Report_table from "./report_table";
import Report_form from "./report_form";
import { useFetch as uselocation } from "../../api/location";
import { UserContext } from "../../UserContext";

const Report_page = () => {
  const { user } = useContext(UserContext);
  const { sendRequest: sendlocation } = uselocation();
  const onadd = (datain) => {
    addvar && addvar(datain);
  };

  let addvar = (datainfo) => {};

  const receiveadd = (handler) => {
    addvar = handler;
  };

  const onreload = (datain, datain2) => {
    reloadvar && reloadvar(datain, datain2);
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

  const brgyvar = (datain) => {
    holdbrgyvar && holdbrgyvar(datain);
  };

  let holdbrgyvar = (datainfo) => {};

  const rebrgyvar = (handler) => {
    holdbrgyvar = handler;
  };

  const [usr_loc, setUsr_loc] = useState({
    region: "",
    province: "",
    city: "",
    district: "",
    barangay: "",
  });
  const loc = async () => {
    const result = await sendlocation(
      `/user/record/${user.barangay}/${user.district}/${user.city}/${user.province}/${user.region}/`,
      "GET"
    );
    if (result && result.error) throw result.error;

    setUsr_loc({
      ...usr_loc,
      region: result.region,
      province: result.province,
      city: result.city,
      district: result.district,
      barangay: result.barangay,
    });
  };

  useEffect(() => {
    loc();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-flex">
          <h1>Report</h1>
          {usr_loc && (
            <div className="m-1 mt-3 d-flex text-muted">
              <h5>
                {usr_loc.region},{usr_loc.province},{usr_loc.city},
                {usr_loc.district},{usr_loc.barangay}
              </h5>
            </div>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <Report_table
            onadd={onadd}
            receivereload={receivereload}
            reportid={reportid}
            onsetup={onsetup}
            receiveonreloadsetup={receiveonreloadsetup}
            rebrgyvar={rebrgyvar}
          />
        </div>

        <Report_form
          receiveadd={receiveadd}
          onreload={onreload}
          reportone={reportone}
          brgyvar={brgyvar}
        />
      </div>
    </div>
  );
};

export default Report_page;

import React, { useState } from "react";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";

import Page_regprov from "./Page_regprov";

const Location_page = () => {
  const [basicActive, setBasicActive] = useState("tab1");
  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };
  return (
    <div className="container-fluid ">
      <div className="row">
        <div className="col-lg-12">
          <h1>Barangay location</h1>
        </div>
      </div>

      <div className="row mt-5">
        <MDBTabs className="mb-3 d-flex justify-content-center">
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab1")}
              active={basicActive === "tab1"}
            >
              Region/Province
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab2")}
              active={basicActive === "tab2"}
            >
              City|Municipality/District
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab3")}
              active={basicActive === "tab3"}
            >
              Zone/Barangay
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleBasicClick("tab4")}
              active={basicActive === "tab4"}
            >
              Street
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={basicActive === "tab1"} className="bg-white">
            <Page_regprov />
          </MDBTabsPane>
          <MDBTabsPane
            show={basicActive === "tab2"}
            className="bg-white"
          ></MDBTabsPane>
          <MDBTabsPane
            show={basicActive === "tab3"}
            className="bg-white"
          ></MDBTabsPane>
          <MDBTabsPane
            show={basicActive === "tab4"}
            className="bg-white"
          ></MDBTabsPane>
        </MDBTabsContent>
      </div>
    </div>
  );
};

export default Location_page;

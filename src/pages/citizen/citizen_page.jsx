import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";

//pages to be merge
import Citizen_form from "./citizen_form";
import Citizen_table from "./citizen_table";

//css
import "../../App.css";

const citizen_page = () => {
  const [param, setParam] = useState(0);

  /*  
  let receiver = (count) => {
    // no-op
  };
  const trigger = (count) => {
    receiver(count);
  }
  const receiverCreator = (handler) => {
    console.log('receiverCreator apps.jsx=' + handler)
    receiver = handler;
  }
  */

  let receiver = (param) => {
    // no-op
  };

  const trigger = (param) => {
    receiver && receiver(param);
  };

  const receiverCreator = (handler) => {
    receiver = handler;
    //alert('handler=' + handler);
  };

  //<Col className='table' xs={12} sm={12} md={8} lg={8}><Table/></Col>
  //<Col className='form' xs={12} sm={12} md={4} lg={4}><Form /></Col>
  return (
    <div className="mainko">
      <Container lg={12}>
        <Row className="parent  mt-5 ">
          <Col className="table" xs={6} sm={6} md={9} lg={9}>
            <Citizen_table receiverCreator={receiverCreator} />
          </Col>
          <Col className="form" xs={6} sm={6} md={3} lg={3}>
            <Citizen_form onCountChanged={trigger} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default citizen_page;

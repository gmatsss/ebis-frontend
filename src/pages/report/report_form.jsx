import Modal from "react-bootstrap/Modal";
import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useFetch } from "../../api/report";
import { useFetch as uselocation } from "../../api/location";
import { UserContext } from "../../UserContext";
import Select from "react-select";

const Report_form = (props) => {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();
  const { sendRequest: sendlocation } = uselocation();
  // modal state
  const [show, setShow] = useState(false);
  //save state
  const [insave, setInsave] = useState("");
  const handleClose = () => {
    setShow(false);
    reset_input();
    setInsave("");
  };

  //state locations
  const [selectedValue, setSelectedValue] = useState({
    province: null,
    cities: null,
    district: null,
    barangay: null,
  });

  const [optionvalue, setoptionvalue] = useState({
    region: null,
    province: null,
    cities: null,
    district: null,
    barangay: null,
  });

  const [disable, setDisable] = useState({
    province: true,
    cities: true,
    district: true,
    barangay: true,
  });

  const reset_input = () => {
    setReport({
      reportname: "",
      menuname: "",
      categoryname: "",
    });
  };

  const [report, setReport] = useState({
    _id: "",
    reportname: "",
    menuname: "",
    categoryname: "",
  });

  const onreceived = (data) => {
    if (data === "add") {
      setShow(true);
    } else if (data === "edit") {
      setShow(true);
      setInsave("edit");
      setReport({
        ...report,
        _id: props.reportone._id,
        reportname: props.reportone.reportname,
        menuname: props.reportone.menuname,
        categoryname: props.reportone.categoryname,
      });
    }
  };

  props.receiveadd(onreceived);

  const handle_saved = async () => {
    if (insave === "edit") {
      try {
        if (!report.reportname || !report.menuname || !report.categoryname)
          return toast.warning("Please fill out the required fields");

        const details = {
          _id: report._id,
          reportname: report.reportname,
          menuname: report.menuname,
          categoryname: report.categoryname,
          Modifiedby: user,
        };
        const result = await sendRequest("/u/record", "POST", details);
        if (result && result.error) throw result.error;
        setShow(false);
        toast.success(result);
        reset_input();
        props.onreload();
        setInsave("");
      } catch (error) {
        return toast.error(error);
      }
    } else {
      try {
        if (!report.reportname || !report.menuname || !report.categoryname)
          return toast.warning("Please fill out the required fields");

        const details = {
          reportname: report.reportname,
          menuname: report.menuname,
          categoryname: report.categoryname,
          Modifiedby: user,
          Createdby: user,
        };
        const result = await sendRequest("/create/record", "POST", details);
        if (result && result.error) throw result.error;
        setShow(false);
        toast.success(result);
        reset_input();
        props.onreload();
      } catch (error) {
        return toast.error(error);
      }
    }
  };

  useEffect(() => {
    getHandler();
  }, []);

  const getHandler = async () => {
    try {
      //alert loading
      const arr = [];
      const result = await sendlocation("/g/record", "GET");
      if (result.error) throw result.error;
      await result.map((res) => {
        return arr.push({ value: res.code, label: res.description });
      });
      setoptionvalue({ ...optionvalue, region: arr });
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const handleregion_change = async (sel) => {
    setSelectedValue({
      ...selectedValue,
      province: "",
      cities: "",
      district: "",
      barangay: "",
    });
    // setoptionvalue({
    //   ...optionvalue,
    //   province: "",
    //   cities: "",
    //   district: "",
    //   barangay: "",
    // });
    setDisable({
      ...disable,
      province: true,
      cities: true,
      district: true,
      barangay: true,
    });

    try {
      if (!sel.value) return;
      const arr = [];
      const result = await sendlocation(`/p/record/${sel.value}`, "GET");

      if (result && result.error) throw result.error;
      await result.map((res) => {
        return arr.push({
          value: res.code,
          region: res.region,
          label: res.description,
        });
      });

      setoptionvalue({ ...optionvalue, province: arr });
      setDisable({
        ...disable,
        province: false,
        cities: true,
        district: true,
        barangay: true,
      });
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const handleprovince_change = async (value) => {
    setSelectedValue({
      ...selectedValue,
      province: value,
      cities: "",
      district: "",
      barangay: "",
    });
    setDisable({
      ...disable,
      cities: true,
      district: true,
      barangay: true,
    });

    try {
      const arr = [];
      const result = await sendlocation(
        `/c/record/${value.value}/${value.region}/`,
        "GET"
      );
      if (result && result.error) throw result.error;
      await result.map((res) => {
        return arr.push({
          value: res.code,
          region: res.region,
          province: res.province,
          label: res.description,
        });
      });
      setoptionvalue({ ...optionvalue, cities: arr });
      setDisable({
        ...disable,
        cities: false,
        district: true,
        barangay: true,
      });
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const handlecities_change = async (value) => {
    setSelectedValue({
      ...selectedValue,
      cities: value,
      district: "",
      barangay: "",
    });
    setDisable({
      ...disable,
      district: true,
      barangay: true,
    });

    try {
      if (!value) return;
      const arr = [];
      const result = await sendlocation(
        `/d/record/${value.value}/${value.province}/${value.region}/`,
        "GET"
      );

      if (result && result.error) throw result.error;
      await result.map((res) => {
        return arr.push({
          value: res.code,
          region: res.region,
          province: res.province,
          city: res.city,
          label: res.description,
        });
      });
      setoptionvalue({ ...optionvalue, district: arr });
      setDisable({
        ...disable,
        district: false,
        barangay: true,
      });
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const handledistrict_change = async (value) => {
    setSelectedValue({ ...selectedValue, district: value, barangay: "" });
    setDisable({
      ...disable,
      barangay: true,
    });
    try {
      if (!value) return;
      const arr = [];
      const result = await sendlocation(
        `/b/record/${value.value}/${value.city}/${value.province}/${value.region}/`,
        "GET"
      );
      if (result && result.error) throw result.error;
      await result.map((res) => {
        return arr.push({
          value: res.code,
          region: res.region,
          province: res.province,
          city: res.city,
          district: res.district,
          label: res.description,
        });
      });
      setoptionvalue({ ...optionvalue, barangay: arr });
      setDisable({
        ...disable,
        barangay: false,
      });
    } catch (e) {
      toast.error({ error: e.message });
    }
  };

  const handlebaranagay_change = async (value) => {
    setSelectedValue({ ...selectedValue, barangay: value });
  };

  console.log(selectedValue);

  useEffect(() => {
    if (!selectedValue.barangay) return props.brgyvar(true);
    props.brgyvar(false);
  }, [selectedValue.barangay]);

  return (
    <div>
      <Modal
        size="md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title> Report</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <div className="d-flex flex-column  w-75 ">
            <TextField
              label="Report name"
              variant="outlined"
              className="m-2"
              value={report.reportname}
              onChange={(e) =>
                setReport({
                  ...report,
                  reportname: e.target.value,
                })
              }
              error={!report.reportname ? true : false}
            />
            <TextField
              label="Menu name"
              variant="outlined"
              className="m-2"
              value={report.menuname}
              onChange={(e) =>
                setReport({
                  ...report,
                  menuname: e.target.value,
                })
              }
              error={!report.menuname ? true : false}
            />
            <TextField
              label="Category name"
              variant="outlined"
              className="m-2"
              value={report.categoryname}
              onChange={(e) =>
                setReport({
                  ...report,
                  categoryname: e.target.value,
                })
              }
              error={!report.categoryname ? true : false}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            className="me-3"
          >
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handle_saved}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <h1 className="text-muted text-center">Select location</h1>
      </div>

      <div
        className="m-2 d-flex flex-column justify-content-evenly "
        style={{ height: "350px" }}
      >
        <hr />
        <div>
          <Select
            placeholder="Select Region"
            isClearable={true}
            options={optionvalue.region}
            isLoading={optionvalue.region ? false : true}
            onChange={handleregion_change}
          />
        </div>
        <div>
          <Select
            placeholder="Select Province"
            isClearable={true}
            isDisabled={disable.province}
            options={optionvalue.province}
            value={selectedValue.province}
            onChange={handleprovince_change}
          />
        </div>
        <div>
          <Select
            placeholder="Select Cities"
            isClearable={true}
            isDisabled={disable.cities}
            options={optionvalue.cities}
            value={selectedValue.cities}
            onChange={handlecities_change}
          />
        </div>
        <div>
          <Select
            placeholder="Select District"
            isClearable={true}
            isDisabled={disable.district}
            options={optionvalue.district}
            value={selectedValue.district}
            onChange={handledistrict_change}
          />
        </div>
        <div>
          <Select
            placeholder="Select Barangay"
            isClearable={true}
            isDisabled={disable.barangay}
            options={optionvalue.barangay}
            value={selectedValue.barangay}
            onChange={handlebaranagay_change}
          />
        </div>
      </div>
    </div>
  );
};

export default Report_form;

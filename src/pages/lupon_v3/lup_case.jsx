import React, { useState, useEffect, useContext, useRef } from "react";
import { TextField, InputLabel, FormControl } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { toast } from "react-toastify";
import { useFetch } from "../../api/lupon";

//animate
import { motion } from "framer-motion";

import { UserContext } from "../../UserContext";

const lup_case = (props) => {
  const { user } = useContext(UserContext);
  const { sendRequest } = useFetch();

  //instructions
  const [param, setParam] = useState(0);

  //file upload
  const [selectedFile, setSelectedFile] = useState();

  const [selectedFile2, setSelectedFile2] = useState();

  //form ustate code
  const [complainant, setComplainant] = useState({
    _id: "",
    caseno: "",
    nameofcomp: "",
    genderofcomp: "",
    addressofcomp: "",
    phoneofcomp: "",
    imageofcomp: "",
    nameofresp: "",
    genderofresp: "",
    addressofresp: "",
    phoneofresp: "",
    imageofresp: "",
  });

  const [complaint, setComplaint] = useState({
    compdate: "",
    compnature: "",
    description: "",
    compstatus: "",
  });

  //validation
  const validate = () => {
    if (selectedFile) {
      if (!/jpg|png|whatever/.test(selectedFile.name)) {
        return "Please select valid image file for complainant";
      }
    }
    if (selectedFile2) {
      if (!/jpg|png|whatever/.test(selectedFile2.name)) {
        return "Please select valid image file for respondent";
      }
    }
    if (!complainant.caseno) return "Case no field is required";
    if (!complainant.nameofcomp) return "Name of complainant field is required";
    if (!complainant.nameofresp) return "Name of respondent field is required";
  };

  //form disabled
  const [commandAction, setCommandAction] = useState(false);
  const disableComponent = (status) => {
    setCommandAction(status);
  };

  //data in holder
  const [datain, setDatain] = useState("-");

  const Datareceived = (datain) => {
    setDatain(datain);
  };

  //preview image
  const [previmg_comp, setPrevimg_comp] = useState();
  const [previmg_resp, setPrevimg_resp] = useState();

  //file upload
  const changeHandler = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (!/jpg|png|whatever/.test(e.target.files[0].name)) {
        return toast.warning("Please select valid image file for complainant");
      } else {
        setSelectedFile(e.target.files[0]);
        setPrevimg_comp(URL.createObjectURL(e.target.files[0]));
      }
    }

    //setIsSelected(true);
  };

  const changeHandler2 = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (!/jpg|png|whatever/.test(e.target.files[0].name)) {
        return toast.warning("Please select valid image file for respondent");
      } else {
        setSelectedFile2(e.target.files[0]);
        setPrevimg_resp(URL.createObjectURL(e.target.files[0]));
      }
    }

    //setIsSelected(true);
  };

  // reset input
  const reset_input = () => {
    setComplainant({
      _id: "",
      caseno: "",
      nameofcomp: "",
      imageofcomp: "",
      genderofcomp: "",
      addressofcomp: "",
      phoneofcomp: "",
      imageofresp: "",
      nameofresp: "",
      genderofresp: "",
      addressofresp: "",
      phoneofresp: "",
    });
    setSelectedFile("");
    setSelectedFile2("");
    setInsave("");
    setPrevimg_comp("");
    setPrevimg_resp("");
  };

  const [insave, setInsave] = useState("");

  //instructions
  const onCountReceived = async (param) => {
    // console.log(param);
    setParam(param);
    if (param == "ADD") {
      reset_input();
      setCommandAction(true);
    } else if (param == "CANCEL") {
      if (insave === "Edit") {
        setCommandAction(false);
        setPrevimg_comp("");
      } else {
        reset_input();
        setCommandAction(false);
      }
    } else if (param == "REFRESH") {
      reset_input();
      setCommandAction(false);
    } else if (param == "SAVED") {
      handle_saved();
    } else if (param == "EDIT") {
      setInsave("Edit");
      setCommandAction(true);
    }
  };

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes ex datain is changing

    //setting datain datas
    const data_table = datain[0];

    if (data_table) {
      setComplainant({
        ...complainant,
        _id: data_table._id,
        caseno: data_table.caseno,
        nameofcomp: data_table.nameofcomp,
        genderofcomp: data_table.genderofcomp,
        addressofcomp: data_table.addressofcomp,
        phoneofcomp: data_table.phoneofcomp,
        imageofcomp: data_table.imageofcomp,
        nameofresp: data_table.nameofresp,
        genderofresp: data_table.genderofresp,
        addressofresp: data_table.addressofresp,
        phoneofresp: data_table.phoneofresp,
        imageofresp: data_table.imageofresp,
      });
    }
    // console.log(data_table);
    //ustate using form ustate
  }, [datain]);

  //bridge data incoming to lupon page
  props.PassdataCreator(Datareceived);
  props.receiverCreator(onCountReceived);

  const handle_saved = async () => {
    const formData = new FormData();

    formData.append("_id", complainant._id);
    formData.append("file", selectedFile);
    formData.append("file2", selectedFile2);

    formData.append("caseno", complainant.caseno);
    formData.append("nameofcomp", complainant.nameofcomp);
    formData.append("genderofcomp", complainant.genderofcomp);
    formData.append("addressofcomp", complainant.addressofcomp);
    formData.append("phoneofcomp", complainant.phoneofcomp);

    formData.append("nameofresp", complainant.nameofresp);
    formData.append("genderofresp", complainant.genderofresp);
    formData.append("addressofresp", complainant.addressofresp);
    formData.append("phoneofresp", complainant.phoneofresp);
    formData.append("Createdby", user);
    formData.append("Modifiedby", user);

    if (insave == "Edit") {
      try {
        const val = validate();
        if (val) throw val;

        const result = await sendRequest("/u/record", "POST", formData);
        //need throw err to access catch

        if (result.error) throw result.error;
        toast.success("Successfully Updated Record");
        setCommandAction(false);
        await props.onReload(true);
        setInsave("");
        setPrevimg_comp("");
        setPrevimg_resp("");
      } catch (err) {
        return toast.error(err);
      }
    } else {
      try {
        const val = validate();
        if (val) throw val;

        const result = await sendRequest("/create/record", "POST", formData);
        if (result.error) throw result.error;
        toast.success(result.success);
        reset_input();
        setCommandAction(false);
        props.onReload(true);
        props.onCaseshow(true);
      } catch (err) {
        console.log(err);
        return toast.error(err);
      }
    }
  };

  return (
    <div className="container-fluid ">
      <div className="row ">
        {/* complinant */}
        <div className=" col-lg-6 ">
          <div className="row mb-1 text-muted ">
            <h1>Complainant</h1>
          </div>

          <div className="row  justify-content-around ">
            {/* img */}
            <div className="col-sm-6 col-lg-6 col-xl-5  ">
              <div className=" card ">
                <img
                  className="card-img-top "
                  src={
                    previmg_comp
                      ? previmg_comp
                      : `/img/${
                          !complainant.imageofcomp
                            ? "default.jpg"
                            : complainant.imageofcomp
                        }`
                  }
                  alt="Card image"
                  height="150"
                  style={{
                    maxWidth: "100%",
                    height: "260px",
                    objectFit: "fill",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "260px",
                  }}
                >
                  <input
                    disabled={!commandAction ? "disabled" : ""}
                    className="input-file"
                    type="file"
                    name="file"
                    onChange={changeHandler}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FF2222",
                    }}
                  />
                  <motion.label
                    animate={{
                      opacity: commandAction
                        ? complainant.imageofcomp
                          ? "0.5"
                          : selectedFile
                          ? "0.5"
                          : "1"
                        : "0",
                      pointerEvents: commandAction ? "none" : "auto",
                    }}
                    transition={{
                      duration: 1,
                    }}
                    tabIndex="0"
                    For="my-file"
                    style={{
                      textAlign: "center",
                      backgroundColor: "#E6E6E6",
                      height: "100%",
                    }}
                  >
                    <p className="mt-5">
                      Only accept file extenion are jpg,png,jpeg,bmp, you can
                      drag and drop your file here or
                    </p>
                    {!selectedFile
                      ? !complainant.imageofcomp
                        ? "Please select image"
                        : complainant.imageofcomp
                      : selectedFile.name}
                  </motion.label>
                </div>
              </div>
            </div>
            {/* inputs */}
            <div className="col-sm-6 col-lg-6 col-xl-6 ">
              <div className="row">
                <div className="col-12">
                  <TextField
                    variant="standard"
                    type="text"
                    className="form-control"
                    label="Case No"
                    name="Name"
                    placeholder="Name"
                    style={
                      !commandAction ? { display: "none" } : { display: "" }
                    }
                    value={complainant.caseno}
                    onChange={(e) =>
                      setComplainant({
                        ...complainant,
                        caseno: e.target.value,
                      })
                    }
                    error={
                      commandAction
                        ? !complainant.caseno
                          ? true
                          : false
                        : false
                    }
                    autoComplete="off"
                    disabled={!commandAction ? "disabled" : ""}
                  />
                  <TextField
                    variant="standard"
                    type="text"
                    className={
                      commandAction ? "form-control my-1" : "form-control my-2"
                    }
                    label="Name of complainant"
                    name="Name"
                    placeholder="Name"
                    value={complainant.nameofcomp}
                    onChange={(e) =>
                      setComplainant({
                        ...complainant,
                        nameofcomp: e.target.value,
                      })
                    }
                    error={
                      commandAction
                        ? !complainant.nameofcomp
                          ? true
                          : false
                        : false
                    }
                    autoComplete="off"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                  />
                  <FormControl
                    fullWidth
                    variant="standard"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                    error={
                      commandAction
                        ? !complainant.genderofcomp
                          ? true
                          : false
                        : false
                    }
                  >
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={complainant.genderofcomp}
                      label="Gender"
                      onChange={(e) =>
                        setComplainant({
                          ...complainant,
                          genderofcomp: e.target.value,
                        })
                      }
                      style={
                        commandAction
                          ? { pointerEvents: "auto", opacity: "1" }
                          : { pointerEvents: "none", opacity: "1" }
                      }
                    >
                      <MenuItem
                        value={
                          !complainant.genderofcomp
                            ? "Female"
                            : complainant.genderofcomp !== "Female"
                            ? "Female"
                            : complainant.genderofcomp
                        }
                      >
                        Female
                      </MenuItem>
                      <MenuItem value={"Male"}>Male</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    variant="standard"
                    type="text"
                    className={
                      commandAction ? "form-control my-1" : "form-control my-2"
                    }
                    label="Address"
                    name="Address"
                    placeholder="Address"
                    multiline
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    value={complainant.addressofcomp}
                    onChange={(e) =>
                      setComplainant({
                        ...complainant,
                        addressofcomp: e.target.value,
                      })
                    }
                    error={
                      commandAction
                        ? !complainant.addressofcomp
                          ? true
                          : false
                        : false
                    }
                    autoComplete="off"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                  />
                  <TextField
                    variant="standard"
                    type="number"
                    className={
                      commandAction ? "form-control my-1" : "form-control my-2"
                    }
                    label="Phone Number"
                    name="Number"
                    placeholder="Number"
                    value={complainant.phoneofcomp}
                    onChange={(e) =>
                      setComplainant({
                        ...complainant,
                        phoneofcomp: e.target.value,
                      })
                    }
                    autoComplete="off"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Respondent */}
        <div className=" col-lg-6 ">
          <div className="row mb-1 text-muted ">
            <h1>Respondent</h1>
          </div>

          <div className="row justify-content-around">
            {/* img */}
            <div className="col-sm-6 col-lg-6 col-xl-5 ">
              <div className="card ">
                <img
                  className="card-img-top "
                  src={
                    previmg_resp
                      ? previmg_resp
                      : `/img/${
                          !complainant.imageofresp
                            ? "default.jpg"
                            : complainant.imageofresp
                        }`
                  }
                  alt="Card image"
                  height="150"
                  style={{ maxWidth: "100%", height: "260px" }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "260px",
                  }}
                >
                  <input
                    disabled={!commandAction ? "disabled" : ""}
                    className="input-file"
                    type="file"
                    name="file"
                    onChange={changeHandler2}
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FF2222",
                    }}
                  />
                  <motion.label
                    animate={{
                      opacity: commandAction
                        ? complainant.imageofresp
                          ? "0.5"
                          : selectedFile2
                          ? "0.5"
                          : "1"
                        : "0",
                      pointerEvents: commandAction ? "none" : "auto",
                    }}
                    transition={{
                      duration: 1,
                    }}
                    tabIndex="0"
                    For="my-file"
                    style={{
                      textAlign: "center",
                      backgroundColor: "#E6E6E6",
                      height: "100%",
                    }}
                  >
                    <p className="mt-5">
                      Only accept file extenion are jpg,png,jpeg,bmp, you can
                      drag and drop your file here or
                    </p>
                    {!selectedFile2
                      ? !complainant.imageofresp
                        ? "Please select image"
                        : complainant.imageofresp
                      : selectedFile2.name}
                  </motion.label>
                </div>
              </div>
            </div>
            {/* inputs */}
            <div className="col-sm-6 col-lg-6 col-xl-6">
              <div className="row">
                <div className="col-12 text-end">
                  <TextField
                    variant="standard"
                    type="text"
                    className="form-control my-2 "
                    label="Name of respondent"
                    value={complainant.nameofresp}
                    onChange={(e) =>
                      setComplainant({
                        ...complainant,
                        nameofresp: e.target.value,
                      })
                    }
                    error={
                      commandAction
                        ? !complainant.nameofresp
                          ? true
                          : false
                        : false
                    }
                    autoComplete="off"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                  />
                  <FormControl
                    fullWidth
                    className="text-start"
                    variant="standard"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                    error={
                      commandAction
                        ? !complainant.genderofresp
                          ? true
                          : false
                        : false
                    }
                  >
                    <InputLabel id="demo-simple-select-label">
                      Gender
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={complainant.genderofresp}
                      label="Gender"
                      onChange={(e) =>
                        setComplainant({
                          ...complainant,
                          genderofresp: e.target.value,
                        })
                      }
                      style={
                        commandAction
                          ? { pointerEvents: "auto", opacity: "1" }
                          : { pointerEvents: "none", opacity: "1" }
                      }
                    >
                      <MenuItem
                        value={
                          !complainant.genderofresp
                            ? "Female"
                            : complainant.genderofresp !== "Female"
                            ? "Female"
                            : complainant.genderofresp
                        }
                      >
                        Female
                      </MenuItem>
                      <MenuItem value={"Male"}>Male</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    variant="standard"
                    type="text"
                    className="form-control my-2"
                    label="Address"
                    multiline
                    value={complainant.addressofresp}
                    onChange={(e) =>
                      setComplainant({
                        ...complainant,
                        addressofresp: e.target.value,
                      })
                    }
                    error={
                      commandAction
                        ? !complainant.addressofresp
                          ? true
                          : false
                        : false
                    }
                    autoComplete="off"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                  />
                  <TextField
                    variant="standard"
                    type="number"
                    className="form-control my-2"
                    label="Phone Number"
                    value={complainant.phoneofresp}
                    onChange={(e) =>
                      setComplainant({
                        ...complainant,
                        phoneofresp: e.target.value,
                      })
                    }
                    autoComplete="off"
                    style={
                      commandAction
                        ? { pointerEvents: "auto", opacity: "1" }
                        : { pointerEvents: "none", opacity: "1" }
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default lup_case;

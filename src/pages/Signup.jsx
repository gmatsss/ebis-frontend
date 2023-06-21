import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

//design
import {
  TextField,
  FormHelperText,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
//go to mui components then material icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle ";
import CancelIcon from "@mui/icons-material/Cancel";

//api functions
import { register } from "../api/user";
import { useFetch as uselocation } from "../api/location";
import Select from "react-select";

const Signup = () => {
  //usehistory hook to redirect user to login after successful login
  const history = useHistory();

  //form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //validations
  let hasSixChar = password.length >= 6;
  /*
  let hasLowerChar = /(.*[a-z].*).test(password);
  */

  //handler when button click and callings api
  const handler_reg = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      email: email,
      password: password,
      region: selectedValue.barangay.region,
      province: selectedValue.barangay.province,
      city: selectedValue.barangay.city,
      district: selectedValue.barangay.district,
      barangay: selectedValue.barangay.value,
    };
    try {
      const res = await register(user);
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.message);
        //using usehistory react-router-dom it will be redirected to login
        history.replace("/login");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  //location state
  const { sendRequest: sendlocation } = uselocation();
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

  //location functions

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

  return (
    <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5 ">
      <div className="text-center mb-5 alert alert-primary">
        <label htmlFor="" className="h2">
          Signup
        </label>
      </div>

      <div
        className=" d-flex flex-column justify-content-evenly "
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

      <div className="form-group">
        <TextField
          className="form-control"
          id="outlined-basic"
          label="Username"
          variant="outlined"
          value={username}
          //use for usestate every event of react
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group mt-3">
        <TextField
          className="form-control"
          id="outlined-basic"
          label="Email Address"
          variant="outlined"
          value={email}
          //use for usestate every event of react
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group mt-3">
        <FormControl className="form-control" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            value={password}
            //use for usestate every event of react changing input user or interacting to page
            onChange={(e) => setPassword(e.target.value)}
            id="outlined-adornment-password"
            //to show text
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment>
                <IconButton
                  edsge="end"
                  //logic to show password
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        {password && (
          <div className="ml-1">
            <div>
              {
                //parameter validation of 6character
                hasSixChar ? (
                  <span className="text-success">
                    <small>Ok 6 character</small>
                  </span>
                ) : (
                  <span className="text-danger">
                    <CancelIcon className="mr-1" fontSize="small" />
                    <small>At least 6 character</small>
                  </span>
                )
              }
            </div>
          </div>
        )}
      </div>

      <div className="form-group mt-3">
        <FormControl className="form-control" variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            value={confirmpassword}
            //use for usestate every event of react
            onChange={(e) => setConfirmPassword(e.target.value)}
            id="outlined-adornment-password"
            //to show text
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment>
                <IconButton
                  edsge="end"
                  //logic to show password
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
        {password && confirmpassword && (
          //alway {} for logic purposes === to equals
          <FormHelperText>
            {password === confirmpassword ? (
              <span className="text-success">Password match</span>
            ) : (
              <span className="text-danger">Password Does not match</span>
            )}
          </FormHelperText>
        )}
      </div>

      <div className="text-center mt-4">
        <Button
          disabled={
            password !== confirmpassword ||
            !hasSixChar ||
            !confirmpassword ||
            !username ||
            !email ||
            !password ||
            !selectedValue.barangay
          }
          variant="contained"
          onClick={handler_reg}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Signup;

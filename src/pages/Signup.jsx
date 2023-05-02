import React, { useState } from "react";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle ";
import CancelIcon from "@mui/icons-material/Cancel";

//api functions
import { register } from "../api/user";

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
    try {
      const res = await register({ username, email, password });
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

  return (
    <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5 ">
      <div className="text-center mb-5 alert alert-primary">
        <label htmlFor="" className="h2">
          Signup
        </label>
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
                    <CheckCircleIcon className="mr-1" fontSize="small" />
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
            !password
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

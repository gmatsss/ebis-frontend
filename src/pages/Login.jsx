import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Img_bg from "/img/logo_pilipinas.png";

//usercontext
import { UserContext } from "../UserContext";

//design
import {
  TextField,
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

//function api
import { login } from "../api/user";

const Login = () => {
  //usehistory hook to redirect user to login after successful login
  const history = useHistory();

  //states
  const { setUser } = useContext(UserContext);

  //handler to login
  const handler_login = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res.error) toast.error(res.error);
      else {
        toast.success(res.message);
        //user is set using usestate and usercontext
        setUser(res.username);
        //using usehistory react-router-dom it will be redirected to login
        history.push("/");
      }
    } catch (err) {
      toast.error(err);
    }
  };
  //form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="container-fluid p-5 mt-5">
      <div className="row">
        <div className="col-lg-6 col-sm-12" style={{ height: 600 }}>
          <div className="d-flex  justify-content-center">
            <img
              src={Img_bg}
              alt=""
              style={{
                position: "absolute",
                width: 600,
                opacity: "0.2",
                pointerEvents: "none",
              }}
            />
          </div>

          <div className="m-5">
            <h3 style={{ opacity: "0", pointerEvents: "none" }}>E barangay</h3>
          </div>
          <div className="d-flex justify-content-center ">
            <div className="text-center mt-5">
              <h4>Nice to See you again</h4>
              <h1>Welcome back</h1>
              <hr />
              <br />
              <p>E barangay system build in MERN stack</p>
            </div>
          </div>
        </div>
        <div className="col-lg-6  col-sm-12 border-start ">
          <div className="text-center mb-5  mt-5">
            <label htmlFor="" className="h2">
              Login Account
            </label>

            <p className="mt-3">
              For authorized user only. Theft, deletion, or unauthorized access
              to this system's data <br /> are all crimes that are punishable by
              law.
            </p>
          </div>

          <div className="form-group d-flex justify-content-center">
            <TextField
              style={{ width: 400 }}
              className="form-control"
              id="outlined-basic"
              label="Email Address"
              variant="outlined"
              value={email}
              //use for usestate every event of react
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group mt-4 d-flex justify-content-center">
            <div>
              <FormControl className="form-control" variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  style={{ width: 400 }}
                  value={password}
                  //use for usestate every event of react
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
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
          </div>

          <div className="text-center mt-5">
            <Button
              disabled={!email || !password}
              variant="contained"
              onClick={handler_login}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

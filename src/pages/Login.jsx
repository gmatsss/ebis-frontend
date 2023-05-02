import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

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
        history.push("/home");
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
    <div className="container mt-5 mb-5 col-10 col-sm-8 col-md-6 col-lg-5 ">
      <div className="text-center mb-5 alert alert-primary">
        <label htmlFor="" className="h2">
          Login
        </label>
      </div>

      <div className="form-group">
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
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </div>
      <div className="text-center mt-4">
        <Button
          disabled={!email || !password}
          variant="contained"
          onClick={handler_login}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Login;

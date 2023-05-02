import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

//api functions
import { logout } from "../api/user";

const Header = () => {
  //hooks for histor
  const history = useHistory();
  //usestates
  const { user, setUser } = useContext(UserContext);
  //handler
  const Logout_func = (e) => {
    //handler for logut
    e.preventDefault();
    logout()
      .then((res) => {
        toast.success(res.message);
        //set user to null if logout
        setUser(null);
        //redirect back to login
        history.push("/login");
      })
      .catch((err) => console.error(err));
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
      <span className="navbar-brand ms-4">Dashboard</span>

      <div className="collapse navbar-collapse d-flex flex-row-reverse" id="">
        <ul className="navbar-nav ml-auto">
          {
            //conditional rendering
            !user ? (
              <>
                <li className="nav-item ">
                  <Link className="nav-link" to="/signup">
                    Signup
                  </Link>
                </li>
                <li className="nav-item ">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item "></li>
              </>
            ) : (
              <li className="nav-item  d-flex flex-row">
                {/* <span
                  style={{ cursor: "pointer" }}
                  className="nav-link"
                  onClick={Logout_func}
                >
                  Logout
                </span> */}
                {/* <Link style={{ cursor: "pointer" }} className="nav-link" to="/">
                  Home
                </Link> */}
              </li>
            )
          }
        </ul>
      </div>
    </nav>
  );
};

export default Header;

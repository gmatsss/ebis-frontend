import React, { Component } from "react";
import { useState, useEffect, useLayoutEffect } from "react";

//sidebar css
import "./App.css";

//install react-router-dom
import {
  Route,
  Redirect,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";

//user context usestate
import { UserContext } from "./UserContext";

//toastify alert
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//components pages
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import User from "./pages/User";
import Logout from "./pages/Logout";
import citizen_page from "./pages/citizen/citizen_page";
import lupon_page from "./pages/lupon/lupon_page";
import member_list from "./pages/member/member";
import Ckeditor from "./pages/ckeditor/example";
import Report_page from "./pages/report/report_page";
import Location_page from "./pages/location/location_page";
import Print from "./pages/report/report_setup";
import Rpt_lupon from "./rpt_lupon";

import Lupon_v2 from "./pages/lupon_v2/lupon";
import Lupon_v3 from "./pages/lupon_v3/lupon";

//api functions to prevent lossing the user data when refreshing react app
import { getLoggedInUser } from "./api/user";

const App = (props) => {
  const history = useHistory();
  // then add this to the function that is called for re-rendering

  const [user, setUser] = useState(null);

  //preventing lossing the user data
  useEffect(() => {
    const unsubscribe = getLoggedInUser()
      .then((res) => {
        if (res.error) {
          toast(res.error);
          history.push("/login");
        } else setUser(res.username);
      })
      .catch((err) => toast(err));
  }, []);

  const loc = useLocation();

  function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;

    if (isLoggedIn) {
      return (
        <div>
          {loc.pathname === "/report_setup" || loc.pathname === "/rpt_lupon" ? (
            <div>
              <Route exact path="/report_setup" component={Print} />
              <Route exact path="/rpt_lupon" component={Rpt_lupon} />
            </div>
          ) : (
            <div>
              <Header />
              <SideBar>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/user" component={User} />
                  <Route exact path="/logout" component={Logout} />
                  <Route exact path="/citizen_page" component={citizen_page} />
                  <Route exact path="/member_list" component={member_list} />
                  <Route exact path="/lupon_page" component={lupon_page} />
                  <Route exact path="/Lupon_v2" component={Lupon_v2} />
                  <Route exact path="/Lupon_v3" component={Lupon_v3} />
                  <Route exact path="/ckeditor" component={Ckeditor} />
                  <Route exact path="/report" component={Report_page} />
                  <Route exact path="/location" component={Location_page} />
                </Switch>
              </SideBar>
            </div>
          )}
        </div>
      );
    } else {
    }
  }

  function Frontpage() {
    return (
      <div>
        <Header />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
      </div>
    );
  }

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Greeting isLoggedIn={user} />
        {!user && <Frontpage />}
      </UserContext.Provider>
    </div>
  );
};

export default App;

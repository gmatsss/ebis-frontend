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

import Lupon_v2 from "./pages/lupon_v2/lupon";
import Lupon_v3 from "./pages/lupon_v3/lupon";

//api functions to prevent lossing the user data when refreshing react app
import { getLoggedInUser } from "./api/user";

const App = (props) => {
  // then add this to the function that is called for re-rendering

  const [user, setUser] = useState(null);

  //preventing lossing the user data
  useEffect(() => {
    const unsubscribe = getLoggedInUser()
      .then((res) => {
        if (res.error) toast(res.error);
        else setUser(res.username);
        console.log(res.username);
      })
      .catch((err) => toast(err));
  }, []);

  // let location = useLocation();
  // const [loc, setLoc] = useState(null);
  // //...
  // useLayoutEffect(() => {
  //   setLoc(location.pathname);
  // }, [location]);

  // let history = useHistory();

  //userlogin
  function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;

    if (isLoggedIn) {
      return (
        <SideBar>
          <Switch>
            <Route exact path="/" component={Home} />s
            <Route exact path="/user" component={User} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/citizen_page" component={citizen_page} />
            <Route exact path="/member_list" component={member_list} />
            <Route exact path="/lupon_page" component={lupon_page} />
            <Route exact path="/Lupon_v2" component={Lupon_v2} />
            <Route exact path="/Lupon_v3" component={Lupon_v3} />
            <Route exact path="/ckeditor" component={Ckeditor} />
            <Route exact path="/report" component={Report_page} />
          </Switch>
        </SideBar>
      );
    }
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
        <Header />
        <Greeting isLoggedIn={user} />
        <Redirect to={user ? "/" : "login"} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
      </UserContext.Provider>
    </div>
  );
};

export default App;

// return (
//   <div>
//     <Router>
//       <UserContext.Provider
//         value={{
//           //usestate initalization of the user who can access the page
//           user,
//           setUser,
//         }}
//       >
//         <ToastContainer
//           position="top-center"
//           autoClose={1500}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="dark"
//         />
//         <Header />
//         {/* userlogin sidebar */}
//         <Greeting isLoggedIn={user} />
//         {/*
//           using redirect react-router-dom it will
//           redirect to homepage if try to acces it in url
//           */}
//         <Redirect to={user ? "/" : "login"} />
//         <Route exact path="/Signup" component={Signup} />
//         <Route exact path="/Login" component={Login} />
//       </UserContext.Provider>
//     </Router>
//   </div>
// );

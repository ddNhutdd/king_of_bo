import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Login from "../components/Login";

import loginBG from "../assets/img/login_bg.jpg";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage(props) {
  return (
    <div className="login-page">
      <div className="left-area">
        <img src={loginBG} alt="Login" />
      </div>

      <div className="right-area">
        <Header history={props.history} />
        <Login history={props.history} />
        <Footer />

        <div className="toast-container-mys">
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

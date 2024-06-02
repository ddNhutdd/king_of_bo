import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Signup from "../components/Signup";

import signupBG from "../assets/img/login_bg.jpg";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage(props) {
  return (
    <div className="signup-page">
      <div className="left-area">
        <img src={signupBG} alt="Sign up" />
      </div>

      <div className="right-area">
        <Header history={props.history} />
        <Signup history={props.history} match={props.match} />
        <Footer />

        <div className="toast-container-mys">
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

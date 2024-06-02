import "animate.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./assets/scss/style.scss";
import store from "./redux/configStore";
import "./util/language";

// dark theme
import "./assets/theme/dark.css";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
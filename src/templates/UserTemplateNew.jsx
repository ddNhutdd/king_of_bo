import React from "react";
import { Redirect, Route } from "react-router-dom";

import Navbar from "../newComponents/Template/Navbar";
import Sidebar from "../newComponents/Template/Sidebar";

export default function UserTemplateNew(props) {
  const Component = props.component;

  if (!localStorage.getItem("user") || !localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  }

  // desktop
  return (
    <Route
      exact
      path={props.path}
      render={(propsRoute) => {
        return (
          <div className="botrade-user-template">
            <Navbar {...propsRoute} />
            {window.innerWidth <= 992 ? null : <Sidebar {...propsRoute} />}

            <div className="botrade-component">
              <Component {...propsRoute} />
            </div>
          </div>
        );
      }}
    />
  );
}

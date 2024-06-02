import React from "react";
import Trade from "./Trade";
import TradeMobile from "./TradeMobile";

export default function User() {
  if (window.innerWidth <= 992) {
    return <TradeMobile />;
  } else {
    return <Trade />;
  }
}

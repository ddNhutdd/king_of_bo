import React, { useEffect } from "react";
import ChartAdmin from "../components/ChartAdmin";
import socket from "../util/socket";

export default function TradeAdmin({ history }) {
  useEffect(() => {
    socket.emit("joinUser", "1");
  }, []);

  return (
    <div className="trade-admin">
      <ChartAdmin history={history} />
    </div>
  );
}

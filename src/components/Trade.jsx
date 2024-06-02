import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Chart from "../components/Chart";
import HighChart from "../newComponents/Chart/HighChart";
import { axiosService } from "../util/service";
import socket from "../util/socket";

export default function Trade({ history }) {
  window.scrollTo(0, 0);

  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.userReducer);

  const getProfileAPI = async () => {
    try {
      let response = await axiosService.post("api/user/getProfile");
      dispatch({
        type: "UPDATE_USER_BLOCK_TRADE_STATUS",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.emit("joinUser", `${user.id}`);

    socket.on("trade", (res) => {
      getProfileAPI();
    });

    socket.on("double10", (res) => {
      getProfileAPI();
    });
  }, []);

  return (
    <div className="trade-desktop">
      {/* <Chart history={history} /> */}
      <HighChart />
    </div>
  );
}

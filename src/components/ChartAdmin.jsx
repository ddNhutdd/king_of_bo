import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import bitcoin from "../assets/img/bitcoin.png";
import { getChart } from "../redux/actions/getChart";
import { axiosService } from "../util/service.js";
import socket from "../util/socket";
import ChartFooterAdmin from "./ChartFooterAdmin";
import ChartPaneAdmin from "./ChartPaneAdmin";

function ChartAdmin({ history }) {
  const symbol = "BTCUSDT";

  const { userOnline } = useSelector((root) => root.onlineReducer);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getChart(symbol));
    getOrderNow(symbol);

    socket.on(symbol, (res) => {
      if (res) {
        const newRes = {
          ...res,
          timestamp: res.timestamp * 1000,
        };

        dispatch({
          type: "GET_SOCKET",
          payload: newRes,
        });
      }
    });

    socket.on("TIME", (res) => {
      dispatch({
        type: "GET_TIME_SOCKET",
        payload: res,
      });
    });

    socket.emit("joinUser", "1");
    socket.on("orderNow", (res) => {
      dispatch({
        type: "NEW_ORDER",
        payload: res,
      });
    });

    socket.on("checkOnline", (res) => {
      dispatch({
        type: "NUMBER_USERS_ONLINE",
        payload: res,
      });
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [symbol]);

  const getOrderNow = async (symbol) => {
    try {
      let response = await axiosService.post("api/binaryOption/getOrderNow", { symbol });
      dispatch({
        type: "GET_ORDER_NOW",
        orderBuy: response.data.data.orderBuy,
        orderSell: response.data.data.orderSell,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="selection-admin">
        <div className="btc-usdt">
          <img src={bitcoin} alt="Bitcoin" />
          <span>BTC/USD</span>
        </div>

        <div className="user-online">
          <span>
            {t("usersOnline")}: <b>{userOnline}</b>
          </span>
        </div>
      </div>

      <div style={{ marginBottom: window.innerWidth < 576 ? 10 : 30 }}></div>

      <div className="chart">
        <div className="chart-area-admin">
          <ChartPaneAdmin symbol={symbol} history={history} />
          <ChartFooterAdmin symbol={symbol} />
        </div>
      </div>

      <div style={{ marginBottom: window.innerWidth < 576 ? 10 : 30 }}></div>
    </>
  );
}

export default memo(ChartAdmin);

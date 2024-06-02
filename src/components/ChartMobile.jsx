import { dispose, init } from "klinecharts";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import bitcoin from "../assets/img/bitcoin.png";
import { getChart } from "../redux/actions/getChart";
import { chartMobile } from "../util/chartMobile.js";
import socket from "../util/socket";
import ChartFooterMobile from "./ChartFooterMobile";
import ChartPaneMobile from "./ChartPaneMobile";
import { useUpdateEffect } from "usehooks-ts";
import Loader from "./Loader";

let chart;

function ChartMobile() {
  const [isLoading, setIsLoading] = useState(true);

  const [pageVisibility, setPageVisibility] = useState(true);

  const symbol = "BTCUSDT";

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.chartReducer);

  if (data.length !== 0) {
    const newData = data.map((item) => {
      return {
        ...item,
        timestamp: item.timestamp * 1000,
      };
    });

    const lastestTimestamp = newData[newData.length - 1].timestamp;

    chart?.applyNewData(newData);
    chart?.zoomAtTimestamp(10, lastestTimestamp, 0);
    chart?.createTechnicalIndicator("MA", false, { id: "candle_pane" });
    chart?.overrideTechnicalIndicator({
      name: "MA",
      calcParams: [10, 20],
    });
    chart?.setZoomEnabled(false);
    chart?.setScrollEnabled(false);
  }

  useEffect(() => {
    // *************
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    window.addEventListener("resize", () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    });
    // *************

    chart = init("chart", chartMobile);

    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        setPageVisibility(true);
      } else {
        setPageVisibility(false);
      }
    });

    return () => {
      dispose("chart");
    };
  }, []);

  useEffect(() => {
    dispatch(getChart(symbol));

    socket.on(symbol, (res) => {
      if (res) {
        const newRes = {
          ...res,
          timestamp: res.timestamp * 1000,
        };
        chart.updateData(newRes);

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

    return () => {
      socket.removeAllListeners();
    };
  }, [symbol]);

  useUpdateEffect(() => {
    if (pageVisibility) {
      // khi user minimize window hoặc chuyển sang tab khác quay lại thì reload page
      dispose("chart");
      socket.removeAllListeners();
      window.location.reload();
    }
  }, [pageVisibility]);

  return (
    <>
      {isLoading && (
        <div className="wrapper-loader-pola-mobile">
          <Loader />
        </div>
      )}

      <div className="chart-vh-full-mobile" style={isLoading ? { visibility: "hidden" } : { visibility: "visible" }}>
        <div className="selection-mobile">
          <div className="btc-usdt">
            <img src={bitcoin} alt="Bitcoin" />
            <span>BTC/USD</span>
          </div>
        </div>

        <div className="chart-area-mobile">
          <div id="chart"></div>

          <div className="fixed-bottom-zone">
            <ChartFooterMobile symbol={symbol} />
            <ChartPaneMobile symbol={symbol} />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ChartMobile);

import { dispose, init } from "klinecharts";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateEffect } from "usehooks-ts";
import bitcoin from "../assets/img/bitcoin.png";
import { getChart } from "../redux/actions/getChart";
import { chartOption } from "../util/chart.js";
import socket from "../util/socket";
import ChartFooter from "./ChartFooter";
import ChartPane from "./ChartPane";
import DrawerSidePane from "./DrawerSidePane";
import Loader from "./Loader";

let chart;

function Chart() {
  const [isLoading, setIsLoading] = useState(true);

  const [pageVisibility, setPageVisibility] = useState(true);

  const symbol = "BTCUSDT";

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.chartReducer);

  const { isShowSidePane } = useSelector((root) => root.sidepaneReducer);

  if (data.length !== 0) {
    const newData = data.map((item) => {
      return {
        ...item,
        timestamp: item.timestamp * 1000,
      };
    });

    const lastestTimestamp = newData[newData.length - 1].timestamp;

    chart?.applyNewData(newData);
    chart?.zoomAtTimestamp(15, lastestTimestamp, 0);
    chart?.createTechnicalIndicator("MA", false, { id: "candle_pane" });
    chart?.overrideTechnicalIndicator({
      name: "MA",
      calcParams: [10, 20],
    });
    chart?.setZoomEnabled(false);
    chart?.setScrollEnabled(false);
  }

  useEffect(() => {
    chart = init("chart", chartOption);

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

    chart?.resize();

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
  }, [symbol, isShowSidePane]);

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
        <div className="wrapper-loader-pola">
          <Loader />
        </div>
      )}

      <div className="chart" style={isLoading ? { visibility: "hidden" } : { visibility: "visible" }}>
        <div className="selection">
          <div className="btc-usdt">
            <img src={bitcoin} alt="Bitcoin" />
            <span>BTC/USD</span>
          </div>
        </div>

        <div className={`chart-area ${isShowSidePane ? "withSidePane" : ""}`}>
          <div className="fixed-left-zone">
            <div id="chart"></div>
            <ChartFooter symbol={symbol} />
          </div>

          <ChartPane symbol={symbol} />

          <div className={isShowSidePane ? "newSidePane-sp" : "newSidePane-sp hide"}>
            <DrawerSidePane />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Chart);

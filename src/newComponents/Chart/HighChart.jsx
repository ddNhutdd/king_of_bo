import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateEffect } from "usehooks-ts";
import bitcoin from "../../assets/img/svg/btc.png";
import ChartFooter from "../../components/ChartFooter";
import ChartPane from "../../components/ChartPane";
import DrawerSidePane from "../../components/DrawerSidePane";
import Loader from "../../components/Loader";
import { APP_NAME, GREEN, RED, WHITE } from "../../constant/constant";
import { xx, xx2Decimal } from "../../function/numberFormatter";
import { getChart } from "../../redux/actions/getChart";
import socket from "../../util/socket";

// Highcharts
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import indicators from "highcharts/indicators/indicators"; // used for SMA
indicators(Highcharts);

function Chart() {
  const [isLoading, setIsLoading] = useState(true);
  const [pageVisibility, setPageVisibility] = useState(true);

  const symbol = "BTCUSDT";

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.chartReducer);
  const { isShowSidePane } = useSelector((root) => root.sidepaneReducer);
  const { time } = useSelector((root) => root.timeReducer);

  const chartComponentRef = useRef(null);

  let totalCandle = 80;
  if (window.innerWidth <= 1500) totalCandle = 80;
  if (window.innerWidth <= 1300) totalCandle = 70;
  if (window.innerWidth <= 1100) totalCandle = 60;
  // số candle / 2 -> số phút (mỗi phút có 2 nến) -> gắn vô chart option

  const [chartOption, setChartOption] = useState({
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
      text: "© 2023 " + APP_NAME,
      position: {
        align: "left",
        x: 10,
        y: -35,
      },
      href: "",
    },
    chart: {
      animation: true,
      height: null,
      backgroundColor: "transparent",
      spacingRight: 25,
      events: {
        render: function () {
          const chart = this;
          const points = chart.series[0].data;
          const { close, socketTime } = points[points.length - 1] || 0;

          try {
            if (chart.customPlotLine) {
              chart.customPlotLine.options.value = close;
              chart.customPlotLine.label.attr({
                text: `<div class="plotlineChart">
                <span class="price">${xx2Decimal(close)}</span>
                <span class="time">00:${socketTime || "00"}</span>
                </div>`,
              });
              chart.customPlotLine.render();
            } else {
              chart.customPlotLine = chart.yAxis[0].addPlotLine({
                value: close,
                width: 1,
                zIndex: 99,
                label: {
                  text: `<div class="plotlineChart">
                  <span class="price">${xx2Decimal(close)}</span>
                  <span class="time">00:${socketTime || "00"}</span>
                  </div>`,
                  useHTML: true,
                  align: "right",
                  x: 68,
                },
              });
            }
          } catch (error) {
            window.location.reload();
          }
        },
      },
      style: {
        fontFamily: "LucidaGrande",
      },
    },
    series: [
      {
        id: "main-series",
        name: "BinaTrade OHLC",
        type: "candlestick",
        data: [],
        turboThreshold: 0,
        yAxis: 0,
        states: {
          inactive: {
            opacity: 1,
          },
        },
        tooltip: {
          pointFormatter: function () {
            return (
              "<span style='margin-right:20px;font-size:14px;display:inline-block;width:100px'><b>O</b>: " +
              xx(this.open) +
              "</span><span style='font-size:14px;display:inline-block;width:100px'><b>C</b>: " +
              xx(this.close) +
              "</span><br/><span style='margin-right:20px;font-size:14px;display:inline-block;width:100px'><b>H</b>: " +
              xx(this.high) +
              "</span><span style='margin-right:20px;font-size:14px;display:inline-block;width:100px'><b>L</b>: " +
              xx(this.low) +
              "</span><span style='font-size:14px;display:inline-block;width:100px'><b>Vol</b>: " +
              xx(this.vol) +
              "</span>"
            );
          },
        },
      },
      {
        id: "sub-series",
        name: "BinaTrade Volume",
        type: "column",
        data: [],
        linkedTo: "main_series",
        yAxis: 1, // index của mảng yAxis
        threshold: null, // để chart tự tính giá trị min max trên yAxis dựa theo data
        states: {
          inactive: {
            opacity: 1,
          },
        },
        tooltip: {
          pointFormatter: function () {
            return "<span style='font-size:12px'><b>Vol</b>: " + xx(this.y) + "</span>";
          },
        },
      },
    ],
    legend: {
      enabled: false,
    },
    time: {
      useUTC: false,
    },
    xAxis: {
      type: "datetime",
      labels: {
        enabled: true,
        style: {
          color: "grey",
        },
      },
      crosshair: {
        label: {
          enabled: false,
        },
      },
      lineColor: "#262626",
      lineWidth: 1,
      tickLength: 0,
      minPadding: 0,
      maxPadding: 0,
      range: (totalCandle / 2) * 60 * 1000,
    },
    yAxis: [
      {
        labels: {
          enabled: true,
          formatter: function () {
            return xx(this.value);
          },
          style: {
            color: "whitesmoke",
          },
          x: 12,
          y: -1,
        },
        title: {
          text: undefined,
        },
        crosshair: false,
        gridLineDashStyle: "LongDash",
        gridLineColor: "#424242",
        opposite: true,
        lineColor: "#808891",
        lineWidth: 1,
        tickColor: "#424242",
        tickWidth: 1,
        tickLength: 8,
        offset: -10,
        height: "85%",
      },
      {
        labels: {
          enabled: false,
        },
        title: {
          text: undefined,
        },
        gridLineWidth: 0,
        top: "85%",
        height: "15%",
        offset: 0,
        lineColor: "#808891",
        lineWidth: 1,
        opposite: true,
        offset: -10,
        softMin: 0,
        softMax: 200, // https://anotepad.com/note/read/wi9srwgm
      },
    ],
    title: {
      text: undefined,
    },
    tooltip: {
      enabled: true,
      positioner: function () {
        return { x: 30, y: 12 };
      },
      backgroundColor: "#00000025",
      borderWidth: 0,
      borderRadius: 0,
      shadow: false,
      style: {
        color: "#dedede",
        fontSize: "16px",
      },
      headerFormat: "",
      useHTML: true,
    },
    navigator: {
      enabled: true,
      height: 0,
      margin: 0,
    },
  });

  const getColor = (openValue, closeValue) => {
    if (openValue < closeValue) {
      return GREEN;
    } else if (openValue > closeValue) {
      return RED;
    } else {
      return WHITE;
    }
  };

  useEffect(() => {
    if (data.length !== 0) {
      const newData = data.map((item) => {
        return {
          id: item.id,
          x: item.timestamp * 1000,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          color: getColor(item.open, item.close),
          lineColor: getColor(item.open, item.close),
          vol: item.volume,
        };
      });

      const volumeData = data.map((item) => {
        return {
          id: item.id,
          x: item.timestamp * 1000,
          y: item.volume,
          color: getColor(item.open, item.close),
          borderColor: getColor(item.open, item.close),
        };
      });

      setChartOption({
        ...chartOption,
        chart: {
          ...chartOption.chart,
          height: document.getElementById("highchart_container")?.offsetHeight,
        },
        series: [
          {
            ...chartOption.series[0],
            data: newData,
          },
          {
            ...chartOption.series[1],
            data: volumeData,
          },
          {
            type: "sma",
            linkedTo: "main-series",
            params: {
              period: 5,
            },
            color: "#2aa6a7",
            lineWidth: 2,
            marker: {
              enabled: false,
            },
            enableMouseTracking: false,
            states: {
              inactive: {
                opacity: 1,
              },
            },
          },
          {
            type: "sma",
            linkedTo: "main-series",
            params: {
              period: 10,
            },
            color: "#c70e65",
            lineWidth: 2,
            marker: {
              enabled: false,
            },
            enableMouseTracking: false,
            states: {
              inactive: {
                opacity: 1,
              },
            },
          },
        ],
      });
    }
  }, [data]);

  useEffect(() => {
    dispatch(getChart(symbol));

    setTimeout(() => {
      setIsLoading(false);
    }, 750);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        setPageVisibility(true);
      } else {
        setPageVisibility(false);
      }
    });
  }, []);

  useEffect(() => {
    chartComponentRef.current.chart.reflow();

    let socketTime;
    if (time >= 1 && time <= 30) {
      socketTime = 31 - time;
    } else if (time >= 31 && time <= 60) {
      socketTime = 61 - time;
    } else {
      socketTime = 0;
    }

    socket.on(symbol, (res) => {
      if (res) {
        const newRes = {
          socketTime: socketTime <= 9 ? `0${socketTime}` : `${socketTime}`,
          id: res.id,
          x: res.timestamp * 1000,
          open: res.open,
          high: res.high,
          low: res.low,
          close: res.close,
          color: getColor(res.open, res.close),
          lineColor: getColor(res.open, res.close),
          vol: res.volume,
        };

        const thisSeries = chartComponentRef.current.chart.series[0];
        const lastCandle = thisSeries.data[thisSeries.data.length - 1];

        if (lastCandle.id == newRes.id) {
          lastCandle.update(newRes, true);
        } else {
          thisSeries.addPoint(newRes, true, true, true);
        }

        // update column
        const columnRes = {
          id: res.id,
          x: res.timestamp * 1000,
          y: res.volume,
          color: getColor(res.open, res.close),
          borderColor: getColor(res.open, res.close),
        };

        const columnSeries = chartComponentRef.current.chart.series[1];
        const lastColumn = columnSeries.data[columnSeries.data.length - 1];

        if (lastColumn.id == columnRes.id) {
          lastColumn.update(columnRes, false);
        } else {
          columnSeries.addPoint(columnRes, false, true, true);
        }
        // redraw phải set thành false thì mới mượt, ngược lại với ở candlestick
        // end update column

        dispatch({
          type: "GET_SOCKET",
          payload: res,
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
  }, [isShowSidePane, time]);

  useUpdateEffect(() => {
    if (pageVisibility) {
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
          <div className="btc-usdt-new">
            <img src={bitcoin} alt="Bitcoin" />
            <span>BTC/USD</span>
          </div>
        </div>

        <div className={`chart-area ${isShowSidePane ? "withSidePane" : ""}`}>
          <div className="fixed-left-zone">
            <div id="highchart_container">
              <HighchartsReact ref={chartComponentRef} highcharts={Highcharts} options={chartOption} />
            </div>

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

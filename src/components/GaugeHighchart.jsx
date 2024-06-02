import { Tooltip } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import svgQuestion from "../assets/img/svg/question.svg";

import HCMore from "highcharts/highcharts-more"; // Highcharts More module
import HCGauge from "highcharts/modules/solid-gauge"; // Gauge module

HCMore(Highcharts);
HCGauge(Highcharts);

function GaugeHighchart({ gaugeTitle, gaugeDesc, isBigger }) {
  const { t } = useTranslation();

  const [value, setValue] = useState(0);
  const [valueA, setValueA] = useState(Math.round(Math.random() * 50));
  const [valueB, setValueB] = useState(0);
  const [valueC, setValueC] = useState(Math.round(Math.random() * 50));
  // valueA valueB valueC là 3 số ở dưới tương ứng sell, neutral, buy
  // sell và buy random, neutral tính trung bình của sell và buy chứ không random
  // cái này hoàn toàn là số ảo, không có căn cứ

  useEffect(() => {
    const thisIntervalID = setInterval(() => {
      setValueA(Math.round(Math.random() * 50));
      setValueC(Math.round(Math.random() * 50));
    }, 15000);

    return () => {
      clearInterval(thisIntervalID);
    };
  }, []);

  useEffect(() => {
    // tính phần trăm A hay C lớn hơn thì nghiêng về phía đó
    const percentA = valueA / (valueA + valueC);
    setValue(1 - percentA);

    // B lấy trung bình của A và C
    setValueB(Math.round((valueA + valueC) / 2));
  }, [valueA, valueC]);

  let roundColor = "";
  let statusText = "";

  if (value <= 0.2) {
    roundColor = "#ee475d50";
    statusText = "STRONG SELL";
  } else if (value <= 0.4) {
    roundColor = "#f5989650";
    statusText = "SELL";
  } else if (value <= 0.6) {
    roundColor = "#d1d4dc50";
    statusText = "NEUTRAL";
  } else if (value <= 0.8) {
    roundColor = "#8ff0cb50";
    statusText = "BUY";
  } else {
    roundColor = "#27c86a50";
    statusText = "STRONG BUY";
  }

  const THICKNESS = isBigger ? 5 : 4;
  const THICKNESS_MOBILE = isBigger ? 2 : 1;

  const options = {
    chart: {
      type: "gauge",
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      width: 300,
      height: 145,
      backgroundColor: "transparent",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    pane: {
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
          stops: [
            [0, "transparent"],
            [1, roundColor],
          ],
        },
        outerRadius: "96%",
        borderWidth: 0,
        shape: "arc",
      },
      center: ["50%", "85%"],
      size: isBigger ? "160%" : "135%",
    },
    yAxis: {
      min: 0,
      max: 1,
      tickPixelInterval: 0,
      tickPosition: "inside",
      tickColor: "#ffffff",
      tickLength: 0,
      tickWidth: 0,
      labels: {
        enabled: false,
      },
      lineWidth: 0,
      plotBands: [
        {
          from: 0,
          to: 0.195,
          color: "#ee475d",
          thickness: THICKNESS,
          borderRadius: "50%",
          label: {
            useHTML: true,
            text: `<div style="text-align: center">STRONG<br/>SELL</div>`,
            style: {
              color: "grey",
              fontSize: "11px",
            },
            align: "right",
            textAlign: "right",
            x: 0,
          },
        },
        {
          from: 0.2,
          to: 0.395,
          color: "#f59896",
          thickness: THICKNESS,
          borderRadius: "50%",
          label: {
            text: "SELL",
            style: {
              color: "grey",
              fontSize: "11px",
            },
            align: "right",
            textAlign: "right",
            x: 0,
          },
        },
        {
          from: 0.4,
          to: 0.595,
          color: "#d1d4dc",
          thickness: THICKNESS,
          borderRadius: "50%",
          label: {
            text: "NEUTRAL",
            style: {
              color: "grey",
              fontSize: "11px",
            },
            align: "right",
            textAlign: "center",
            x: 0,
            y: 2,
          },
        },
        {
          from: 0.6,
          to: 0.795,
          color: "#8ff0cb",
          thickness: THICKNESS,
          borderRadius: "50%",
          label: {
            text: "BUY",
            style: {
              color: "grey",
              fontSize: "11px",
            },
            align: "left",
            textAlign: "left",
            x: 0,
          },
        },
        {
          from: 0.8,
          to: 1,
          color: "#27c86a",
          thickness: THICKNESS,
          borderRadius: "50%",
          label: {
            useHTML: true,
            text: `<div style="text-align: center">STRONG<br/>BUY</div>`,
            style: {
              color: "grey",
              fontSize: "11px",
            },
            align: "left",
            textAlign: "left",
            x: 0,
          },
        },
      ],
    },
    series: [
      {
        name: gaugeTitle,
        data: [value],
        dataLabels: {
          enabled: false,
        },
        dial: {
          radius: "80%",
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
            stops: [
              [0, "#000"],
              [1, "#d4d4d4"],
            ],
          },
          baseWidth: 6,
          baseLength: "0%",
          rearLength: "0%",
          topWidth: 4,
        },
        pivot: {
          radius: 0,
        },
      },
    ],
    tooltip: { enabled: false },
  };

  const optionsMobile = {
    chart: {
      type: "gauge",
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      width: 110,
      height: 110,
      backgroundColor: "transparent",
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    pane: {
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: {
          linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
          stops: [
            [0, "transparent"],
            [1, roundColor],
          ],
        },
        outerRadius: "96%",
        borderWidth: 0,
        shape: "arc",
      },
      center: ["50%", "70%"],
      size: isBigger ? "110%" : "90%",
    },
    yAxis: {
      min: 0,
      max: 1,
      tickPixelInterval: 0,
      tickPosition: "inside",
      tickColor: "#ffffff",
      tickLength: 0,
      tickWidth: 0,
      labels: {
        enabled: false,
      },
      lineWidth: 0,
      plotBands: [
        {
          from: 0,
          to: 0.195,
          color: "#ee475d",
          thickness: THICKNESS_MOBILE,
          borderRadius: "50%",
        },
        {
          from: 0.2,
          to: 0.395,
          color: "#f59896",
          thickness: THICKNESS_MOBILE,
          borderRadius: "50%",
        },
        {
          from: 0.4,
          to: 0.595,
          color: "#d1d4dc",
          thickness: THICKNESS_MOBILE,
          borderRadius: "50%",
        },
        {
          from: 0.6,
          to: 0.795,
          color: "#8ff0cb",
          thickness: THICKNESS_MOBILE,
          borderRadius: "50%",
        },
        {
          from: 0.8,
          to: 1,
          color: "#27c86a",
          thickness: THICKNESS_MOBILE,
          borderRadius: "50%",
        },
      ],
    },
    series: [
      {
        name: gaugeTitle,
        data: [value],
        dataLabels: {
          enabled: false,
        },
        dial: {
          radius: "80%",
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
            stops: [
              [0, "#000"],
              [1, "#d4d4d4"],
            ],
          },
          baseWidth: 5,
          baseLength: "0%",
          rearLength: "0%",
          topWidth: 3,
        },
        pivot: {
          radius: 0,
        },
      },
    ],
    tooltip: { enabled: false },
  };

  return (
    <div className="gauge-wrapper-div">
      <div
        className={`gauge-title ${!isBigger ? "smaller" : ""}`}
        style={!isBigger && window.innerWidth > 992 ? { transform: "translateY(15px)" } : {}}
      >
        <Tooltip title={gaugeDesc}>
          {gaugeTitle}
          <img src={svgQuestion} alt="question" />
        </Tooltip>
      </div>

      <div className="gauge-main">
        <HighchartsReact highcharts={Highcharts} options={window.innerWidth <= 992 ? optionsMobile : options} />
        <div className="statuss">
          <span className="statusText">{statusText}</span>

          {window.innerWidth <= 992 ? null : (
            <div className="statusList">
              <div className="item sell">
                <b>{valueA}</b>
                <p>Sell</p>
              </div>
              <div className="item neutral">
                <b>{valueB}</b>
                <p>Neutral</p>
              </div>
              <div className="item buy">
                <b>{valueC}</b>
                <p>Buy</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(GaugeHighchart);

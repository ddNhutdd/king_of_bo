import { Tooltip } from "antd";
import React, { memo, useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { useTranslation } from "react-i18next";
import svgQuestion from "../assets/img/svg/question.svg";
import svgNeedle from "../assets/img/svg/needle.svg";

function Gauge({ gaugeID, gaugeTitle, gaugeDesc, isBigger }) {
  const { t, i18n } = useTranslation();

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

  let myClassName = "";
  let neddleColor = "";
  let statusText = "";

  if (value <= 0.2) {
    myClassName = "red-dark";
    neddleColor = "#ee475d";
    statusText = t("STRONG SELL");
  } else if (value <= 0.4) {
    myClassName = "red-light";
    neddleColor = "#f59896";
    statusText = t("SELL");
  } else if (value <= 0.6) {
    myClassName = "white";
    neddleColor = "#d1d4dc";
    statusText = t("NEUTRAL");
  } else if (value <= 0.8) {
    myClassName = "green-light";
    neddleColor = "#8ff0cb";
    statusText = t("BUY");
  } else {
    myClassName = "green-dark";
    neddleColor = "#27c86a";
    statusText = t("STRONG BUY");
  }

  const calcMargin = () => {
    let m = 0;
    if (window.innerWidth > 1376) {
      if (isBigger) m = 0.08;
      else m = 0.1;
    } else if (window.innerWidth > 992) {
      m = 0.1;
    } else {
      m = 0.15;
    }
    return m;
  };

  return (
    <div className="gauge-wrapper-div">
      <div className="gauge-title">
        <Tooltip title={gaugeDesc}>
          {gaugeTitle}
          <img src={svgQuestion} alt="question" />
        </Tooltip>
      </div>

      <div className={isBigger ? "gauge-main bigger" : "gauge-main"}>
        <GaugeChart
          id={gaugeID}
          className={myClassName}
          nrOfLevels={5}
          colors={["#ee475d", "#f59896", "#d1d4dc", "#8ff0cb", "#27c86a"]}
          percent={value}
          arcWidth={0.04}
          arcPadding={0.01}
          hideText
          marginInPercent={calcMargin()}
          needleColor={neddleColor}
          needleBaseColor={neddleColor}
          animDelay={0}
          animateDuration={1000}
          cornerRadius={0}
          needleScale={0.65}
          customNeedleComponent={<img src={svgNeedle} />}
          customNeedleComponentClassName="customNeedle"
        />

        {i18n.language == "en" ? (
          <div className="lb-ss">
            {t("STRONG")}
            <br />
            {t("SELL")}
          </div>
        ) : (
          <div className="lb-ss">
            {t("SELL")}
            <br />
            {t("STRONG")}
          </div>
        )}
        <div className="lb-s">{t("SELL")}</div>
        <div className="lb-n">{t("NEUTRAL")}</div>
        <div className="lb-b">{t("BUY")}</div>
        {i18n.language == "en" ? (
          <div className="lb-sb">
            {t("STRONG")}
            <br />
            {t("BUY")}
          </div>
        ) : (
          <div className="lb-sb">
            {t("BUY")}
            <br />
            {t("STRONG")}
          </div>
        )}

        <div className="statuss">
          <span className="statusText">{statusText}</span>

          {window.innerWidth <= 992 ? null : (
            <div className="statusList">
              <div className="item sell">
                <b>{valueA}</b>
                <p>{t("SELL")}</p>
              </div>
              <div className="item neutral">
                <b>{valueB}</b>
                <p>{t("NEUTRAL")}</p>
              </div>
              <div className="item buy">
                <b>{valueC}</b>
                <p>{t("BUY")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Gauge);

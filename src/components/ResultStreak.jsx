import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import streakGold from "../assets/img/streak-gold.png";

export default function ResultStreak({ type }) {
  const { t } = useTranslation();
  const { prizePoolValue } = useSelector((root) => root.prizeReducer);
  const h = useHistory();

  if (!type) return <></>;
  else if (type == "win") {
    return (
      <div className="result-streak result-true">
        <img src={streakGold} alt="" />
        <h1>{t("streak-congrats")}</h1>
        <h3>{t("streak-congrats-content1")}</h3>
        <p>{prizePoolValue * 0.001} USDT</p>
        <span className="span-note">
          <span>{t("streak-congrats-content2")}:</span> <span>{t("streak-congrats-content3")}</span>
        </span>
        <Button type="primary" size="large" style={{ width: 250 }} onClick={() => h.push("/user/streak-challenge")}>
          {t("streak-congrats-content4")}
        </Button>
      </div>
    );
  } else if (type == "lose") {
    return (
      <div className="result-streak result-true">
        <img src={streakGold} alt="" />
        <h1>{t("streak-congrats")}</h1>
        <h3>{t("streak-congrats-content11")}</h3>
        <p>{prizePoolValue * 0.001} USDT</p>
        <span className="span-note">
          <span>{t("streak-congrats-content2")}:</span> <span>{t("streak-congrats-content3")}</span>
        </span>
        <Button type="primary" size="large" style={{ width: 250 }} onClick={() => h.push("/user/streak-challenge")}>
          {t("streak-congrats-content4")}
        </Button>
      </div>
    );
  }
}

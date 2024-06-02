import React from "react";
import { useTranslation } from "react-i18next";
import { xx } from "../function/numberFormatter";

export default function ResultBorder({ type, data }) {
  const { t } = useTranslation();

  if (!type) return <></>;
  else if (type == "win") {
    return (
      <div className="result result-true">
        <h1>{t("win-congrats")}</h1>
        <p>+${xx(Math.abs(data))}</p>
      </div>
    );
  } else if (type == "lose") {
    return (
      <div className="result result-false">
        <h1>{t("lose-sorry")}</h1>
        <p>-${xx(Math.abs(data))}</p>
      </div>
    );
  }
}

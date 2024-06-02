import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getTheme } from "../function/getTheme";
import { showAlert } from "../function/showAlert";
import { axiosService } from "../util/service";

export default function ChartPaneAdmin({ symbol }) {
  const isDarkTheme = getTheme();

  const { t } = useTranslation();

  const [currentOrderStatus, setCurrentOrderStatus] = useState(false);
  const [counter, setCounter] = useState(0);

  const [buyButton, setBuyButton] = useState(true);
  const [sellButton, setSellButton] = useState(true);

  const { res } = useSelector((root) => root.resReducer);
  const { time } = useSelector((root) => root.timeReducer);

  useEffect(() => {
    if (time >= 1 && time <= 30) {
      // [1-30]: order
      setCounter(31 - time);
      setCurrentOrderStatus(true);
    } else {
      // [31-60]: wait
      setCounter(61 - time);
      setCurrentOrderStatus(false);
    }
  }, [time]);

  useEffect(() => {
    if (currentOrderStatus == true) {
      // order
      setBuyButton(false);
      setSellButton(false);
    } else {
      // wait
      setBuyButton(true);
      setSellButton(true);
    }
  }, [currentOrderStatus]);

  const handleBuy = () => {
    setBuyButton(false);
    setSellButton(true);
    setChart(symbol, "buy");
  };

  const handleSell = () => {
    setSellButton(false);
    setBuyButton(true);
    setChart(symbol, "sell");
  };

  const setChart = async (symbol, type) => {
    try {
      let response = await axiosService.post("api/binaryOption/setChart", {
        symbol,
        type,
      });
      showAlert("success", response.data.message);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  return (
    <div className="chartpane-admin">
      {res.symbol ? (
        <>
          <div className={buyButton ? "buy box admin " : "buy box admin disable"} onClick={handleBuy}>
            <span style={{ textTransform: "uppercase" }}>{t("buy")}</span>
          </div>

          <div className={`${currentOrderStatus ? "order box green" : "order box red"} ${isDarkTheme ? " dark" : ""}`}>
            <span>{currentOrderStatus ? t("order") : t("wait")}</span>
            <span>{counter}s</span>
          </div>

          <div className={sellButton ? "sell box admin" : "sell box admin disable"} onClick={handleSell}>
            <span style={{ textTransform: "uppercase" }}>{t("sell")}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}

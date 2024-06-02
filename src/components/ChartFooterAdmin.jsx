import { Button, Empty } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getTheme } from "../function/getTheme";
import { showToast } from "../function/showToast";
import { axiosService } from "../util/service";
import { localeFixed, xx } from "../function/numberFormatter";

export default function ChartFooterAdmin({ symbol }) {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();
  const { arrayOrderBuy, arrayOrderSell } = useSelector((root) => root.orderReducer);
  const { time } = useSelector((root) => root.timeReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    if (time === 1) {
      // khi chuyển sang order thì clear order cũ
      dispatch({
        type: "CLEAR_ORDER",
      });
    }
  }, [time]);

  const calculateOrderBuy = () => {
    let x = 0;
    arrayOrderBuy.map((item) => {
      if (item.symbol === symbol) {
        x += item.amount;
      }
    });
    return x;
  };

  const calculateOrderSell = () => {
    let x = 0;
    arrayOrderSell.map((item) => {
      if (item.symbol === symbol) {
        x += item.amount;
      }
    });
    return x;
  };

  const doubleOrder = async (idOrder) => {
    try {
      let response = await axiosService.post("api/binaryOption/doubleOrder", { idOrder });
      showToast("success", response.data.message);
      getOrderNow(symbol);
    } catch (error) {
      console.log(error);
      showToast("error", error.response.data.message);
    }
  };

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
    <div className="chart-footer-admin">
      <div className="box box-buy">
        <div className="sta">
          <span className="buy-title">{t("orderBuy")}</span>
          <p style={{ textTransform: "uppercase", marginBottom: 0 }}>
            {t("total")}: <span className="buy-content">{xx(calculateOrderBuy())}</span>
          </p>
        </div>

        {arrayOrderBuy.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("nodata")} />
        ) : (
          <div className="stb">
            {arrayOrderBuy.map((item, index) => {
              if (item.symbol === symbol) {
                return (
                  <div key={index} className="item-box">
                    <span>{item.userName || item.username}</span>
                    <span>{localeFixed(item.balance, 2, ",")}</span>
                    <span>
                      <b style={{ fontSize: 18 }}>{item.amount}</b>
                      <Button
                        type={isDarkTheme ? "primary" : "default"}
                        size="small"
                        style={{ marginLeft: 20 }}
                        onClick={() => doubleOrder(item.id)}
                      >
                        x10
                      </Button>
                    </span>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      <div className="box box-sell">
        <div className="sta">
          <span className="sell-title">{t("orderSell")}</span>
          <p style={{ textTransform: "uppercase", marginBottom: 0 }}>
            {t("total")}: <span className="sell-content">{xx(calculateOrderSell())}</span>
          </p>
        </div>

        {arrayOrderSell.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("nodata")} />
        ) : (
          <div className="stb">
            {arrayOrderSell.map((item, index) => {
              if (item.symbol === symbol) {
                return (
                  <div key={index} className="item-box">
                    <span>{item.userName || item.username}</span>
                    <span>{localeFixed(item.balance, 2, ",")}</span>
                    <span>
                      <b style={{ fontSize: 18 }}>{item.amount}</b>
                      <Button
                        type={isDarkTheme ? "primary" : "default"}
                        size="small"
                        style={{ marginLeft: 20 }}
                        onClick={() => doubleOrder(item.id)}
                      >
                        x10
                      </Button>
                    </span>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}

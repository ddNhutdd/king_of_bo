import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import logoUSDT from "../assets/img/usdt.png";
import { localeFixedDown } from "../function/numberFormatter";
import Deposit from "./Deposit";
import WithdrawWrap from "./WithdrawWrap";

export default function UserWallet() {
  const { currentBalance, user } = useSelector((root) => root.userReducer);
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isShowWallet } = useSelector((root) => root.historyReducer);

  const [defaultKey, setDefaultKey] = useState("deposit");

  const toggleShow = () => {
    dispatch({
      type: "TOGGLE_SHOW_USER_WALLET",
    });
  };

  const onTabChange = (activeKey) => {
    if (activeKey == "deposit") {
      history.push("/user/deposit");
    } else if (activeKey == "withdraw-transfer") {
      history.push("/user/transfer");
      // vì transfer đang nằm trước trên giao diện nên vào transfer trước
    }
  };

  const getDefaultKey = () => {
    if (history.location.pathname == "/user/deposit") {
      setDefaultKey("deposit");
    } else if (history.location.pathname == "/user/withdraw") {
      setDefaultKey("withdraw-transfer");
    } else if (history.location.pathname == "/user/transfer") {
      setDefaultKey("withdraw-transfer");
    } else {
      setDefaultKey("deposit");
    }
  };

  useEffect(() => {
    getDefaultKey();
  }, [location]);

  return (
    <div className="user-wallet">
      <div className="main-wallet-illus">
        <div className="left">
          <h2 className="title">{t("walletTotal")}</h2>
          {isShowWallet ? (
            <div className="sodu-cohinh">
              <p>
                {currentBalance === "live"
                  ? localeFixedDown(user?.balance, 2, ",")
                  : localeFixedDown(user?.demoBalance, 2, ",")}
              </p>
              <img src={logoUSDT} alt="" />
            </div>
          ) : (
            <p>*********</p>
          )}
        </div>

        <div className="right">
          {isShowWallet ? (
            <div onClick={toggleShow}>
              <i className="fa-regular fa-eye-slash"></i>
              <span>{t("hide")}</span>
            </div>
          ) : (
            <div onClick={toggleShow}>
              <i className="fa-regular fa-eye"></i>
              <span>{t("show")}</span>
            </div>
          )}
        </div>
      </div>

      <div className="tabs">
        <Tabs size="large" onChange={onTabChange} activeKey={defaultKey} centered destroyInactiveTabPane>
          <Tabs.TabPane tab={t("deposit")} key="deposit">
            <Deposit />
          </Tabs.TabPane>

          <Tabs.TabPane tab={t("withdraw")} key="withdraw-transfer">
            <WithdrawWrap />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
}

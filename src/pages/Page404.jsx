import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import logo from "../assets/img/logo/logoImgTextHorizontal.png";
import { APP_NAME } from "../constant/constant";

export default function Page404() {
  const history = useHistory();
  const { t } = useTranslation();

  const isLoggedIn = localStorage.getItem("token") && localStorage.getItem("user");

  return (
    <div className="page-404">
      <div className="p404-navbar">
        <div className="container">
          <div className="left logo">
            <img src={logo} alt={APP_NAME} onClick={() => history.replace("/")} />
          </div>

          {isLoggedIn ? (
            <></>
          ) : (
            <div className="right actions">
              <Button type="primary" size="large" onClick={() => history.replace("/login")}>
                {t("login")}
              </Button>
              {window.innerWidth < 375 ? null : (
                <Button size="large" onClick={() => history.replace("/signup")}>
                  {t("signup")}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p404-content">
        <div className="container">
          <h1 className="title">{t("p404Text")}</h1>
          <h3 className="subtitle">{t("p404SubText")}</h3>

          <Button type="primary" size="large" style={{ width: 210, height: 50 }} onClick={() => history.replace("/")}>
            <span>{t("p404Action")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

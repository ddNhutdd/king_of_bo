import { Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { getDefaultLanguage, getSupportedLanguageList } from "../function/getDefaultLanguage";

export default function Header({ history }) {
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.title = "BinaTrade - " + t("headingText");
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="content">
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => history.push("/")}></div>

        <div className="right-area">
          <div className="lang-zone">
            <Select defaultValue={getDefaultLanguage()} onChange={handleChangeLanguage} listHeight={300}>
              {getSupportedLanguageList().map((lang, index) => {
                return (
                  <Select.Option key={index} value={lang.code}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={`/img/flag/${lang.code}.png`}
                        alt="en"
                        style={{ width: 20, height: 20, marginRight: 8 }}
                      />
                      <span>{lang.nameText}</span>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </div>

          <i className="fa-solid fa-house" onClick={() => history.replace("/home")}></i>
        </div>
      </div>
    </header>
  );
}

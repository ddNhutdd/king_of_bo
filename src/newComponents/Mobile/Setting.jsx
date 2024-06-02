import { Select, Switch } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { getDefaultLanguage, getSupportedLanguageList } from "../../function/getDefaultLanguage";

export default function Setting() {
  const { t, i18n } = useTranslation();

  let defaultSound = "yes";
  if (localStorage.getItem("sound") == null || localStorage.getItem("sound") == undefined) {
    defaultSound = "yes";
  } else if (localStorage.getItem("sound") == "yes") {
    defaultSound = "yes";
  } else if (localStorage.getItem("sound") == "no") {
    defaultSound = "no";
  } else {
    defaultSound = "yes";
  }

  const onLangChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.title = "BinaTrade - " + t("headingText");
  };

  const onChange = (checked) => {
    // checked: true / false
    localStorage.setItem("sound", checked ? "yes" : "no");
  };

  return (
    <div className="setting-mobile">
      <h2 className="setting-m-title">{t("setting")}</h2>

      <div className="language-field">
        <span className="langlang">
          <i className="fa-solid fa-globe"></i>
          {t("language")}
        </span>

        <Select
          style={{
            width: 150,
          }}
          onChange={onLangChange}
          value={getDefaultLanguage()}
          listHeight={300}
        >
          {getSupportedLanguageList().map((lang, index) => {
            return (
              <Select.Option key={index} value={lang.code}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={`/img/flag/${lang.code}.png`} alt="en" style={{ width: 20, height: 20, marginRight: 8 }} />
                  <span>{lang.nameText}</span>
                </div>
              </Select.Option>
            );
          })}
        </Select>
      </div>

      <div className="sound-field">
        <span className="langlang">
          <i className="fa-solid fa-volume-high"></i>
          {t("soundd")}
        </span>
        <Switch defaultChecked={defaultSound == "yes"} onChange={onChange} />
      </div>
    </div>
  );
}

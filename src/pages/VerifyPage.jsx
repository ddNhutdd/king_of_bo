import { Button } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import bg from "../assets/img/login_bg.jpg";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function VerifyPage({ history }) {
  const { userSignup } = useSelector((root) => root.signupReducer);

  const { t } = useTranslation();

  if (history.action !== "PUSH") {
    return <Redirect to="/" />;
  }

  return (
    <div className="verify-page">
      <div className="left-area">
        <img src={bg} alt="Verify Page" />
      </div>

      <div className="right-area">
        <Header history={history} />

        <div className="verify">
          <div className="center-area">
            <h2 className="title">{t("vyeText")}</h2>

            <div>
              {t("vye1")} <strong>{userSignup.email || "your email address"}</strong>
            </div>

            <div style={{ marginTop: 12, marginBottom: 40 }}>
              {t("vye2")}{" "}
              <a
                className="go-to-spam"
                href="https://mail.google.com/mail/u/0/#spam"
                target="_blank"
                rel="noreferrer noopener"
              >
                <strong>{t("vye3")}</strong>
              </a>
            </div>

            <Button
              type="primary"
              style={{ width: "100%", fontWeight: "bold" }}
              size="large"
              onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox")}
            >
              {t("vye4")}
            </Button>

            <div className="resend-email">
              {t("vye5")}
              <strong> {t("vye6")}</strong>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

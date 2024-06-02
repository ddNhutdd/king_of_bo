import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { axiosService } from "../util/service";

import { useTranslation } from "react-i18next";
import bg from "../assets/img/login_bg.jpg";

export default function VerifyTokenPage(props) {
  const [status, setStatus] = useState(null);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const verifyEmail = async () => {
    const token = props.match.params.token;
    localStorage.setItem("token", token);

    try {
      let response = await axiosService.post("/api/user/verifyEmail");
      console.log(response.data);
      if (response.data.status === true) {
        setStatus(true);
        // Login
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        dispatch({
          type: "USER_LOGIN",
          payload: response.data.data,
        });
      }
    } catch (error) {
      console.log(error);
      setStatus(false);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  if (status === null) return <></>;

  return (
    <div className="verify-token-page">
      <div className="left-area">
        <img src={bg} />
      </div>

      <div className="right-area">
        <Header history={props.history} />

        <div className="verify-token">
          <div className="center-area">
            {/* Success */}
            {status === true ? (
              <div className="verify-success">
                <i className="fa-solid fa-circle-check"></i>
                <h2 className="title">{t("vtppt1")}</h2>
                <div style={{ marginBottom: 40 }}>{t("vtppt2")}</div>

                <Button
                  type="primary"
                  style={{ width: "100%", fontWeight: "bold" }}
                  size="large"
                  onClick={() => props.history.push("/")}
                >
                  {t("vtppt3")}
                </Button>
              </div>
            ) : null}

            {/* Fail */}
            {status === false ? (
              <div className="verify-fail">
                <i className="fa-solid fa-circle-xmark"></i>
                <h2 className="title">{t("vtppt4")}</h2>

                <div style={{ marginBottom: 20 }}>{t("vtppt5")}</div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

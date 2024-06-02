import { Button, Input } from "antd";
import React, { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { axiosService } from "../util/service";

import { useTranslation } from "react-i18next";
import bg from "../assets/img/login_bg.jpg";

export default function VerifyTokenPage2(props) {
  const [status, setStatus] = useState(null);
  const [pass, setPass] = useState("");

  const { t } = useTranslation();

  const verifyPassword = async (password) => {
    const token = props.match.params.token;
    localStorage.setItem("token", token);

    try {
      let response = await axiosService.post("api/user/forgetPassword", {
        newPassword: password,
      });
      console.log(response.data);
      if (response.data.status === true) {
        setStatus(true);
      }
    } catch (error) {
      console.log(error);
      setStatus(false);
    } finally {
      localStorage.removeItem("token");
    }
  };

  const handleChangeInput = (e) => {
    setPass(e.target.value);
  };

  const handleConfirm = () => {
    verifyPassword(pass);
  };

  if (status === null)
    return (
      <div className="verify-token-page">
        <div className="left-area">
          <img src={bg} />
        </div>

        <div className="right-area">
          <Header history={props.history} />

          <div className="verify-token">
            <div className="center-area">
              <div className="center-area">
                <h2 className="title">{t("rfsd1")}</h2>
                <form>
                  <div className="password-field field">
                    <label htmlFor="password">{t("rfsd2")}</label>
                    <Input.Password
                      size="large"
                      type="password"
                      id="password"
                      name="password"
                      value={pass}
                      onChange={handleChangeInput}
                    />
                  </div>

                  <Button
                    type="primary"
                    style={{ width: "100%", marginTop: 40, fontWeight: "bold" }}
                    size="large"
                    onClick={handleConfirm}
                  >
                    {t("rfsd3")}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    );

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
                <h2 className="title">{t("rfsd10")}</h2>
                <div style={{ marginBottom: 40 }}>{t("rfsd11")}</div>

                <Button
                  type="primary"
                  style={{ width: "100%", fontWeight: "bold" }}
                  size="large"
                  onClick={() => props.history.push("/login")}
                >
                  {t("login")}
                </Button>
              </div>
            ) : null}

            {/* Fail */}
            {status === false ? (
              <div className="verify-fail">
                <i className="fa-solid fa-circle-xmark"></i>
                <h2 className="title">{t("rfsd20")}</h2>

                <div style={{ marginBottom: 20 }}>{t("rfsd21")}</div>
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

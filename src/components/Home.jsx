import { Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import coin1 from "../assets/img/coin1.svg";
import coin2 from "../assets/img/coin2.svg";
import coin3 from "../assets/img/coin3.svg";
import ic1 from "../assets/img/ic1.png";
import ic2 from "../assets/img/ic2.png";
import ic3 from "../assets/img/ic3.png";
import item1 from "../assets/img/item1.png";
import item2 from "../assets/img/item2.png";
import item3 from "../assets/img/item3.png";
import logo from "../assets/img/logo/logoImgTextHorizontal.png";
import mockup from "../assets/img/mockup.png";
import mockup2 from "../assets/img/mockup2.png";
import phone1 from "../assets/img/phone1.png";
import phone2 from "../assets/img/phone2.png";
import phone3 from "../assets/img/phone3.png";
import { APP_NAME } from "../constant/constant";

// AOS
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [isScrollDown, setIsScrollDown] = useState(false);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    window.onscroll = () => {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        setIsScrollDown(true);
      } else {
        setIsScrollDown(false);
      }
    };

    setTimeout(() => {
      setLoading(false);
    }, 400);

    AOS.init({
      duration: 500,
    });
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`home-page ${loading ? "hidden" : "visible"}`}>
      <div className={`home-header ${isScrollDown ? "scroll-down" : ""}`}>
        <div className={`home-header-navbar ${isScrollDown ? "scroll-down" : ""}`}>
          <div className="container">
            <div className="left logo">
              <img src={logo} alt={APP_NAME} onClick={() => history.push("/")} />
            </div>

            <div className="right actions">
              <Button type="primary" size={isScrollDown ? "middle" : "large"} onClick={() => history.push("/login")}>
                {t("login")}
              </Button>
              {window.innerWidth < 375 ? null : (
                <Button size={isScrollDown ? "middle" : "large"} onClick={() => history.push("/signup")}>
                  {t("signup")}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="home-header-content">
          <div className="container">
            <h1 className="title">{t("headingText")}</h1>
            <h3 className="subtitle">{t("headingSubText")}</h3>
            <Button
              type="primary"
              size="large"
              style={{ width: 210, height: 50 }}
              onClick={() => history.push("/login")}
            >
              <span>{t("startTrading")}</span>
            </Button>
            <img src={mockup} alt={APP_NAME} data-aos="fade-up" data-aos-delay="100" />
          </div>
        </div>
      </div>

      <div className="home-intro">
        <div className="container">
          <div className="item" data-aos="zoom-in" data-aos-delay="0">
            <img src={ic1} className="item-image-icon" />
            <div className="item-title">{t("gt1")}</div>
            <div className="item-content">{t("gt11")}</div>
          </div>
          <div className="item" data-aos="zoom-in" data-aos-delay="150">
            <img src={ic2} className="item-image-icon" />
            <div className="item-title">{t("gt2")}</div>
            <div className="item-content">{t("gt22")}</div>
          </div>
          <div className="item" data-aos="zoom-in" data-aos-delay="300">
            <img src={ic3} className="item-image-icon" />
            <div className="item-title">{t("gt3")}</div>
            <div className="item-content">{t("gt33")}</div>
          </div>
        </div>
      </div>

      <div className="home-intro-2">
        <div className="container">
          <div className="top">
            <h2 className="title">{t("htText")}</h2>
            <p>{t("htSubText")}</p>
          </div>
          <div className="bottom">
            <div className="item" data-aos="zoom-in" data-aos-delay="0">
              <img src={item1} alt={APP_NAME} />
              <div className="item-title">{t("ht1")}</div>
              <div className="item-content">{t("ht11")}</div>
            </div>
            <div className="item" data-aos="zoom-in" data-aos-delay="150">
              <img src={item2} alt={APP_NAME} />
              <div className="item-title">{t("ht2")}</div>
              <div className="item-content">{t("ht22")}</div>
            </div>
            <div className="item" data-aos="zoom-in" data-aos-delay="300">
              <img src={item3} alt={APP_NAME} />
              <div className="item-title">{t("ht3")}</div>
              <div className="item-content">{t("ht33")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-guide">
        <div className="container">
          <h2 className="title">{t("ftText")}</h2>
          <p className="sub">{t("ftSubText")}</p>

          <div className="list">
            <div className="item" data-aos="zoom-out" data-aos-delay="0">
              <img src={phone1} alt={APP_NAME} />
              <div className="item-title">{t("ft1")}</div>
              <div className="item-content">{t("ft11")}</div>
            </div>
            <div className="item" data-aos="zoom-out" data-aos-delay="150">
              <img src={phone2} alt={APP_NAME} />
              <div className="item-title">{t("ft2")}</div>
              <div className="item-content">{t("ft22")}</div>
            </div>
            <div className="item" data-aos="zoom-out" data-aos-delay="300">
              <img src={phone3} alt={APP_NAME} />
              <div className="item-title">{t("ft3")}</div>
              <div className="item-content">{t("ft33")}</div>
            </div>
          </div>

          <div className="cta">
            <Button
              type="primary"
              size="large"
              style={{ width: 210, height: 50 }}
              onClick={() => history.push("/login")}
            >
              <span>{t("startTrading")}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="home-promo">
        <div className="container" data-aos="slide-right" data-aos-delay="200">
          <h2 className="title">{t("xtText")}</h2>
          <p className="sub">{t("xtSubText")}</p>
          <div className="cta">
            <Button
              type="primary"
              size="large"
              style={{ width: 210, height: 50 }}
              onClick={() => history.push("/login")}
            >
              <span>{t("startTrading")}</span>
            </Button>
          </div>
        </div>

        <img src={mockup2} alt={APP_NAME} />
      </div>

      <div className="home-coin">
        <div className="container">
          <h2 className="title">{t("ytText")}</h2>
          <p className="sub">{t("ytSubText")}</p>
          <div className="list">
            <img src={coin1} alt={APP_NAME} data-aos="zoom-out" data-aos-delay="0" />
            <img src={coin2} alt={APP_NAME} data-aos="zoom-out" data-aos-delay="150" />
            <img src={coin3} alt={APP_NAME} data-aos="zoom-out" data-aos-delay="300" />
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="container">
          <div className="top">
            <div className="col1">
              <img src={logo} alt={APP_NAME} onClick={() => history.push("/")} />
              <div>{t("footer")}</div>
            </div>

            <div className="col2">
              <a href="/">{t("footerText1")}</a>
              <a href="/">{t("footerText2")}</a>
              <a href="/">{t("footerText3")}</a>
            </div>

            <div className="col3">
              <Select
                // defaultValue={defaultLangSelect}
                // onChange={handleChange}
                size="large"
                style={{
                  width: 150,
                }}
              >
                <Select.Option value="en">Tiếng Việt</Select.Option>
                <Select.Option value="vn">Tiếng Anh</Select.Option>
              </Select>
            </div>
          </div>

          <div className="divider"></div>

          <div className="bottom">{t("footerWarning")}</div>
        </div>
      </footer>

      <div className="home-totop" onClick={scrollTop}>
        <i className="fa-solid fa-angle-up"></i>
      </div>
    </div>
  );
}

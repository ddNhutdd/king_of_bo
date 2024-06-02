import { Button, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import b1 from "../assets/img/prize/b1.svg";
import b2 from "../assets/img/prize/b2.svg";
import b3 from "../assets/img/prize/b3.svg";
import phihanhgia from "../assets/img/prize/phihanhgia.png";
import { localeFixed } from "../function/numberFormatter";
import { axiosService } from "../util/service";

import ChallengeTable1 from "./ChallengeTable1";
import ChallengeTable2 from "./ChallengeTable2";

export default function Challenge() {
  const history = useHistory();
  const { t } = useTranslation();

  const [amountPP, setAmountPP] = useState(0);
  const [amountMega, setAmountMega] = useState(0);
  const [nameMega, setNameMega] = useState("");
  const [megaDate, setMegaDate] = useState("");

  const scrollView = (id) => {
    let view = document.getElementById(id);
    let position;
    if (view) {
      position = view.getBoundingClientRect();
      window.scrollTo(position.left, position.top + window.scrollY - 90);
    }
  };

  // const renderStar = (text) => {
  //   if (!text) return "";

  //   const numStar = text.length - 1;

  //   let starString = "";
  //   for (let index = 0; index < numStar; index++) {
  //     starString += "*";
  //   }

  //   return text[0] + starString;
  // };

  const getAmountPrizePool = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", { name: "POOL" });
      setAmountPP(response.data.data[0]?.value);
    } catch (error) {
      console.log(error);
    }
  };

  const getAmountMega = async () => {
    try {
      let response = await axiosService.post("api/binaryOption/getProfileMegaPoolAfter");
      setAmountMega(response.data.data.megaPoolAfter);
      setNameMega(response.data.data.userNameMegaPool);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAmountPrizePool();
    getAmountMega();

    const now = new Date();
    now.setDate(now.getDate() - 1);
    setMegaDate(now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear());
  }, []);

  return (
    <div className="streak-challenge-page">
      <div className="phihanhgia">
        <img src={phihanhgia} />
      </div>

      <div className="top">
        <h1 className="challenge-title">{t("scsc-title")}</h1>

        <div className="prize-pool">
          <span className="main-price">${localeFixed(amountPP, 1, ",")}</span>

          <div className="prize-pool-top">
            <span>Prize Pool</span>
          </div>

          <div className="prize-pool-bottom">
            <span>${localeFixed(amountMega, 2, ",")}</span>
          </div>
        </div>

        <div className="btn-trade-and-win">
          <Button
            type="primary"
            size="large"
            style={{ width: 220, height: 50, fontWeight: "bold" }}
            onClick={() => history.push("/user/trade")}
          >
            {t("scsc-trade")}
          </Button>
        </div>

        <div className="more-info">
          <span onClick={() => scrollView("guidelines")}>{t("scsc-info")}</span>
        </div>
      </div>

      <div className="middle">
        <div className="mid-title">
          <h4>{t("scsc-meet")}</h4>
          <h2>{t("scsc-winners")}</h2>
        </div>

        <div className="mid-winner-box">
          <p className="winner-name">{nameMega}</p>
          <span className="winner-date">Won Mega Prizes {megaDate}</span>
          <div className="box-top">MEGA JACKPOT WINNER</div>
          <div className="box-bottom">${localeFixed(amountMega, 2, ",")}</div>
        </div>

        <div className="mid-table">
          <div className="c-container">
            <Tabs defaultActiveKey="1" size="large">
              <Tabs.TabPane tab={t("scscTab1")} key="1">
                <ChallengeTable1 />
              </Tabs.TabPane>

              <Tabs.TabPane tab={t("scscTab2")} key="2">
                <ChallengeTable2 />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="c-container">
          <div className="bottom-title" id="guidelines">
            <h4>{t("scscGuideline")}</h4>
            <h2>{t("scscHowTo")}</h2>
          </div>

          <div className="bottom-list">
            <div className="item">
              <img src={b1} />
              <p>{t("signup")}</p>
              <span>
                {t("scscHowStep1a")} <br />
                {t("scscHowStep1b")}
              </span>
            </div>

            <div className="item">
              <img src={b2} />
              <p>{t("trade")}</p>
              <span>
                {t("scscHowStep2a")} <br />
                {t("scscHowStep2b")}
              </span>
            </div>

            <div className="item">
              <img src={b3} />
              <p>{t("winprizes")}</p>
              <span>
                {t("scscHowStep3a")} <br /> {t("scscHowStep3b")}
              </span>
            </div>
          </div>

          <div className="bottom-about">
            <div className="titlee">{t("scsc-aboutTheChallenge")}</div>
            <p>{t("scscText1")}</p>
            <div className="titlee">{t("scsc-term")}</div>
            <p>{t("scscText2")}</p>
            <p>{t("scscText3")}</p>
            <p>{t("scscText4")}</p>
            <p>{t("scscText5")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

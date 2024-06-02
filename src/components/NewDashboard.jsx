import { Progress } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { xx } from "../function/numberFormatter";
import { axiosService } from "../util/service";
import ChartHistory from "./ChartHistory";

export default function NewDashboard() {
  const { t } = useTranslation();

  const [winRound, setWinRound] = useState(0);
  const [drawRound, setDrawRound] = useState(0);
  const [loseRound, setLoseRound] = useState(0);

  const [amountWin, setAmountWin] = useState(0);
  const [amountLose, setAmountLose] = useState(0);

  const [buy, setBuy] = useState(0);
  const [sell, setSell] = useState(0);

  const [totalOrder, setTotalOrder] = useState(0);

  const { user, currentBalance } = useSelector((root) => root.userReducer);

  const options = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: t("Trade Stats"),
      align: "center",
      style: {
        color: "white",
      },
    },
    series: [
      {
        name: t("Round"),
        data: [
          { name: t("Win"), y: winRound, color: "#299d63" },
          { name: t("Draw"), y: drawRound, color: "grey" },
          { name: t("Lose"), y: loseRound, color: "#e65656" },
        ],
      },
    ],
    chart: {
      backgroundColor: "#011022",
      borderColor: "#ffffff33",
      borderWidth: 1,
      borderRadius: 10,
      height: 250,
      type: "pie",
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        borderColor: "#000000",
        innerSize: "55%",
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
        },
        showInLegend: true,
      },
    },
    tooltip: {
      style: {
        fontSize: 14,
      },
    },
  };

  const getDayStatistics = async (type, userid) => {
    try {
      let response = await axiosService.post("api/binaryOption/dayStatisticsOrder", { type, userid });
      setWinRound(response.data.data.totalWin);
      setLoseRound(response.data.data.totalLose);
      setDrawRound(response.data.data.totalDraw);

      setAmountWin(response.data.data.totalAmountWin);
      setAmountLose(response.data.data.totalAmountLose);

      setBuy(response.data.data.totalBuy);
      setSell(response.data.data.totalSell);

      setTotalOrder(response.data.data.totalOrder);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDayStatistics(currentBalance, user.id);
  }, [user, currentBalance]);

  const calcPercent = () => {
    if (winRound + loseRound + drawRound == 0) return 0;

    const x = (winRound / (winRound + loseRound + drawRound)) * 100;
    return Math.round(x);
  };

  const calcBuyPercent = () => {
    if (buy + sell == 0) return 0;
    const x = (buy / (buy + sell)) * 100;
    return Math.round(x);
  };

  const calcSellPercent = () => {
    if (buy + sell == 0) return 0;
    const x = (sell / (buy + sell)) * 100;
    return Math.round(x);
  };

  return (
    <div className="new-dashboard-bo-container">
      <div className="bo-static">
        <h1 className="title">{t("bostatic")}</h1>

        <div className="bo-static-main">
          <div className="left gbox">
            {winRound + loseRound + drawRound == 0 ? null : (
              <div className="top">
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
            )}

            <div className="bottom">
              <div className="item">
                <span>{t("totalTrade")}</span>
                <p>{winRound + loseRound + drawRound}</p>
              </div>
              <div className="item">
                <span>{t("totalWin")}</span>
                <p>{winRound}</p>
              </div>
              <div className="item">
                <span>{t("winrate")}</span>
                <p>{calcPercent()}%</p>
              </div>
            </div>
          </div>

          <div className="right gbox">
            <div className="r1">
              <i className="fa-solid fa-chart-column"></i>
              <div className="r1-info">
                <h3>{t("netprofit")}</h3>
                <p>
                  <i className="fa-solid fa-dollar-sign" style={{ fontSize: 20, color: "white", marginRight: 4 }}></i>
                  {xx(Number(Number(amountWin) - Number(amountLose)))}
                </p>
              </div>
            </div>

            <div className="r2">
              <i className="fa-solid fa-sack-dollar"></i>
              <div className="r1-info">
                <h3>{t("revenue")}</h3>
                <p>
                  <i className="fa-solid fa-dollar-sign" style={{ fontSize: 20, color: "white", marginRight: 4 }}></i>
                  {xx(totalOrder)}
                </p>
              </div>
            </div>

            <div className="r3">
              <div className="title">{t("tradeSum")}</div>

              <Progress
                percent={buy + sell == 0 ? 0 : 100}
                success={{
                  percent: calcBuyPercent(),
                }}
              />
              <div className="span-group">
                <span className="span1">
                  {t("buy")} {calcBuyPercent()}%
                </span>
                <span className="span2">
                  {calcSellPercent()}% {t("sell")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="trade-history gbox">
          <ChartHistory />
        </div>
      </div>
    </div>
  );
}

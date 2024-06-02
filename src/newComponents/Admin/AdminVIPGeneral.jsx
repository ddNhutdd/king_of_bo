import { Table, Tabs } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import rank1 from "../../assets/img/vip/rank1.png";
import rank2 from "../../assets/img/vip/rank2.png";
import rank3 from "../../assets/img/vip/rank3.png";
import rank4 from "../../assets/img/vip/rank4.png";
import rank5 from "../../assets/img/vip/rank5.png";
import rank6 from "../../assets/img/vip/rank6.png";
import rank7 from "../../assets/img/vip/rank7.png";
import { localeFixed, xx } from "../../function/numberFormatter";
import { axiosService } from "../../util/service";

export default function AdminVIPGeneral() {
  const { t } = useTranslation();
  const { uid } = useParams();

  const [userDetail, setUserDetail] = useState(undefined);
  const USER_LEVEL = userDetail?.level;

  const [condition1, setCondition1] = useState(0);
  const [condition2, setCondition2] = useState(0);

  const [con1value, setCon1Value] = useState(0);
  const [con2value, setCon2Value] = useState(0);

  const [newReferalsSeries, setNewReferalsSeries] = useState([]); // series 1
  const [newAgenciesSeries, setNewAgenciesSeries] = useState([]); // series 2
  const [cat, setCat] = useState([]); // category cho trục x

  // for Network Vol Stats
  const [dataForNetworkVolStat, setDataForNetworkVolStat] = useState([]);
  const [totalVolStat, setTotalVolStat] = useState(0);

  const options = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    series: [
      {
        name: "New referrals",
        data: newReferalsSeries,
        color: "#1bd6ce",
        fillColor: {
          stops: [
            [0, "#1bd6ce"],
            [1, "#01102200"],
          ],
        },
      },
      {
        name: "New agencies",
        data: newAgenciesSeries,
        color: "#0ca1ff",
        fillColor: {
          stops: [
            [0, "#0ca1ff"],
            [1, "#01102200"],
          ],
        },
      },
    ],
    chart: {
      backgroundColor: "#011022",
      borderColor: "#ffffff33",
      borderWidth: 1,
      borderRadius: 10,
      height: 250,
      type: "areaspline",
    },
    yAxis: {
      title: {
        enabled: false,
      },
      opposite: true,
      labels: {
        style: {
          color: "#fff",
          fontSize: 13,
        },
      },
      gridLineWidth: 0,
      gridLineColor: "transparent",
      lineWidth: 0,
    },
    xAxis: {
      categories: cat,
      labels: {
        step: 3,
        style: {
          color: "#fff",
          fontSize: 13,
        },
      },
      gridLineWidth: 0.2,
      gridLineColor: "#ccc",
      gridLineDashStyle: "longdash",
      tickInterval: 3,
      lineWidth: 0,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
        color: "#30d6ce",
        fillColor: {
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, "#30d6ce70"],
            [1, "#30d6ce00"],
          ],
        },
      },
    },
    tooltip: {
      shared: true,
      style: {
        fontSize: 14,
      },
    },
  };

  const columns = [
    {
      title: t("time"),
      key: "Time",
      render: (_, { created_at }) => {
        const d = new Date(created_at);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
      },
    },
    {
      title: "Volume",
      key: "Volume",
      dataIndex: "totalVolume",
      render: (num) => xx(num),
    },
  ];

  const getLevelImage = (level) => {
    switch (level) {
      // không có case 0 vì 0 là chưa mua vip
      case 1:
        return rank1;
      case 2:
        return rank2;
      case 3:
        return rank3;
      case 4:
        return rank4;
      case 5:
        return rank5;
      case 6:
        return rank6;
      case 7:
        return rank7;
      default:
        break;
    }
  };

  const getChart = async (payload) => {
    try {
      let response = await axiosService.post("api/binaryOption/getChartStatisticsUserAdmin", payload);
      const dataBackend = response.data.data;
      setDataForNetworkVolStat([...dataBackend].reverse());

      let sum = 0;
      for (let item of dataBackend) {
        sum += Number(item.totalVolume);
      }
      setTotalVolStat(sum);

      let s1 = [];
      let s2 = [];
      let s = [];
      for (let item of dataBackend) {
        s1.push(Number(item.totalMember));
        s2.push(Number(item.totalMemberVipF1));

        let x = new Date(item.created_at);
        let month = x.getMonth() + 1;
        let day = x.getDate();
        s.push(day + "/" + month);
      }
      setNewReferalsSeries(s1);
      setNewAgenciesSeries(s2);
      setCat(s);
    } catch (error) {
      console.log(error);
    }
  };

  // get profile of this user from admin
  const getProfile = async () => {
    try {
      let response = await axiosService.post("api/user/getProfileToId", { userid: uid });
      setUserDetail(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sumOfArr = (array) => {
    return array.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
  };

  const getCondition = async () => {
    // data for box 1
    try {
      let response = await axiosService.post("api/binaryOption/weekStatisticsOrderAdmin", {
        type: "live",
        userid: uid,
      });
      setCon1Value(response.data.data.totalOrderF1);
      setCon2Value(response.data.data.totalMemberVipF1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let dateNow = new Date();
    let start = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1).getTime();
    let end = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getTime();

    getChart({
      start,
      end,
      userid: uid,
    });

    getProfile();

    getCondition();
  }, []);

  useEffect(() => {
    if (USER_LEVEL == 0) {
      setCondition1(0);
      setCondition2(0);
    } else if (USER_LEVEL == 1) {
      setCondition1(2000);
      setCondition2(3);
    } else if (USER_LEVEL == 2) {
      setCondition1(4000);
      setCondition2(4);
    } else if (USER_LEVEL == 3) {
      setCondition1(8000);
      setCondition2(5);
    } else if (USER_LEVEL == 4) {
      setCondition1(16000);
      setCondition2(6);
    } else if (USER_LEVEL == 5) {
      setCondition1(32000);
      setCondition2(7);
    } else if (USER_LEVEL == 6) {
      setCondition1(64000);
      setCondition2(8);
    } else if (USER_LEVEL == 7) {
      setCondition1(64000);
      setCondition2(8);
    } else {
      setCondition1(0);
      setCondition2(0);
    }
  }, [userDetail]);

  const onTabChange = (tab) => {
    if (tab == "thismonth") {
      let dateNow = new Date();
      let start = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1).getTime();
      let end = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getTime();

      getChart({
        start,
        end,
        userid: uid,
      });
    } else if (tab == "lastmonth") {
      let dateNow = new Date();
      let start = new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, 1).getTime();
      let end = new Date(dateNow.getFullYear(), dateNow.getMonth(), 0).getTime();

      getChart({
        start,
        end,
        userid: uid,
      });
    }
  };

  return (
    <div className="general-container">
      <div className="grow-1 g-row-1-admin">
        <div className="gbox gbox-1">
          <div className="top">
            <img src={getLevelImage(USER_LEVEL)} alt="" />
            <span>{t("levelBac")}</span>
          </div>

          <div className="bottom">
            <h3>{t("rankConditions")}</h3>
            <div className="bot-info">
              <div className="item item-1">
                <div>F1 volume ({t("This Week")})</div>
                <p>
                  ${xx(con1value)} <span>/ ${xx(condition1)}</span>
                </p>
              </div>
              <div className="item">
                <div>F1 VIP</div>
                <p>
                  {xx(con2value)} <span>/ {xx(condition2)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="gbox gbox-2">
          <div className="top">
            {t("lpa11")}: <span>{userDetail?.userNameParent}</span>
          </div>

          <div className="bottom">
            <div className="item">
              <span>{t("lpa22")}</span>
              <p className="p11">{xx(userDetail?.totalMember)}</p>
            </div>

            <div className="item">
              <span>{t("lpa33")}</span>
              <p className="p22">{xx(userDetail?.totalMemberVip)}</p>
            </div>

            <div className="item">
              <span>{t("tradingCommission")}</span>
              <p className="p33">{xx(userDetail?.totalCommission)}</p>
            </div>

            <div className="item">
              <span>{t("vipCommission")}</span>
              <p className="p44">{xx(userDetail?.commissionMemberVip)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grow-2">
        <div className="gbox gbox-4">
          <Tabs defaultActiveKey="thismonth" type="card" onChange={onTabChange}>
            <Tabs.TabPane tab={t("thisMonth")} key="thismonth">
              <div className="g4-area">
                <div className="left">
                  <h3>{t("recentStatistics")}</h3>
                  <p>
                    {t("Total new referrals")} ({sumOfArr(newReferalsSeries)})
                  </p>
                  <p>
                    {t("Total new agencies")} ({sumOfArr(newAgenciesSeries)})
                  </p>
                </div>
                <div className="right">
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={t("lastMonth")} key="lastmonth">
              <div className="g4-area">
                <div className="left">
                  <h3>{t("recentStatistics")}</h3>
                  <p>
                    {t("Total new referrals")} ({sumOfArr(newReferalsSeries)})
                  </p>
                  <p>
                    {t("Total new agencies")} ({sumOfArr(newAgenciesSeries)})
                  </p>
                </div>
                <div className="right">
                  <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>

        <div className="gbox gbox-5">
          <div className="top">
            <i className="fa-solid fa-chart-simple"></i>
            <h2>{t("Network Vol Stats")}</h2>
          </div>

          <div className="mid">
            <Table
              size="small"
              columns={columns}
              dataSource={dataForNetworkVolStat}
              rowKey={(record) => record.id}
              pagination={true}
              className="vip-table-1"
              rowClassName="t1-row"
            />
          </div>

          <div className="bottom">
            <div className="b1">{t("total")}</div>
            <div className="b2">$ {xx(totalVolStat)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

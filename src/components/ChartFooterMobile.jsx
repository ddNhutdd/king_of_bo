import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { axiosService } from "../util/service";
import GaugeHighchart from "./GaugeHighchart";
import svgDown from "../assets/img/svg/downRed.svg";
import svgUp from "../assets/img/svg/upGreen.svg";

export default function ChartFooterMobile({ symbol }) {
  const { t } = useTranslation();
  const { time } = useSelector((root) => root.timeReducer);

  const [data, setData] = useState([]);
  const [index, setIndex] = useState(40);
  const [valueConfig, setValueConfig] = useState(0);
  const [currentTab, setCurrentTab] = useState("1");

  const spaceItemArr = [20, 21, 22, 23, 40, 41, 42, 43];

  const [totalGreen, setTotalGreen] = useState(0);
  const [totalRed, setTotalRed] = useState(0);

  useEffect(() => {
    if (time == 1 || time == 31) {
      getCountConfig();
    }
  }, [time]);

  const getChart = async (symbol) => {
    try {
      let response = await axiosService.post("api/binaryOption/getChart", { symbol });
      const x = response.data.data;

      const y = x.slice((index - 1) * -1);
      // lấy (index-1) phần tử cuối cùng trong mảng

      for (let j = 0; j < 60 - (index - 1); j++) {
        y.push(undefined);
      }

      let countBuy = 0;
      let countSell = 0;
      for (let item of y) {
        if (item) {
          if (item.close < item.open) {
            countSell++;
          } else if (item.close > item.open) {
            countBuy++;
          }
          // không đếm trường hợp open = close (hoà)
        }
      }

      setTotalGreen(countBuy);
      setTotalRed(countSell);

      setData(y);
    } catch (error) {
      console.log(error);
    }
  };

  const getCountConfig = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", { name: "count" });
      const x = Number(response.data.data[0].value);
      setValueConfig(x);
      setIndex(40 + x);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountConfig();
  }, []);

  useEffect(() => {
    if (valueConfig != 0) getChart(symbol);
  }, [valueConfig]);

  const renderTile = () => {
    return data.map((item, index) => {
      if (item === undefined) {
        return <div className={`tile-item-mobile ${spaceItemArr.includes(index) ? "space" : ""}`} key={index}></div>;
      } else {
        return (
          <div
            className={`tile-item-mobile ${
              item.close < item.open ? "red" : item.close > item.open ? "green" : "white"
            } ${spaceItemArr.includes(index) ? "space" : ""}`}
            key={index}
          ></div>
        );
      }
    });
  };

  return (
    <>
      <Tabs
        currentTab={currentTab}
        onChange={(key) => setCurrentTab(key)}
        defaultActiveKey="1"
        className="cf-tabss"
        destroyInactiveTabPane
        tabBarExtraContent={
          <div
            className="counter-mobile-tabBarExtraContent"
            style={currentTab == "1" ? { opacity: 0 } : { opacity: 1 }}
          >
            <div className="count-buy">
              <img src={svgUp} alt="" />
              <span>{totalGreen}</span>
            </div>

            <div className="count-sell">
              <img src={svgDown} alt="" />
              <span>{totalRed}</span>
            </div>
          </div>
        }
      >
        <Tabs.TabPane tab={t("tabsIndicators")} key="1">
          <div className="chart-gauge">
            <GaugeHighchart gaugeTitle="Oscillators" isBigger={false} gaugeDesc={t("gaugeDecs1")} />
            <GaugeHighchart gaugeTitle="Summary" isBigger={true} gaugeDesc={t("gaugeDecs2")} />
            <GaugeHighchart gaugeTitle="Moving Averages" isBigger={false} gaugeDesc={t("gaugeDecs3")} />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab={t("tabsLastResult")} key="2">
          <div className="chart-footer-mobile">
            {data.length === 0 ? null : (
              <div className="tile-area-mobile">
                <div className="tile-zone-mobile">{renderTile()}</div>
              </div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}

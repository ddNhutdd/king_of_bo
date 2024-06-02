import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import svgDown from "../assets/img/svg/downRed.svg";
import svgUp from "../assets/img/svg/upGreen.svg";
import { axiosService } from "../util/service";
import GaugeHighchart from "./GaugeHighchart";

export default function ChartFooter({ symbol }) {
  const { t } = useTranslation();
  const { time } = useSelector((root) => root.timeReducer);
  const { isShowSidePane } = useSelector((root) => root.sidepaneReducer);

  const [data, setData] = useState([]);
  const [index, setIndex] = useState(80);
  const [valueConfig, setValueConfig] = useState(0);
  const [currentTab, setCurrentTab] = useState("1");

  const spaceItemArr = [20, 21, 22, 23, 40, 41, 42, 43, 60, 61, 62, 63, 80, 81, 82, 83];

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

      for (let j = 0; j < 100 - (index - 1); j++) {
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
      setIndex(80 + x);
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
        return <div className={`tile-item ${spaceItemArr.includes(index) ? "space" : ""}`} key={index}></div>;
      } else {
        return (
          <div
            className={`tile-item ${item.close < item.open ? "red" : item.close > item.open ? "green" : "white"} ${
              spaceItemArr.includes(index) ? "space" : ""
            }`}
            key={index}
          ></div>
        );
      }
    });
  };

  return (
    <>
      <Tabs
        defaultActiveKey="1"
        activeKey={currentTab}
        onChange={(key) => setCurrentTab(key)}
        className="cf-tabss"
        destroyInactiveTabPane
        tabBarExtraContent={
          <div className="counter" style={currentTab == "1" ? { opacity: 0 } : { opacity: 1 }}>
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
          <div className={`chart-gauge ${isShowSidePane ? "isShowSidePane" : ""}`}>
            <GaugeHighchart gaugeTitle={t("Oscillators")} isBigger={false} gaugeDesc={t("gaugeDecs1")} />
            <GaugeHighchart gaugeTitle={t("Summary")} isBigger={true} gaugeDesc={t("gaugeDecs2")} />
            <GaugeHighchart gaugeTitle={t("Moving Averages")} isBigger={false} gaugeDesc={t("gaugeDecs3")} />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab={t("tabsLastResult")} key="2">
          <div className="chart-footer">
            {data.length === 0 ? null : (
              <div className="tile-area">
                <div className="tile-zone">{renderTile()}</div>
              </div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}

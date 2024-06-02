import { Tabs, Tag } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import bitcoin from "../assets/img/bitcoin.png";
import svgEmpty from "../assets/img/svg/empty.svg";
import { xx } from "../function/numberFormatter";
import { axiosService } from "../util/service";

function DrawerSidePane() {
  const [openList, setOpenList] = useState([]); // list cho tab 1
  const [closeList, setCloseList] = useState([]); // list cho tab 2

  const [currentTab, setCurrentTab] = useState("1");

  const { t } = useTranslation();

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);

  const { currentBalance, pendingOrder } = useSelector((root) => root.userReducer);
  const { isShowSidePane } = useSelector((root) => root.sidepaneReducer);
  const { time } = useSelector((root) => root.timeReducer);
  const { user } = useSelector((root) => root.userReducer);

  const convertTime = (timeString) => {
    const timeStamp = Date.parse(timeString);
    const date = new Date(timeStamp);
    return date.toLocaleString();
  };

  const convertTimeOnly = (timeString) => {
    const timeStamp = Date.parse(timeString);
    const date = new Date(timeStamp);
    return date.toLocaleTimeString();
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getDayHistory(currentBalance, 100, page);
  };

  // get data cho tab 1
  const getAllOrderPendingUser = async (type) => {
    try {
      let response = await axiosService.post("api/binaryOption/getAllOrderPendingUser", { type });
      setOpenList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get data cho tab 2
  const getDayHistory = async (type, limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/dayHistoryOrder", { type, limit, page });
      setCloseList(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const renderLIVEDEMO = () => {
    if (user?.level == 0) {
      if (currentBalance == "demo") return <span className="type">DEMO</span>;
      else if (currentBalance == "live") return <></>;
    } else {
      return <></>;
    }
  };

  const renderOpenTab = () => {
    if (currentTab == "1") {
      if (openList.length === 0) {
        return (
          <div className="empty-box-very-new">
            <img src={svgEmpty} alt="no-data" />
            <p>Bạn chưa có lệnh nào đang mở</p>
          </div>
        );
      }

      return openList.map((item, index) => {
        return (
          <div className={`${item.side == "buy" ? "item-sp buy" : "item-sp sell"}`} key={index}>
            <div className="row1">
              <span className="symbol">BTC/USD</span>
              <img src={bitcoin} alt="" />
            </div>

            <div className="row2">
              <div className="left">
                <i className={`fa-solid ${item.side == "buy" ? "fa-circle-up" : "fa-circle-down"}`}></i>
                <span className="side">{`${item.side == "buy" ? t("buy") : t("sell")}`}</span>
              </div>

              <span className="amount">${xx(item.amount)}</span>
            </div>

            <div className="row3">
              <span>Thời gian</span>
              <span>{convertTimeOnly(item.created_at)}</span>
            </div>
          </div>
        );
      });
    }
  };

  const renderCloseTab = () => {
    if (currentTab == "2") {
      if (closeList.length === 0) {
        return (
          <div className="empty-box-very-new">
            <img src={svgEmpty} alt="no-data" />
            <p>Bạn chưa có lệnh nào đã khớp</p>
          </div>
        );
      }

      return closeList.map((item, index) => {
        let stt = <></>;
        let pf = <></>;

        if (item.status === "PENDING") {
          stt = <Tag color={"orange"}>{t("p11")}</Tag>;
          pf = <></>;
        } else if (item.status === "SUCCESS") {
          if (item.resultProfit === -1) {
            // hoà
            stt = <Tag>{t("p14")}</Tag>;
            pf = <span style={{ color: "white" }}>0</span>;
          } else if (item.resultProfit === 0) {
            // thua
            stt = <Tag color={"red"}>{t("p13")}</Tag>;
            pf = <span style={{ color: "#ee475d" }}>-${xx(item.amount)}</span>;
          } else {
            // thắng
            stt = <Tag color={"green"}>{t("p12")}</Tag>;
            pf = <span style={{ color: "#27c86a" }}>+${xx(item.amount * item.configProfit + item.amount)}</span>;
          }
        }

        return (
          <div className={`${item.side == "buy" ? "item-sp buy" : "item-sp sell"}`} key={index}>
            <div className="row1">
              <span className="symbol">BTC/USD</span>
              <img src={bitcoin} alt="" />
            </div>

            <div className="row2">
              <div className="left">
                <i className={`fa-solid ${item.side == "buy" ? "fa-circle-up" : "fa-circle-down"}`}></i>
                <span className="side">{`${item.side == "buy" ? t("buy") : t("sell")}`}</span>
              </div>

              <span className="amount">${xx(item.amount)}</span>
            </div>

            <div className="row4">
              <span className="time">{item.created_at}</span>
              <span className="result">{pf}</span>
            </div>
          </div>
        );
      });
    }
  };

  useEffect(() => {
    if (isShowSidePane) {
      getAllOrderPendingUser(currentBalance);
      setCurrent(1);
      getDayHistory(currentBalance, 100, 1);
    }
  }, [isShowSidePane, currentTab, pendingOrder]);

  useEffect(() => {
    if ((time === 1 || time === 31) && isShowSidePane) {
      getAllOrderPendingUser(currentBalance);
      setCurrent(1);
      getDayHistory(currentBalance, 100, 1);
    }
  }, [time]);

  return (
    <div className="drawer-sidepane-cn">
      <Tabs
        centered
        destroyInactiveTabPane
        className="drawer-sidepane-0304-tab-cf78121"
        defaultActiveKey={currentTab}
        activeKey={currentTab}
        onChange={(tab) => {
          setCurrentTab(tab);
        }}
      >
        <Tabs.TabPane
          tab={
            <div>
              <span>{t("open").toUpperCase()}</span>
              {openList.length > 0 && <span className="listCount-jka">{openList.length}</span>}
            </div>
          }
          key="1"
        >
          <div className="open-list">{renderOpenTab()}</div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={t("close").toUpperCase()} key="2">
          {/* <div className="pagination-zone">
            <Pagination
              defaultCurrent={1}
              total={totalRecord}
              current={current}
              onChange={onPaginationChange}
              showSizeChanger={false}
              showQuickJumper={false}
              showLessItems={true}
              size="small"
              className="pagination-box"
              hideOnSinglePage
            />
          </div> */}
          <div className="close-list">{renderCloseTab()}</div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default memo(DrawerSidePane);

import { Button, Empty, Pagination, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ROW_PER_TABLE } from "../../constant/constant";
import { xx } from "../../function/numberFormatter";
import { axiosService } from "../../util/service";
import socket from "../../util/socket";

export default function OrderMobile() {
  const [currentButton, setCurrentButton] = useState("open");

  const [openList, setOpenList] = useState([]); // list cho tab 1
  const [closeList, setCloseList] = useState([]); // list cho tab 2

  const { t } = useTranslation();

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);

  const { currentBalance } = useSelector((root) => root.userReducer);
  const { user } = useSelector((root) => root.userReducer);

  const convertTime = (timeString) => {
    const timeStamp = Date.parse(timeString);
    const date = new Date(timeStamp);
    return date.toLocaleString();
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getDayHistory(currentBalance, ROW_PER_TABLE, page);
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
    if (openList.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("nodata")} />;
    }

    return openList.map((item, index) => {
      return (
        <div className={`${item.side == "buy" ? "item-sp buy" : "item-sp sell"}`} key={index}>
          <div className="row1">
            <span className="symbol">{item.symbol}</span>
            {renderLIVEDEMO()}
          </div>
          <div className="row2">
            <span className="side">{`${item.side == "buy" ? t("buy") : t("sell")}`}</span>
            <span className="amount">${xx(item.amount)}</span>
          </div>
          <div className="row3">{convertTime(item.created_at)}</div>
        </div>
      );
    });
  };

  const renderCloseTab = () => {
    if (closeList.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("nodata")} />;
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
            <span className="symbol">{item.symbol}</span>
            {renderLIVEDEMO()}
          </div>

          <div className="row2">
            <span className="side">{`${item.side == "buy" ? t("buy") : t("sell")}`}</span>
            <span className="amount">${xx(item.amount)}</span>
          </div>

          <div className="row4">
            <div>{stt}</div>
            <span className="result">{pf}</span>
          </div>

          <div className="row3">{item.created_at}</div>
        </div>
      );
    });
  };

  useEffect(() => {
    socket.removeAllListeners();

    socket.on("TIME", (res) => {
      if ((res === 1 || res === 31) && currentButton == "open") {
        getAllOrderPendingUser(currentBalance);
      }
      if ((res === 1 || res === 31) && currentButton == "close") {
        setCurrent(1);
        getDayHistory(currentBalance, ROW_PER_TABLE, 1);
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [currentButton, currentBalance]);

  useEffect(() => {
    if (currentButton == "open") {
      getAllOrderPendingUser(currentBalance);
    }
    if (currentButton == "close") {
      setCurrent(1);
      getDayHistory(currentBalance, ROW_PER_TABLE, 1);
    }
  }, [currentButton, currentBalance]);

  return (
    <div className="order-mobile">
      <div className="top-head">
        <Button
          size="large"
          type={currentButton == "open" ? "primary" : "default"}
          onClick={() => setCurrentButton("open")}
        >
          Open orders
        </Button>
        <Button
          size="large"
          type={currentButton == "close" ? "primary" : "default"}
          onClick={() => setCurrentButton("close")}
        >
          Close orders
        </Button>
      </div>

      <div className="main">
        {currentButton == "open" && (
          <>
            <div className="open-list">{renderOpenTab()}</div>
          </>
        )}

        {currentButton == "close" && (
          <>
            <div className="pagination-zone">
              <Pagination
                defaultCurrent={1}
                total={totalRecord}
                current={current}
                onChange={onPaginationChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showLessItems={true}
                className="pagination-box"
                hideOnSinglePage
              />
            </div>
            <div className="close-list">{renderCloseTab()}</div>
          </>
        )}
      </div>
    </div>
  );
}

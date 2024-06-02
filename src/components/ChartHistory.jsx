import { Pagination, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import bitcoin from "../assets/img/bitcoin.png";
import { ROW_PER_TABLE } from "../constant/constant";
import { xx } from "../function/numberFormatter";
import { axiosService } from "../util/service";

export default function ChartHistory() {
  const { t } = useTranslation();

  const [duration, setDuration] = useState("Today");
  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const { currentBalance } = useSelector((root) => root.userReducer);

  const handleChange = (value) => setDuration(value);

  const columns = [
    {
      title: t("market"),
      key: "Market",
      dataIndex: "symbol",
      width: 120,
      render: (text) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={bitcoin} alt="" style={{ width: 18, height: 18, marginRight: 5 }} />
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: t("actionLenh"),
      key: "Action",
      render: (_, { side }) => {
        if (side === "buy") return <b style={{ color: "#27c86a", textTransform: "uppercase" }}>{t("buy")}</b>;
        if (side === "sell") return <b style={{ color: "#ee475d", textTransform: "uppercase" }}>{t("sell")}</b>;
      },
      width: 120,
    },
    {
      title: t("amount"),
      key: "Amount",
      dataIndex: "amount",
      width: 120,
      render: (num) => {
        return (
          <span style={{ fontSize: 14 }}>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginRight: 3 }}></i>
            {xx(num)}
          </span>
        );
      },
    },
    {
      title: t("status"),
      key: "Status",
      render: (_, record) => {
        if (record.status === "PENDING") {
          return <Tag color={"orange"}>{t("pending").toUpperCase()}</Tag>;
        } else if (record.status === "SUCCESS") {
          if (record.resultProfit === -1) {
            return <Tag>{t("p14")}</Tag>;
          } else if (record.resultProfit === 0) {
            return <Tag color="red">{t("lose")}</Tag>;
          } else {
            return <Tag color="green">{t("win")}</Tag>;
          }
        }
      },
      width: 120,
    },
    {
      title: t("profit"),
      key: "Profit",
      render: (_, { resultProfit, amount, configProfit, status }) => {
        if (status === "PENDING") {
          return <></>;
        } else {
          if (resultProfit === -1) {
            // hoà
            return (
              <b style={{ color: "white", fontSize: 14 }}>
                <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "white", marginRight: 3 }}></i> 0
              </b>
            );
          } else if (resultProfit === 0) {
            // thua
            return (
              <b style={{ color: "#ee475d", fontSize: 14 }}>
                -<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#ee475d", marginRight: 3 }}></i>
                {xx(amount)}
              </b>
            );
          } else {
            // thắng
            return (
              <b style={{ color: "#27c86a", fontSize: 14 }}>
                <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#27c86a", marginRight: 3 }}></i>{" "}
                {xx(amount * configProfit + amount)}
              </b>
            );
          }
        }
      },
      width: 120,
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
  ];

  const columnsMobile = [
    {
      title: "Col1",
      key: "Col1",
      render: (_, record) => {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={bitcoin} alt="" style={{ width: 18, height: 18, marginRight: 5 }} />
              <span>{record.symbol}</span>
            </div>

            <div style={{ marginTop: 5 }}>
              {record.side === "buy" && (
                <b style={{ color: "#27c86a", textTransform: "uppercase", fontSize: 14 }}>{t("buy")}</b>
              )}
              {record.side === "sell" && (
                <b style={{ color: "#ee475d", textTransform: "uppercase", fontSize: 14 }}>{t("sell")}</b>
              )}
              <span style={{ fontSize: 14 }}>
                <i
                  className="fa-solid fa-dollar-sign"
                  style={{ fontSize: 14, color: "whitesmoke", marginRight: 3, marginLeft: 8 }}
                ></i>
                {xx(record.amount)}
              </span>
            </div>

            <div style={{ marginTop: 5, fontSize: 12, color: "whitesmoke" }}>{record.created_at}</div>
          </>
        );
      },
    },
    {
      title: t("status"),
      key: "Status",
      render: (_, record) => {
        if (record.status === "PENDING") {
          return <Tag color={"orange"}>{t("pending")}</Tag>;
        } else if (record.status === "SUCCESS") {
          if (record.resultProfit === -1) {
            return <Tag>{t("p14")}</Tag>;
          } else if (record.resultProfit === 0) {
            return <Tag color="red">{t("lose")}</Tag>;
          } else {
            return <Tag color="green">{t("win")}</Tag>;
          }
        }
      },
    },
    {
      title: t("profit"),
      key: "Profit",
      render: (_, { resultProfit, amount, configProfit, status }) => {
        if (status === "PENDING") {
          return <></>;
        } else {
          if (resultProfit === -1) {
            return (
              <b style={{ color: "white", fontSize: 14 }}>
                <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "white", marginRight: 2 }}></i> 0
              </b>
            );
          } else if (resultProfit === 0) {
            return (
              <b style={{ color: "#ee475d", fontSize: 14 }}>
                - <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#ee475d", marginRight: 2 }}></i>
                {xx(amount)}
              </b>
            );
          } else {
            return (
              <b style={{ color: "#27c86a", fontSize: 14 }}>
                <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#27c86a", marginRight: 2 }}></i>{" "}
                {xx(amount * configProfit + amount)}
              </b>
            );
          }
        }
      },
      width: 120,
    },
  ];

  const getDayHistory = async (limit, page, type) => {
    try {
      let response = await axiosService.post("api/binaryOption/dayHistoryOrder", { limit, page, type });
      setTotalRecord(response.data.data.total);
      setArray(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const getWeekHistory = async (limit, page, type) => {
    try {
      let response = await axiosService.post("api/binaryOption/weekHistoryOrder", { limit, page, type });
      setTotalRecord(response.data.data.total);
      setArray(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (duration === "Today") {
      getDayHistory(ROW_PER_TABLE, 1, currentBalance);
    } else if (duration === "This week") {
      getWeekHistory(ROW_PER_TABLE, 1, currentBalance);
    }
    setCurrent(1);
  }, [duration, currentBalance]);

  const onPaginationChange = (page) => {
    setCurrent(page);
    if (duration === "Today") {
      getDayHistory(ROW_PER_TABLE, page, currentBalance);
    } else if (duration === "This week") {
      getWeekHistory(ROW_PER_TABLE, page, currentBalance);
    }
  };

  return (
    <div className="chart-history-in-new-dashboard">
      <div className="title-area">
        <h2 className="title">{t("tradeHistory")}</h2>

        <div className="select-box">
          <Select
            defaultValue={duration}
            value={duration}
            style={{
              width: 120,
            }}
            onChange={handleChange}
          >
            <Select.Option value="Today">{t("today")}</Select.Option>
            <Select.Option value="This week">{t("thisWeek")}</Select.Option>
          </Select>
        </div>

        <Pagination
          defaultCurrent={1}
          total={totalRecord}
          current={current}
          onChange={onPaginationChange}
          showSizeChanger={false}
          showQuickJumper={false}
          className="pagination-box"
        />
      </div>

      <Table
        className="trade-history-bo-table-bo-1"
        rowClassName="t1-row"
        columns={window.innerWidth <= 768 ? columnsMobile : columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        showHeader={window.innerWidth <= 768 ? false : true}
      />
    </div>
  );
}

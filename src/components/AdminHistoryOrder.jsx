import { Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { xx } from "../function/numberFormatter";
import { axiosService } from "../util/service";

export default function AdminHistoryOrder() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();
  const history = useHistory();

  // for table
  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);

  const getHistory = async (limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getOrderAdmin", {
        limit,
        page,
      });
      setArray(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getHistory(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    setCurrent(1);
    getHistory(ROW_PER_TABLE, 1);
  }, []);

  const columns = [
    {
      title: "User",
      key: "User",
      width: 200,
      render: (_, record) => {
        return (
          <div
            onClick={() => history.push("/admin/manage-users?user=" + record.username)}
            style={{ cursor: "pointer" }}
          >
            <span>{record.username}</span>
            <br />
            <span style={{ fontStyle: "italic" }}>{record.email}</span>
          </div>
        );
      },
    },
    {
      title: t("orderL"),
      key: "Side",
      render: (_, { side }) => {
        if (side === "buy") return <span style={{ color: "#27c86a", textTransform: "uppercase" }}>{t("buy")}</span>;
        if (side === "sell") return <span style={{ color: "#ee475d", textTransform: "uppercase" }}>{t("sell")}</span>;
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
          <span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginRight: 3 }}></i>
            <span style={{ fontSize: 15 }}>{xx(num)}</span>
          </span>
        );
      },
    },
    {
      title: t("status"),
      key: "Status",
      render: (_, record) => {
        if (record.status === "PENDING") {
          return (
            <Tag color={"orange"}>
              <strong style={{ textTransform: "uppercase" }}>{t("pending")}</strong>
            </Tag>
          );
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
            return "0";
          } else if (resultProfit === 0) {
            return (
              <span style={{ color: "#ee475d" }}>
                -<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#ee475d", marginInline: 2 }}></i>
                <span style={{ fontSize: 15, color: "#ee475d" }}>{xx(amount)}</span>
              </span>
            );
          } else {
            return (
              <span style={{ color: "#27c86a" }}>
                <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#27c86a", marginInline: 2 }}></i>
                <span style={{ fontSize: 15, color: "#27c86a" }}>{xx(amount * configProfit)}</span>
              </span>
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

  return (
    <div className="admin-history-order">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("adHistoryOrder")}</h2>

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
        size="small"
        className="admin-history-order-table-new-css"
        rowClassName="t1-row"
        bordered
        columns={columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 800,
        }}
      />
    </div>
  );
}

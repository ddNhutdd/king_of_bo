import { Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { localeFixed } from "../function/numberFormatter";
import { axiosService } from "../util/service";

export default function AdminHistoryProfit() {
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
      let response = await axiosService.post("api/binaryOption/getProfitsAdmin", {
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
      title: "Type",
      key: "Message",
      dataIndex: "message",
      width: 120,
    },
    {
      title: t("amount"),
      key: "Amount",
      width: 120,
      render: (_, { type, amount }) => {
        if (type == 1) {
          return (
            <span style={{ color: "#27c86a", fontSize: 15 }}>
              +<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#27c86a", marginInline: 2 }}></i>
              {amount}
            </span>
          );
        } else if (type == 0) {
          return (
            <span style={{ color: "#ee475d", fontSize: 15 }}>
              -<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#ee475d", marginInline: 2 }}></i>
              {amount}
            </span>
          );
        }
      },
    },
    {
      title: t("profitBefore"),
      key: "Profit before",
      dataIndex: "profitBefore",
      width: 120,
      render: (text) => <span style={{ fontSize: 15 }}>${localeFixed(text, 2, ",")}</span>,
    },
    {
      title: t("profitAfter"),
      key: "Profit after",
      dataIndex: "profitAfter",
      width: 120,
      render: (text) => <span style={{ fontSize: 15 }}>${localeFixed(text, 2, ",")}</span>,
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
  ];

  return (
    <div className="admin-history-profit">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("adHistoryProfit")}</h2>

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
        className="admin-history-profit-table-new-css"
        rowClassName="t1-row"
        bordered
        size="small"
        columns={columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 820,
        }}
      />
    </div>
  );
}

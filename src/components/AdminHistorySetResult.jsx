import { Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { axiosService } from "../util/service";

export default function AdminHistorySetResult() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();

  // for table
  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);

  const getHistory = async (limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getSetResultAdmin", {
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
      title: t("result"),
      key: "Result",
      dataIndex: "result",
      width: 120,
      render: (text) => {
        if (text == "buy") {
          return <span style={{ color: "#27c86a", textTransform: "uppercase", fontWeight: 600 }}>{t("buy")}</span>;
        } else if (text == "sell") {
          return <span style={{ color: "#ee475d", textTransform: "uppercase", fontWeight: 600 }}>{t("sell")}</span>;
        }
      },
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
  ];

  return (
    <div className="admin-history-set-result">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("adHistorySetResult")}</h2>

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
        columns={columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        className="admin-history-set-result-table-new-css"
        rowClassName="t1-row"
        size="middle"
        bordered
      />
    </div>
  );
}

import { Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ROW_PER_TABLE } from "../constant/constant";
import { axiosService } from "../util/service";
import { getTheme } from "../function/getTheme";
import { useTranslation } from "react-i18next";
import { xx } from "../function/numberFormatter";

export default function CommissionAdmin() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();
  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const columns = [
    {
      title: "User",
      key: "User",
      dataIndex: "userName",
      width: 200,
    },
    {
      title: t("level"),
      key: "Level",
      dataIndex: "level",
      width: 100,
    },
    {
      title: t("userOrder"),
      key: "Username order",
      dataIndex: "parentUserName",
      width: 200,
    },
    {
      title: t("amount"),
      key: "Amount",
      dataIndex: "amount",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: t("amountR"),
      key: "Amount Receive",
      dataIndex: "amountReceive",
      width: 100,
    },
    {
      title: t("percent"),
      key: "Percent",
      render: (_, record) => {
        return <span>{record.percent * 100}%</span>;
      },
      width: 100,
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
  ];

  const getCommission = async (limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getCommissionAdmin", {
        limit,
        page,
      });
      setTotalRecord(response.data.data.total);
      setArray(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getCommission(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    getCommission(ROW_PER_TABLE, 1);
  }, []);

  return (
    <div className="commission-admin">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("commission")}</h2>

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
        className="commission-admin-aa-table"
        rowClassName="t1-row"
        bordered
        size="middle"
        columns={columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ x: 1000 }}
      />
    </div>
  );
}

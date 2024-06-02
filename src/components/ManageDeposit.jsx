import { Input, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { axiosService } from "../util/service";
import { xx } from "../function/numberFormatter";

const { Search } = Input;

export default function ManageDeposit() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();

  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  async function getAllData(limit, page) {
    try {
      const response = await axiosService.post("api/crypto/getHistoryDepositAdmin", {
        limit,
        page,
      });
      setArray(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchDeposit(keyword) {
    try {
      const response = await axiosService.post("api/admin/sreachListUserDeposit", {
        limit: "10",
        page: "1",
        keyWord: keyword,
      });
      setArray(response.data.data);
      setTotalRecord(10);
      setCurrent(1);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllData(ROW_PER_TABLE, 1);
    setCurrent(1);
  }, []);

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllData(ROW_PER_TABLE, page);
  };

  const onSearch = (keyword) => {
    if (keyword !== "") {
      searchDeposit(keyword);
    } else {
      getAllData(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  const onChange = (e) => {
    let keyword = e.target.value;
    if (keyword === "") {
      getAllData(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  const columns = [
    {
      title: "UserID",
      key: "user_id",
      dataIndex: "user_id",
      width: 80,
    },
    {
      title: "Username",
      key: "userName",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: t("amount"),
      key: "amount",
      dataIndex: "amount",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: t("time"),
      key: "time",
      dataIndex: "created_at",
      width: 160,
    },
    {
      title: t("address"),
      key: "address",
      dataIndex: "to_address",
      width: 450,
    },
    {
      title: "TxID",
      key: "txid",
      dataIndex: "hash",
      width: 450,
    },
    {
      title: t("status"),
      key: "status",
      dataIndex: "status",
      width: 90,
      render: (_, { status }) => {
        if (status === 1) {
          return (
            <Tag color="green">
              <strong>{t("sc-success")}</strong>
            </Tag>
          );
        } else {
          return <></>;
        }
      },
    },
  ];

  return (
    <div className="deposits">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("deposit")}</h2>

        <Search placeholder="Search" className="search-box" allowClear onSearch={onSearch} onChange={onChange} />

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
        className="manage-deposit-table-new-css"
        rowClassName="t1-row"
        bordered
        size="middle"
        columns={columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 1480,
        }}
      />
    </div>
  );
}

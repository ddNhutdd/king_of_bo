import { Button, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { xx } from "../function/numberFormatter";
import { showAlert } from "../function/showAlert";
import { axiosService } from "../util/service";

export default function ManagePrizePool() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();
  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const getData = async (limit, page) => {
    try {
      const response = await axiosService.post("api/binaryOption/getListStreak", {
        limit,
        page,
      });
      setArray(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmPrizeAdmin = async (id) => {
    try {
      const response = await axiosService.post("api/binaryOption/confirmPrizePoolAdmin", {
        id,
      });
      showAlert("success", response.data.message);
      getData(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  useEffect(() => {
    setCurrent(1);
    getData(ROW_PER_TABLE, 1);
  }, []);

  const onPaginationChange = (page) => {
    setCurrent(page);
    getData(ROW_PER_TABLE, page);
  };

  const columns = [
    {
      title: "UserID",
      key: "UserID",
      dataIndex: "userid",
      width: 80,
    },
    {
      title: "Username",
      key: "Username",
      dataIndex: "userName",
      width: 120,
    },
    {
      title: "Email",
      key: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: t("streak"),
      key: "Streak",
      dataIndex: "streak",
      width: 100,
      render: () => {
        return <span style={{ color: "#16c670", fontWeight: 600 }}></span>;
      },
    },
    {
      title: t("prize"),
      key: "Prize",
      dataIndex: "amount",
      width: 120,
      render: (num) => {
        return (
          <span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginRight: 3 }}></i>
            {xx(num)}
          </span>
        );
      },
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
    {
      title: t("status"),
      key: "Status",
      width: 150,
      render: ({ type, id }) => {
        if (type == 0) {
          return (
            <Tag color="grey">
              <b>{t("userNotConfirm")}</b>
            </Tag>
          );
        } else if (type == 2) {
          return (
            <Button type="primary" onClick={() => confirmPrizeAdmin(id)}>
              {t("confirm")}
            </Button>
          );
        } else if (type == 1) {
          return (
            <Tag color="green">
              <b style={{ textTransform: "uppercase" }}>{t("success")}</b>
            </Tag>
          );
        }
      },
    },
  ];

  return (
    <div className="admin-manage-prize-pool">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>Prize Pool</h2>

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
        className="manage-prizepool-table-new-css"
        rowClassName="t1-row"
        bordered
        size="middle"
        columns={columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 970,
        }}
      />
    </div>
  );
}

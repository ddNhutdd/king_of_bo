import { Image, Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { axiosService } from "../util/service";

export default function Commission() {
  const { t } = useTranslation();

  const isDarkTheme = getTheme();

  const [array, setArray] = useState([]);
  const [array2, setArray2] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // for pagination2
  const [current2, setCurrent2] = useState(1);
  const [totalRecord2, setTotalRecord2] = useState(0);

  const [ib, setIb] = useState(0);

  const columns = [
    {
      title: t("level"),
      key: "Level",
      dataIndex: "level",
      width: 100,
    },
    {
      title: t("usernameOrder"),
      key: "Username order",
      width: 200,
      render: (_, record) => {
        return (
          <div>
            <div>ID: {record.parentId} </div>
            <div>
              <strong>{record.parentUserName}</strong>
            </div>
          </div>
        );
      },
    },
    {
      title: t("amount"),
      key: "Amount",
      dataIndex: "amount",
      width: 100,
    },
    {
      title: t("amountReceive"),
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

  const columns2 = [
    {
      title: "Balance",
      key: "Balance",
      dataIndex: "balance",
      width: 200,
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
      let response = await axiosService.post("api/binaryOption/getCommission", {
        limit,
        page,
      });
      setTotalRecord(response.data.data.total);
      setArray(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const getTransferCommission = async (limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/historyTransferCommission", {
        limit,
        page,
      });
      setTotalRecord2(response.data.data.total);
      setArray2(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = async () => {
    try {
      let response = await axiosService.post("/api/user/getProfile");
      setIb(response.data.data.commissionBalance);
    } catch (error) {
      console.log(error);
    }
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getCommission(ROW_PER_TABLE, page);
  };

  const onPaginationChange2 = (page) => {
    setCurrent2(page);
    getTransferCommission(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    getProfile();

    setCurrent(1);
    getCommission(ROW_PER_TABLE, 1);

    setCurrent2(1);
    getTransferCommission(ROW_PER_TABLE, 1);
  }, []);

  return (
    <>
      <div className="img-c" style={{ marginBottom: window.innerWidth < 576 ? 10 : 30 }}>
        <Image src="/img/commission.jpg" />
      </div>

      <div className="total-ib" style={{ marginBottom: window.innerWidth < 576 ? 10 : 30 }}>
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("totalIB")}</h2>

        <span style={{ fontWeight: 600, fontSize: 18 }}>$ {ib.toFixed(2)}</span>
      </div>

      <div className="commission" style={{ marginBottom: window.innerWidth < 576 ? 10 : 30 }}>
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
          columns={columns}
          dataSource={array}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ x: 700 }}
        />
      </div>

      <div className="transfer-commission">
        <div className="title-area">
          <h2 className={isDarkTheme ? "title dark" : "title"}>Transfer commission</h2>

          <Pagination
            defaultCurrent={1}
            total={totalRecord2}
            current={current2}
            onChange={onPaginationChange2}
            showSizeChanger={false}
            showQuickJumper={false}
            className="pagination-box"
          />
        </div>

        <Table
          columns={columns2}
          dataSource={array2}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ x: 300 }}
        />
      </div>
    </>
  );
}

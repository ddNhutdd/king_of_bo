import { Button, DatePicker, Pagination, Select, Table } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ROW_PER_TABLE } from "../../constant/constant";
import { xx } from "../../function/numberFormatter";
import { showErrorToast } from "../../function/showToastify";
import { axiosService } from "../../util/service";

export default function AdminVIPCommission() {
  const { t } = useTranslation();
  const { uid } = useParams();

  const [type, setType] = useState("trading");
  const [timeStart, setTimeStart] = useState(undefined);
  const [timeEnd, setTimeEnd] = useState(undefined);
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);

  const onPaginationChange = (page) => {
    setCurrent(page);

    if (!type || !timeStart || !timeEnd) {
      showErrorToast("Something went wrong");
      return;
    }

    if (type == "trading") {
      getDataTradingCommission(timeStart, timeEnd, ROW_PER_TABLE, page);
    } else if (type == "vip") {
      getDataVIPCommission(timeStart, timeEnd, ROW_PER_TABLE, page);
    }
  };

  const handleChange = (value) => {
    setCurrent(1);
    setTotalRecord(0);
    setData([]);

    setType(value);
  };

  const columns = [
    {
      title: t("username"),
      key: "Username order",
      dataIndex: "parentUserName",
      width: 200,
    },
    {
      title: t("amount"),
      key: "Amount",
      dataIndex: "amount",
      width: 150,
      render: (num) => xx(num),
    },
    {
      title: t("amountReceive"),
      key: "Amount Received",
      dataIndex: "amountReceive",
      width: 150,
      render: (num) => xx(num),
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
  ];

  const columnsTypeVIP = [
    {
      title: "User",
      key: "Username",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: "Email",
      key: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: t("amount"),
      key: "Amount",
      dataIndex: "balance",
      width: 150,
      render: (num) => xx(num),
    },
    {
      title: t("detail"),
      key: "Detail",
      dataIndex: "detail",
      width: 200,
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
  ];
  const columnsTypeVIPMobile = [
    {
      title: "User",
      key: "User",
      width: 150,
      render: (_, record) => {
        return (
          <div>
            <div style={{ fontSize: 14 }}>{record.userName}</div>
            <i style={{ fontSize: 12 }}>{record.email}</i>
          </div>
        );
      },
    },
    {
      title: t("amount"),
      key: "Amount",
      dataIndex: "balance",
      width: 120,
      render: (num) => xx(num),
    },
    {
      title: t("detail"),
      key: "Detail",
      dataIndex: "detail",
      width: 200,
    },
  ];

  const getDataTradingCommission = async (timeStart, timeEnd, limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getHistoryCommissionToTimeAdmin", {
        timeStart,
        timeEnd,
        limit,
        page,
        userid: uid,
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataVIPCommission = async (timeStart, timeEnd, limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getHistoryCommissionMemberVipToTimeAdmin", {
        timeStart,
        timeEnd,
        limit,
        page,
        userid: uid,
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDatePickerChange = (date) => {
    setCurrent(1);
    setTotalRecord(0);
    setData([]);

    try {
      const startObject = date[0].toObject();
      const start = new Date(startObject.years, startObject.months, startObject.date).getTime();

      const endObject = date[1].toObject();
      const end = new Date(endObject.years, endObject.months, endObject.date, 23, 59, 59).getTime();

      setTimeStart(start);
      setTimeEnd(end);
    } catch (error) {
      // clear cái datepicker thì nhảy vô đây
      setTimeStart(undefined);
      setTimeEnd(undefined);
    }
  };

  const handleBtnSearch = () => {
    if (!type || !timeStart || !timeEnd) {
      showErrorToast("Something went wrong");
      return;
    }

    if (type == "trading") {
      getDataTradingCommission(timeStart, timeEnd, ROW_PER_TABLE, 1);
    } else if (type == "vip") {
      getDataVIPCommission(timeStart, timeEnd, ROW_PER_TABLE, 1);
    }
  };

  const getColumns = () => {
    if (type == "trading") {
      return columns;
    } else if (type == "vip") {
      if (window.innerWidth <= 768) return columnsTypeVIPMobile;
      else return columnsTypeVIP;
    }
  };

  return (
    <div className="vip-commission-container">
      <div className="title-area">
        <div className="left"></div>

        <div className="right">
          <div className="field type-field">
            <label htmlFor="type-field">{t("comType")}</label>
            <Select
              value={type}
              style={{
                width: 200,
              }}
              onChange={handleChange}
              options={[
                {
                  value: "trading",
                  label: t("tradingCommission"),
                },
                {
                  value: "vip",
                  label: t("vipCommission"),
                },
              ]}
            />
          </div>

          <div className="field time-field">
            <label htmlFor="time-field">{t("time")}</label>
            <DatePicker.RangePicker onChange={handleDatePickerChange} />
          </div>

          <div className="field search-field">
            <Button
              type="primary"
              size="large"
              style={{ width: 120 }}
              onClick={handleBtnSearch}
              disabled={!timeStart || !timeEnd}
            >
              {t("search")}
            </Button>
          </div>
        </div>
      </div>

      <div className="main-row main-row-admin">
        <div className="grow-1">
          <div style={{ display: "flex", alignItems: "center" }}>
            <i className="fa-solid fa-server"></i>
            {t("Trading payout details")}
          </div>

          <Pagination
            defaultCurrent={1}
            total={totalRecord}
            current={current}
            onChange={onPaginationChange}
            showSizeChanger={false}
            showQuickJumper={false}
            showLessItems={true}
            className="pagination-box"
          />
        </div>

        <Table
          className="vip-commission-table-1"
          rowClassName="t1-row"
          columns={getColumns()}
          dataSource={data}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={window.innerWidth <= 768 ? {} : { x: type == "trading" ? 700 : 900 }}
        />
      </div>
    </div>
  );
}

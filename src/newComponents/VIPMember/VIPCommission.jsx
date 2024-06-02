import { Button, DatePicker, Image, Modal, Pagination, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import nodataSVG from "../../assets/img/antd-nodata.svg";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import vipTableEN from "../../assets/img/vip/vipTableEN.png";
import vipTableVN from "../../assets/img/vip/vipTableVN.png";
import { ROW_PER_TABLE } from "../../constant/constant";
import { xx } from "../../function/numberFormatter";
import { showErrorToast } from "../../function/showToastify";
import { axiosService } from "../../util/service";

export default function VIPCommission() {
  const { t, i18n } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const [type, setType] = useState("trading");
  const [timeStart, setTimeStart] = useState(undefined);
  const [timeEnd, setTimeEnd] = useState(undefined);
  const [data, setData] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(1);

  // for Trading payout chart
  const [chartData, setChartData] = useState([]);
  const [chartCate, setChartCate] = useState([]);

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
      render: (num) => <span>{xx(num)}</span>,
    },
    {
      title: t("amountReceive"),
      key: "Amount Received",
      dataIndex: "amountReceive",
      width: 150,
      render: (num) => <span>{xx(num)}</span>,
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
      render: (num) => <span>{xx(num)}</span>,
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
      render: (num) => <span>{xx(num)}</span>,
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
      let response = await axiosService.post("api/binaryOption/getHistoryCommissionToTime", {
        timeStart,
        timeEnd,
        limit,
        page,
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataVIPCommission = async (timeStart, timeEnd, limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getHistoryCommissionMemberVipToTime", {
        timeStart,
        timeEnd,
        limit,
        page,
      });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const options = {
    accessibility: {
      enabled: false,
    },
    title: {
      text: undefined,
    },
    series: [
      {
        name: "Commission",
        data: chartData,
        color: "#1bd6ce",
        fillColor: {
          stops: [
            [0, "#1bd6ce"],
            [1, "#01102200"],
          ],
        },
      },
    ],
    chart: {
      backgroundColor: "#011022",
      borderColor: "#ffffff33",
      borderWidth: 1,
      borderRadius: 10,
      height: 250,
      type: "areaspline",
    },
    yAxis: {
      title: {
        enabled: false,
      },
      opposite: true,
      labels: {
        style: {
          color: "#fff",
          fontSize: 13,
        },
      },
      gridLineWidth: 0,
      gridLineColor: "transparent",
      lineWidth: 0,
    },
    xAxis: {
      categories: chartCate,
      labels: {
        step: 3,
        style: {
          color: "#fff",
          fontSize: 13,
        },
      },
      gridLineWidth: 0.2,
      gridLineColor: "#ccc",
      gridLineDashStyle: "longdash",
      tickInterval: 3,
      lineWidth: 0,
    },
    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
    tooltip: {
      shared: true,
      style: {
        fontSize: 14,
      },
    },
  };

  const getChart = async (payload) => {
    try {
      let response = await axiosService.post("api/binaryOption/getChartStatisticsUser", payload);
      const dataBackend = response.data.data;

      let s1 = [];
      let s = [];
      for (let item of dataBackend) {
        s1.push(Number(item.commissionBalance));

        let x = new Date(item.created_at);
        let month = x.getMonth() + 1;
        let day = x.getDate();
        s.push(day + "/" + month);
      }
      setChartData(s1);
      setChartCate(s);
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

  useEffect(() => {
    let dateNow = new Date();
    let start = new Date(dateNow.getFullYear(), dateNow.getMonth(), 1).getTime();
    let end = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getTime();

    getChart({
      start,
      end,
    });
  }, []);

  return (
    <div className="vip-commission-container">
      <div className="title-area">
        <div className="left">
          <h1>{t("vvipCommission")}</h1>
          <i className="fa-regular fa-circle-question" onClick={showModal}></i>

          <Modal
            title={null}
            closable={false}
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" onClick={handleCancel}>
                {t("close")}
              </Button>,
            ]}
          >
            <Image
              style={{ width: "100%", height: "auto", borderRadius: 5 }}
              src={i18n.language == "vn" ? vipTableVN : vipTableEN}
              alt=""
            />
          </Modal>
        </div>

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

      <div className="note-row">
        <span>{t("comNote")}:</span> {t("comNoteContent")}
      </div>

      <div className="main-row">
        <div className="left gbox">
          <div className="grow-1">
            <i className="fa-solid fa-chart-line"></i>
            {t("Trading payout chart")}
          </div>

          <HighchartsReact highcharts={Highcharts} options={options} />
          {/* <div className="nodata-chart">
            <img src={nodataSVG} alt="" />
            <span>No Data</span>
          </div> */}
        </div>

        <div className="right gbox">
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
    </div>
  );
}

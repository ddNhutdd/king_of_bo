import { Descriptions, Pagination, Select, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ROW_PER_TABLE } from "../constant/constant";
import { axiosService } from "../util/service";
import { Breadcrumb } from "antd";
import { Redirect } from "react-router-dom";
import { getTheme } from "../function/getTheme";

const { Option } = Select;

// xem history của user ở phía admin

export default function UserHistory({ history, match }) {
  const isDarkTheme = getTheme();

  const [duration, setDuration] = useState("Today");
  const [array, setArray] = useState([]);
  const [statistics, setStatistics] = useState({});

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const { currentBalance } = useSelector((root) => root.userReducer);

  const handleChange = (value) => setDuration(value);

  const columns = [
    {
      title: "User",
      key: "User",
      width: 200,
      render: (_, record) => {
        return (
          <div>
            <div>ID: {record.userid}</div>
            <div>
              <strong>{record.username}</strong>
            </div>
          </div>
        );
      },
    },
    {
      title: "Market",
      key: "Market",
      dataIndex: "symbol",
      width: 120,
    },
    {
      title: "Action",
      key: "Action",
      render: (_, { side }) => {
        if (side === "buy") return <span style={{ color: "green" }}>BUY</span>;
        if (side === "sell") return <span style={{ color: "red" }}>SELL</span>;
      },
      width: 120,
    },
    {
      title: "Amount",
      key: "Amount",
      dataIndex: "amount",
      width: 120,
    },
    {
      title: "Status",
      key: "Status",
      render: (_, record) => {
        if (record.status === "PENDING") {
          return (
            <Tag color={"orange"}>
              <strong>PENDING</strong>
            </Tag>
          );
        } else if (record.status === "SUCCESS") {
          if (record.resultProfit === 0) {
            return (
              <Tag color={"red"}>
                <strong>LOSE</strong>
              </Tag>
            );
          } else {
            return (
              <Tag color={"green"}>
                <strong>WIN</strong>
              </Tag>
            );
          }
        }
      },
      width: 120,
    },
    {
      title: "Profit",
      key: "Profit",
      render: (_, { resultProfit, amount, configProfit, status }) => {
        if (status === "PENDING") {
          return <></>;
        } else {
          if (resultProfit === 0) {
            return <span style={{ color: "red" }}>-$ {amount}</span>;
          } else {
            return <span style={{ color: "green" }}>$ {(amount * configProfit).toFixed(2)}</span>;
          }
        }
      },
      width: 220,
    },
    {
      title: "Time",
      key: "Time",
      dataIndex: "created_at",
      width: 300,
    },
  ];

  const getDayHistory = async (limit, page, type, userid) => {
    try {
      let response = await axiosService.post("api/binaryOption/dayHistoryOrderAdmin", { limit, page, type, userid });
      setTotalRecord(response.data.data.total);
      setArray(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const getWeekHistory = async (limit, page, type, userid) => {
    try {
      let response = await axiosService.post("api/binaryOption/weekHistoryOrderAdmin", { limit, page, type, userid });
      setTotalRecord(response.data.data.total);
      setArray(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const getDayStatistics = async (type, userid) => {
    try {
      let response = await axiosService.post("api/binaryOption/dayStatisticsOrderAdmin", { type, userid });
      setStatistics(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getWeekStatistics = async (type, userid) => {
    try {
      let response = await axiosService.post("api/binaryOption/weekStatisticsOrderAdmin", { type, userid });
      setStatistics(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const uid = match.params.uid;

  useEffect(() => {
    if (duration === "Today") {
      getDayHistory(ROW_PER_TABLE, 1, currentBalance, uid);
      getDayStatistics(currentBalance, uid);
    } else if (duration === "This week") {
      getWeekHistory(ROW_PER_TABLE, 1, currentBalance, uid);
      getWeekStatistics(currentBalance, uid);
    }
    setCurrent(1);
  }, [duration, currentBalance]);

  const onPaginationChange = (page) => {
    setCurrent(page);
    if (duration === "Today") {
      getDayHistory(ROW_PER_TABLE, page, currentBalance, uid);
    } else if (duration === "This week") {
      getWeekHistory(ROW_PER_TABLE, page, currentBalance, uid);
    }
  };

  if (history.action === "POP") {
    return <Redirect to={"/admin/manage-users"} />;
  }

  return (
    <div className="chart-history-admin">
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item>
            <span style={{ cursor: "pointer" }} onClick={() => history.replace("/admin/manage-users")}>
              All users
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>User ID: {uid}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="statistics">
        <div className="title-area">
          <h2 className={isDarkTheme ? "title dark" : "title"}>Statistics</h2>

          <div className="select-box">
            <Select
              defaultValue={duration}
              value={duration}
              style={{
                width: 120,
              }}
              onChange={handleChange}
            >
              <Option value="Today">Today</Option>
              <Option value="This week">This week</Option>
            </Select>
          </div>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Begin balance">${statistics?.beforeBalance?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Deposit">
            {statistics?.deposit === undefined || statistics?.deposit === null ? "-" : statistics?.deposit}
          </Descriptions.Item>
          <Descriptions.Item label="Withdraw">
            {statistics?.widthdraw === undefined || statistics?.widthdraw === null ? "-" : statistics?.widthdraw}
          </Descriptions.Item>
          <Descriptions.Item label="Transfer">
            {statistics?.transfer === undefined || statistics?.transfer === null ? "-" : statistics?.transfer}
          </Descriptions.Item>
          <Descriptions.Item label="Profit">{statistics?.win - statistics?.lose}</Descriptions.Item>
          <Descriptions.Item label="Win">
            <span style={{ color: "green" }}>+ {statistics?.win}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Lose">
            <span style={{ color: "red" }}>- {statistics?.lose}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Total order">{statistics?.totalOrder}</Descriptions.Item>
          <Descriptions.Item label="End balance">${statistics?.afterBalance?.toFixed(2)}</Descriptions.Item>
        </Descriptions>
      </div>

      <div className="history">
        <div className="title-area">
          <h2 className={isDarkTheme ? "title dark" : "title"}>History</h2>

          <div className="select-box">
            <Select
              defaultValue={duration}
              value={duration}
              style={{
                width: 120,
              }}
              onChange={handleChange}
            >
              <Option value="Today">Today</Option>
              <Option value="This week">This week</Option>
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
          columns={columns}
          dataSource={array}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{
            x: 1000,
          }}
        />
      </div>
    </div>
  );
}

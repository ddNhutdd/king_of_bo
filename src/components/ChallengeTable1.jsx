import { Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { axiosService } from "../util/service";
import { xx } from "../function/numberFormatter";

export default function ChallengeTable1() {
  const { t } = useTranslation();

  const [listAllWinning, setListAllWinning] = useState([]);

  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const onPaginationChange = (page) => {
    setCurrent(page);
    getListStreak(ROW_PER_TABLE, page);
  };

  const renderStar = (text) => {
    if (!text) return "";

    const numStar = text.length - 1;

    let starString = "";
    for (let index = 0; index < numStar; index++) {
      starString += "*";
    }

    return text[0] + starString;
  };

  const columns = [
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
    {
      title: t("nickname"),
      key: "Nickname",
      dataIndex: "userName",
      width: 200,
      render: (text) => {
        return <span>{renderStar(text)}</span>;
      },
    },
    {
      title: "Streak",
      key: "Streak",
      dataIndex: "streak",
      width: 200,
      render: (streak) => {
        if (streak == "win") return <span style={{ color: "#16c670", fontWeight: 600 }}>Win Streak 15x</span>;
        else if (streak == "lose") return <span style={{ color: "#fc5f5f", fontWeight: 600 }}>Lose Streak 15x</span>;
      },
    },
    {
      title: t("prize"),
      key: "Prize",
      dataIndex: "amount",
      width: 200,
      render: (num) => {
        return (
          <span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginRight: 3 }}></i>
            {xx(num)}
          </span>
        );
      },
    },
  ];

  const columnsMobile = [
    {
      title: "col1",
      key: "col1",
      width: 200,
      render: (_, record) => {
        if (record.streak == "win")
          return (
            <div>
              <div style={{ color: "#16c670", fontWeight: 600, fontSize: 15 }}>Win Streak 15x</div>
              <span>
                <i
                  className="fa-solid fa-dollar-sign"
                  style={{ fontSize: 14, color: "whitesmoke", marginRight: 3 }}
                ></i>
                <b style={{ fontSize: 15 }}>{record.amount}</b>
              </span>
            </div>
          );
        else if (record.streak == "lose")
          return (
            <div>
              <div style={{ color: "#fc5f5f", fontWeight: 600, fontSize: 15 }}>Lose Streak 15x</div>
              <span>
                <i
                  className="fa-solid fa-dollar-sign"
                  style={{ fontSize: 14, color: "whitesmoke", marginRight: 3 }}
                ></i>
                <b style={{ fontSize: 15 }}>{record.amount}</b>
              </span>
            </div>
          );
      },
    },
    {
      title: "col2",
      key: "col2",
      width: 200,
      render: (_, record) => {
        return (
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{renderStar(record.userName)}</div>
            <span style={{ fontSize: 12 }}>{record.created_at}</span>
          </div>
        );
      },
    },
  ];

  const getListStreak = async (limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getListStreak", { limit, page });
      setListAllWinning(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrent(1);
    getListStreak(ROW_PER_TABLE, 1);
  }, []);

  return (
    <>
      <Table
        size={window.innerWidth <= 450 ? "middle" : "large"}
        rowClassName="t1-row"
        columns={window.innerWidth <= 768 ? columnsMobile : columns}
        dataSource={listAllWinning}
        rowKey={(record) => record.id}
        pagination={false}
        className="streak-challenge-table-1"
        showHeader={window.innerWidth <= 768 ? false : true}
      ></Table>

      <Pagination
        defaultCurrent={1}
        total={totalRecord}
        current={current}
        onChange={onPaginationChange}
        showSizeChanger={false}
        showQuickJumper={false}
        showLessItems={window.innerWidth <= 450}
        className="streak-challenge-table-1-pagination"
      />
    </>
  );
}

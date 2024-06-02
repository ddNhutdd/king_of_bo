import { Button, Pagination, Table, Modal, Input, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { ROW_PER_TABLE } from "../constant/constant";
import { axiosService } from "../util/service";
import { showSuccessToast, showErrorToast } from "../function/showToastify";
import { useTranslation } from "react-i18next";

export default function ChallengeTable2() {
  const { t } = useTranslation();

  const [data, setData] = useState([]);

  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const onPaginationChange = (page) => {
    setCurrent(page);
    getListStreak(ROW_PER_TABLE, page);
  };

  // Modal 2FA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [record, setRecord] = useState(undefined);
  const showModal = (row) => {
    setCode("");
    setIsModalOpen(true);
    setRecord(row);
  };
  const handleOk = async () => {
    if (!code || code == "") {
      showErrorToast("Please enter your 2FA code");
      return;
    }

    await confirmPrize(record?.id, code);

    setIsModalOpen(false);
    setRecord(undefined);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setRecord(undefined);
  };
  // Modal 2FA

  const columns = [
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
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
            {num}
          </span>
        );
      },
    },
    {
      title: t("status"),
      key: "Status",
      width: 200,
      render: (_, record) => {
        if (record.type == 0) {
          // chờ user xác nhận
          return (
            <Button type="primary" onClick={() => showModal(record)}>
              {t("confirmYourPrize")}
            </Button>
          );
        } else if (record.type == 2) {
          // user đã xác nhận chờ admin duyệt
          return (
            <Tag color="blue" style={{ padding: "4px 16px" }}>
              <i className="fa-solid fa-arrows-rotate" style={{ marginRight: 5 }}></i>
              <b style={{ fontSize: 14 }}>{t("sc-processing")}</b>
            </Tag>
          );
        } else if (record.type == 1) {
          // thành công
          return (
            <Tag color="green" style={{ padding: "4px 16px" }}>
              <i className="fa-solid fa-check" style={{ marginRight: 5 }}></i>
              <b style={{ fontSize: 14 }}>{t("sc-success")}</b>
            </Tag>
          );
        }
      },
    },
  ];

  const columnsMobile = [
    {
      title: "Streak",
      key: "Streak",
      dataIndex: "streak",
      width: 170,
      render: (streak) => {
        if (streak == "win") return <span style={{ color: "#16c670", fontWeight: 600 }}>Win Streak 15x</span>;
        else if (streak == "lose") return <span style={{ color: "#fc5f5f", fontWeight: 600 }}>Lose Streak 15x</span>;
      },
    },
    {
      title: "Prize",
      key: "Prize",
      dataIndex: "amount",
      width: 100,
      render: (num) => {
        return (
          <span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 12, color: "whitesmoke", marginRight: 2 }}></i>
            {num}
          </span>
        );
      },
    },
    {
      title: "Status",
      key: "Status",
      width: 100,
      render: (_, record) => {
        if (record.type == 0) {
          // chờ user xác nhận
          return (
            <Button type="primary" onClick={() => showModal(record)} size={"small"}>
              Confirm
            </Button>
          );
        } else if (record.type == 2) {
          // user đã xác nhận chờ admin duyệt
          return (
            <Tag color="blue" style={{ padding: "4px 16px" }}>
              <i className="fa-solid fa-arrows-rotate" style={{ marginRight: 5 }}></i>
              <b style={{ fontSize: 14 }}>PROCESSING</b>
            </Tag>
          );
        } else if (record.type == 1) {
          // thành công
          return (
            <Tag color="green" style={{ padding: "4px 16px" }}>
              <i className="fa-solid fa-check" style={{ marginRight: 5 }}></i>
              <b style={{ fontSize: 14 }}>SUCCESS</b>
            </Tag>
          );
        }
      },
    },
  ];

  const getListStreak = async (limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getPrizePoolUser", { limit, page });
      setData(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmPrize = async (id, faCode) => {
    try {
      let response = await axiosService.post("api/binaryOption/confirmPrizePoolUser", { id, otp: faCode });
      showSuccessToast(response.data.message);
      getListStreak(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
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
        dataSource={data}
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

      <Modal
        width={350}
        centered
        title={<b style={{ fontSize: 18 }}>{t("confirmYourPrize2")}</b>}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ size: "large", style: { width: 120 } }}
        okText={t("confirm")}
        cancelText={t("cancel")}
        cancelButtonProps={{ size: "large" }}
      >
        <div className="modal-confirm-prize-pool">
          <label style={{ display: "block", marginBottom: 6, fontSize: 16 }} htmlFor="this-2fa-input">
            {t("your2FACode")}
          </label>

          <Input
            id="this-2fa-input"
            size="large"
            style={{ fontSize: 18 }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}

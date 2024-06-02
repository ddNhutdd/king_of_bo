import { Modal, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { xx } from "../function/numberFormatter";
import { axiosService } from "../util/service";

export default function WithdrawHistory({ count }) {
  const { t } = useTranslation();

  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // Modal for detail
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalRecord, setGlobalRecord] = useState(undefined);
  const showModal = (record) => {
    setIsModalOpen(true);
    setGlobalRecord(record);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setGlobalRecord(undefined);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setGlobalRecord(undefined);
  };
  // Modal for detail

  const getWithdrawHistory = async (limit, page) => {
    try {
      let response = await axiosService.post("/api/crypto/getHistoryWidthdraw", {
        limit: limit.toString(),
        page: page.toString(),
      });
      if (response.data.status === true) {
        setArray(response.data.data.array);
        setTotalRecord(response.data.data.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWithdrawHistory(ROW_PER_TABLE, 1);
  }, []);

  useEffect(() => {
    setCurrent(1);
    getWithdrawHistory(ROW_PER_TABLE, 1);
  }, [count]);

  const onPaginationChange = (page) => {
    setCurrent(page);
    getWithdrawHistory(ROW_PER_TABLE, page);
  };

  const columns = [
    {
      title: "Network",
      key: "Network",
      width: 120,
      render: (_, { network }) => {
        return <span>{network}</span>;
      },
    },
    {
      title: t("amount"),
      key: "amount",
      width: 140,
      render: (_, { amount }) => {
        return (
          <>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginInline: 2 }}></i>
            <span style={{ fontSize: 16, color: "whitesmoke", fontWeight: 600 }}>{xx(amount)}</span>
          </>
        );
      },
    },
    {
      title: t("status"),
      key: "status",
      dataIndex: "status",
      width: 120,
      render: (_, { status }) => {
        if (status === 2) {
          return (
            <Tag color="orange">
              <span>{t("pendingXuLy")}</span>
            </Tag>
          );
        }
        if (status === 1) {
          return (
            <Tag color="green">
              <span>{t("success")}</span>
            </Tag>
          );
        }
        if (status === 0) {
          return (
            <Tag color="red">
              <span>{t("cancel")}</span>
            </Tag>
          );
        }
      },
    },
    {
      title: "",
      key: "Detail",
      width: 50,
      render: (_, record) => {
        return (
          <i
            className="fa-solid fa-circle-chevron-right"
            style={{ fontSize: 18, cursor: "pointer" }}
            onClick={() => showModal(record)}
          ></i>
        );
      },
    },
  ];

  const renderStatusForModal = (status) => {
    if (status === null || status === undefined) return <></>;
    if (status === 2) {
      return (
        <Tag color="orange">
          <span style={{ fontSize: 15 }}>{t("pendingXuLy")}</span>
        </Tag>
      );
    }
    if (status === 1) {
      return (
        <Tag color="green">
          <span style={{ fontSize: 15 }}>{t("success")}</span>
        </Tag>
      );
    }
    if (status === 0) {
      return (
        <Tag color="red">
          <span style={{ fontSize: 15 }}>{t("cancel")}</span>
        </Tag>
      );
    }
  };

  return (
    <div className="withdraw-history">
      <div className="title-area">
        <h2 className="title">{t("wHistory")}</h2>

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
        rowClassName="table-row"
        columns={columns}
        dataSource={array}
        rowKey={(record) => record.id}
        pagination={false}
        showHeader={window.innerWidth <= 768 ? false : true}
        size={window.innerWidth <= 768 ? "small" : "large"}
      />

      <Modal
        title={t("Withdraw information")}
        closable={true}
        footer={null}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="modal-row-sl">
          <div className="left">Network</div>
          <div className="right">{globalRecord?.network}</div>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("amount")}</div>
          <span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginRight: 2 }}></i>
            <span style={{ fontSize: 16, fontWeight: 600, color: "whitesmoke" }}>{xx(globalRecord?.amount)}</span>
          </span>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("fee")}</div>
          <span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginRight: 2 }}></i>
            <span style={{ fontSize: 16, fontWeight: 600, color: "whitesmoke" }}>{xx(globalRecord?.feeWidthdraw)}</span>
          </span>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("amountR")}</div>
          <span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginRight: 2 }}></i>
            <span style={{ fontSize: 16, fontWeight: 600, color: "whitesmoke" }}>
              {xx(globalRecord?.balanceWidthdraw)}
            </span>
          </span>
        </div>

        <div className="modal-row-sl">
          <div className="left">TxID</div>
          <span>{globalRecord?.hash}</span>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("time")}</div>
          <span>{globalRecord?.created_at}</span>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("status")}</div>
          <div>{renderStatusForModal(globalRecord?.status)}</div>
        </div>
      </Modal>
    </div>
  );
}

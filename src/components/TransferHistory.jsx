import { Modal, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ROW_PER_TABLE } from "../constant/constant";
import { xx } from "../function/numberFormatter";
import { axiosService } from "../util/service";

export default function TransferHistory() {
  const { t } = useTranslation();
  const { countTransfer } = useSelector((root) => root.historyReducer);

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

  const columns = [
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 160,
    },
    {
      title: t("amount"),
      key: "Amount",
      width: 160,
      render: (_, record) => {
        const currentID = JSON.parse(localStorage.getItem("user")).id;
        if (record.userid == currentID) {
          // mình là người gửi
          return (
            <span style={{ color: "#ee475d" }}>
              -<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#ee475d", marginInline: 2 }}></i>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{xx(record.amount)}</span>
            </span>
          );
        } else if (record.useridTo === currentID) {
          // mình là người nhận
          return (
            <span style={{ color: "#27c86a" }}>
              +<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#27c86a", marginInline: 2 }}></i>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{xx(record.receive)}</span>
            </span>
          );
        }
      },
    },
    {
      title: t("status"),
      key: "status",
      render: () => {
        return <Tag color="green">{t("success")}</Tag>;
      },
      width: 100,
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

  const renderAmountForModal = (record) => {
    if (!record) return <></>;

    const currentID = JSON.parse(localStorage.getItem("user")).id;
    if (record.userid == currentID) {
      // mình là người gửi
      return (
        <span style={{ color: "#ee475d" }}>
          -<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#ee475d", marginInline: 2 }}></i>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{xx(record.amount)}</span>
        </span>
      );
    } else if (record.useridTo === currentID) {
      // mình là người nhận
      return (
        <span style={{ color: "#27c86a" }}>
          +<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "#27c86a", marginInline: 2 }}></i>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{xx(record.receive)}</span>
        </span>
      );
    }
  };

  const getHistoryTransfer = async (limit, page) => {
    try {
      let response = await axiosService.post("api/crypto/getHistoryTransfer", {
        limit: limit.toString(),
        page: page.toString(),
      });
      setTotalRecord(response.data.data.total);
      setArray(response.data.data.array);
    } catch (error) {
      console.log(error);
    }
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getHistoryTransfer(ROW_PER_TABLE, page);
  };

  useEffect(() => {
    getHistoryTransfer(ROW_PER_TABLE, 1);
  }, [countTransfer]);

  return (
    <div className="transfer-history">
      <div className="title-area">
        <h2 className="title">{t("transHistory")}</h2>

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

      <Modal title={null} closable={false} footer={null} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="modal-row-sl">
          <div className="left">{t("sender")}</div>
          <div className="right">{globalRecord?.userName}</div>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("receiver")}</div>
          <div className="right">{globalRecord?.userNameTo}</div>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("amount")}</div>
          {renderAmountForModal(globalRecord)}
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("note")}</div>
          <div className="right">{globalRecord?.note}</div>
        </div>

        <div className="modal-row-sl">
          <div className="left">{t("time")}</div>
          <span>{globalRecord?.created_at}</span>
        </div>
      </Modal>
    </div>
  );
}

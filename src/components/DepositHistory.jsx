import { message, Modal, Pagination, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { xx } from "../function/numberFormatter";
import { axiosService } from "../util/service";

export default function DepositHistory() {
  const { t } = useTranslation();

  // for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [record, setRecord] = useState(null);

  // for data
  const [array, setArray] = useState([]);

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const getHistoryDeposit = async (limit, page) => {
    try {
      let response = await axiosService.post("api/crypto/getHistoryDeposit", {
        limit,
        page,
      });
      setArray(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHistoryDeposit(ROW_PER_TABLE, 1);
    setCurrent(1);
  }, []);

  const copyContent = (content) => {
    navigator.clipboard.writeText(content);
    message.success("Copied to clipboard");
  };

  const showModal = (record) => {
    setIsModalVisible(true);
    setRecord(record);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setRecord(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRecord(null);
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getHistoryDeposit(ROW_PER_TABLE, page);
  };

  const columns = [
    {
      title: "Network",
      key: "Network",
      dataIndex: "coin_key",
      width: 120,
      render: (network) => {
        if (network.includes("TRC")) return <span>TRC20</span>;
        else if (network.includes("BEP")) return <span>BEP20</span>;
      },
    },
    {
      title: t("amount"),
      key: "Amount",
      width: 140,
      render: (_, record) => {
        return (
          <>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "whitesmoke", marginInline: 2 }}></i>
            <span style={{ fontSize: 16, fontWeight: 600, color: "whitesmoke" }}>{xx(record.amount)}</span>
          </>
        );
      },
    },
    {
      title: t("status"),
      key: "Status",
      width: 120,
      render: () => {
        return (
          <Tag color="green">
            <span>{t("success")}</span>
          </Tag>
        );
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

  return (
    <div className="deposit-history">
      <div className="title-area">
        <h2 className="title">{t("depositHistory")}</h2>

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
        rowClassName="table-row"
        showHeader={window.innerWidth <= 768 ? false : true}
        size={window.innerWidth <= 768 ? "small" : "large"}
      />

      {/* Modal */}
      <Modal
        title={t("depositInformation")}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <dl className={window.innerWidth < 576 ? "deposit-history-modal-mobile" : "deposit-history-modal"}>
          <div>
            <dt>{t("status")}</dt>
            <dd>
              <Tag color="green" style={{ marginRight: 0 }}>
                <span style={{ fontSize: 15 }}>{t("success")}</span>
              </Tag>
            </dd>
          </div>
          <div>
            <dt>{t("time")}</dt>
            <dd>{record?.created_at}</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd>{record?.coin_key.includes("TRC") ? <span>TRC20</span> : <span>BEP20</span>}</dd>
          </div>
          <div>
            <dt>{t("amount")}</dt>
            <dd>
              <>
                +
                <i
                  className="fa-solid fa-dollar-sign"
                  style={{ fontSize: 14, color: "whitesmoke", marginInline: 2 }}
                ></i>
                <span style={{ fontSize: 16, fontWeight: 600, color: "whitesmoke" }}>{xx(record?.amount)}</span>
              </>
            </dd>
          </div>
          <div>
            <dt>TxID</dt>
            <dd className="dd_txid">
              <span>{record?.hash}</span>
              <Tooltip title={t("copy")}>
                <i className="fa-solid fa-clone" onClick={() => copyContent(record?.hash)}></i>
              </Tooltip>
            </dd>
          </div>
        </dl>
      </Modal>
      {/* End modal */}
    </div>
  );
}

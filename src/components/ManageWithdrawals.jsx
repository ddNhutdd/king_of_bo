import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Input, InputNumber, Modal, Pagination, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { xx } from "../function/numberFormatter";
import { showAlert } from "../function/showAlert";
import { showToast } from "../function/showToast";
import { axiosService } from "../util/service";

const { Search } = Input;

export default function ManageWithdrawals() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();

  const [array, setArray] = useState([]);
  const [fee, setFee] = useState(0);

  // lấy tỉ lệ phần trăm phí rút tiền
  const getFeeWithdraw = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", { name: "withdraw" });
      setFee(response.data.data[0]?.value);
    } catch (error) {
      console.log(error);
    }
  };
  const updateFeeWithdraw = async (value) => {
    try {
      await axiosService.post("api/admin/updateConfigData", { name: "withdraw", value });
      showToast("success", "Update successfully");
      getFeeWithdraw();
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };
  const confirmUpdate = () => {
    Modal.confirm({
      title: <span style={{ fontSize: 16, fontWeight: 600 }}>{t("confirm")}</span>,
      icon: <QuestionCircleFilled />,
      content: (
        <div>
          {t("confirmUpdateWFee")} <b>${fee}</b> ?
        </div>
      ),
      okText: t("updateCN"),
      cancelText: t("cancel"),
      onOk: () => {
        updateFeeWithdraw(fee);
      },
    });
  };

  // for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [record, setRecord] = useState(null);
  const [hashField, setHashField] = useState("");

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  async function getAllData(limit, page) {
    try {
      const response = await axiosService.post("api/crypto/getHistoryWidthdrawAdmin", {
        limit: limit.toString(),
        page: page.toString(),
      });
      console.log(response.data);
      setArray(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  const confirmWithdraw = async (id, hash) => {
    setLoading1(true);
    try {
      const response = await axiosService.post("api/crypto/withdrawalConfirmation", {
        id,
        hash,
      });
      showAlert("success", response.data.message);
      getAllData(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading1(false);
    }
  };

  const cancelWithdraw = async (id) => {
    setLoading2(true);
    try {
      const response = await axiosService.post("api/crypto/cancelWidthdraw", {
        id,
      });
      showAlert("success", response.data.message);
      getAllData(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading2(false);
    }
  };

  async function searchWithdrawal(keyword) {
    try {
      const response = await axiosService.post("api/admin/sreachListUserWidthdraw", {
        limit: "10",
        page: "1",
        keyWord: keyword,
      });
      setArray(response.data.data);
      setTotalRecord(10);
      setCurrent(1);
    } catch (error) {
      console.log(error);
    }
  }

  const showModal = (record) => {
    setIsModalVisible(true);
    setRecord(record);
    setHashField("");
  };

  const handleOk = () => {
    setIsModalVisible(false);

    confirmWithdraw(record.id, hashField);

    setRecord(null);
    setHashField("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRecord(null);
    setHashField("");
  };

  useEffect(() => {
    getFeeWithdraw();
    getAllData(ROW_PER_TABLE, 1);
  }, []);

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllData(ROW_PER_TABLE, page);
  };

  const onSearch = (keyword) => {
    if (keyword !== "") {
      searchWithdrawal(keyword);
    } else {
      getAllData(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  const onChange = (e) => {
    let keyword = e.target.value;
    if (keyword === "") {
      getAllData(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  const columns = [
    {
      title: "UserID",
      key: "user_id",
      dataIndex: "userid",
      width: 100,
    },
    {
      title: "Username",
      key: "userName",
      dataIndex: "userName",
      width: 150,
    },
    // {
    //   title: "Symbol",
    //   key: "symbol",
    //   dataIndex: "symbol",
    //   width: 120,
    // },
    {
      title: "Network",
      key: "network",
      dataIndex: "network",
      width: 120,
    },
    {
      title: t("address"),
      key: "withdrawal_address",
      dataIndex: "toAddress",
      width: 320,
    },
    {
      title: t("amount"),
      key: "amount",
      dataIndex: "amount",
      width: 120,
      render: (num) => xx(num),
    },
    {
      title: t("fee"),
      key: "network_fee",
      width: 120,
      render: (_, { feeWidthdraw }) => {
        return xx(feeWidthdraw);
      },
    },
    {
      title: "TxID",
      key: "hash",
      dataIndex: "hash",
      width: 400,
    },
    {
      title: t("amountR"),
      key: "amount_received",
      dataIndex: "balanceWidthdraw",
      width: 180,
      render: (num) => xx(num),
    },
    {
      title: t("time"),
      key: "time",
      dataIndex: "created_at",
      width: 180,
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
              <strong>PENDING</strong>
            </Tag>
          );
        }
        if (status === 1) {
          return (
            <Tag color="green">
              <strong>{t("sc-success")}</strong>
            </Tag>
          );
        }
        if (status === 0) {
          return (
            <Tag color="red">
              <strong>CANCEL</strong>
            </Tag>
          );
        }
      },
    },
    {
      title: t("action"),
      key: "action",
      width: 200,
      render: (_, record) => {
        if (record.status === 2) {
          return (
            <>
              <Button size="small" onClick={() => showModal(record)} loading={loading1}>
                {t("mwmwConfirm")}
              </Button>
              <Button
                size="small"
                danger
                style={{ marginLeft: 8 }}
                onClick={() => cancelWithdraw(record.id)}
                loading={loading2}
              >
                {t("cancel")}
              </Button>
            </>
          );
        }
      },
    },
  ];

  return (
    <>
      <div className="update-phi-rut-tien">
        <h2 className="title dark">{t("UpdateWithdrawFee")}</h2>

        <InputNumber
          style={{ width: 150 }}
          controls={false}
          addonAfter={<i className="fa-solid fa-dollar-sign" style={{ color: "whitesmoke", fontSize: 14 }}></i>}
          value={fee}
          onChange={(num) => setFee(num)}
        />
        <Button type="primary" style={{ marginLeft: 20 }} onClick={() => confirmUpdate()}>
          {t("updateCN")}
        </Button>
      </div>

      <div className="divider" style={{ marginBottom: 30 }}></div>

      <div className="withdrawals">
        <div className="title-area">
          <h2 className={isDarkTheme ? "title dark" : "title"}>{t("withdraw")}</h2>

          <Search placeholder="Search" className="search-box" allowClear onSearch={onSearch} onChange={onChange} />

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
          className="manage-withdraw-table-new-css"
          rowClassName="t1-row"
          bordered
          size="middle"
          columns={columns}
          dataSource={array}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{
            x: 1880,
          }}
        />

        {/* Modal */}
        <Modal
          okText="Confirm"
          title="Confirm withdrawal"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
        >
          <div className="field">
            <label htmlFor="hsh">TxID</label>
            <Input
              type="text"
              size="large"
              id="hsh"
              name="hsh"
              value={hashField}
              onChange={(e) => setHashField(e.target.value)}
            />
          </div>
        </Modal>
        {/* End modal */}
      </div>
    </>
  );
}

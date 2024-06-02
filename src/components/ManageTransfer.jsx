import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Input, InputNumber, Modal, Pagination, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant";
import { getTheme } from "../function/getTheme";
import { showAlert } from "../function/showAlert";
import { showToast } from "../function/showToast";
import { axiosService } from "../util/service";
import { xx } from "../function/numberFormatter";

export default function ManageTransfer() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();

  const [array, setArray] = useState([]);
  const [fee, setFee] = useState(0);

  // lấy phí chuyển tiền
  const getFeeTransfer = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", { name: "transfer" });
      setFee(response.data.data[0]?.value);
    } catch (error) {
      console.log(error);
    }
  };
  const updateFeeTransfer = async (value) => {
    try {
      await axiosService.post("api/admin/updateConfigData", { name: "transfer", value });
      showToast("success", "Update successfully");
      getFeeTransfer();
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
          {t("confirmTransferFeeUpdate")} <b>${fee}</b> ?
        </div>
      ),
      okText: t("updateCN"),
      cancelText: t("cancel"),
      onOk: () => {
        updateFeeTransfer(fee);
      },
    });
  };

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  async function getAllData(limit, page) {
    try {
      const response = await axiosService.post("api/crypto/getHistoryTransferAdmin", {
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

  async function searchTransfer(keyword) {
    try {
      const response = await axiosService.post("api/admin/sreachListUserTransfer", {
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

  useEffect(() => {
    getFeeTransfer();
    getAllData(ROW_PER_TABLE, 1);
  }, []);

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllData(ROW_PER_TABLE, page);
  };

  const onSearch = (keyword) => {
    if (keyword !== "") {
      searchTransfer(keyword);
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
      title: t("from"),
      key: "From",
      width: 250,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <strong>{record.userName}</strong>
            <i>{record.email}</i>
          </div>
        );
      },
    },
    {
      title: t("to"),
      key: "To",
      width: 250,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <strong>{record.userNameTo}</strong>
            <i>{record.emailTo}</i>
          </div>
        );
      },
    },
    {
      title: t("amount"),
      key: "Amount",
      dataIndex: "amount",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: t("amountR"),
      key: "Receive",
      dataIndex: "receive",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: t("time"),
      key: "Time",
      dataIndex: "created_at",
      width: 200,
    },
  ];

  return (
    <>
      <div className="update-phi-chuyen-tien">
        <h2 className="title dark">{t("updateFeeTransfer")}</h2>

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

      <div className="mn-transfer">
        <div className="title-area">
          <h2 className={isDarkTheme ? "title dark" : "title"}>{t("transferHistoryMN")}</h2>

          <Input.Search
            placeholder="Search"
            // enterButton
            className="search-box"
            allowClear
            onSearch={onSearch}
            onChange={onChange}
          />

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
          className="manage-transfer-table-new-css"
          rowClassName="t1-row"
          bordered
          size="small"
          columns={columns}
          dataSource={array}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{
            x: 1000,
          }}
        />
      </div>
    </>
  );
}

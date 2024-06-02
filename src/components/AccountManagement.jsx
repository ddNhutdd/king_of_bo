import { Button, Input, message, Modal, Pagination, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { ROW_PER_TABLE } from "../constant/constant";
import { axiosService, DOMAIN } from "../util/service";
import { getTheme } from "../function/getTheme";

const { Option } = Select;

export default function AccountManagement({ history }) {
  const { t } = useTranslation();
  const isDarkTheme = getTheme();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [level, setLevel] = useState(100);
  const [array, setArray] = useState([]);

  // for pagination list user f1
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [array2, setArray2] = useState([]);

  const columns = [
    {
      title: "No.",
      key: "No.",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
      width: 80,
    },
    {
      title: t("username"),
      key: "Username",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: t("usernameParent"),
      key: "Parent Username",
      dataIndex: "userNameParent",
      width: 150,
    },
    {
      title: "Commission balance",
      key: "Commission balance",
      dataIndex: "commissionBalance",
      width: 150,
    },
  ];

  const columns2 = [
    {
      title: "No.",
      key: "No.",
      width: 60,
      render: (t, r, i) => {
        return <span>{i + 1}</span>;
      },
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      width: 170,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Referral",
      dataIndex: "referral",
      key: "referral",
      width: 170,
    },
    {
      title: "Level",
      key: "level",
      width: 150,
      render: (_, record) => {
        return <span>Level {record.level}</span>;
      },
    },
    {
      title: "Commission balance",
      key: "Commission balance",
      dataIndex: "commissionBalance",
      width: 180,
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      width: 170,
    },
    {
      title: "Parent Name",
      key: "userNameParent",
      width: 200,
      dataIndex: "userNameParent",
    },
    {
      title: "History",
      key: "action_1",
      width: 100,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => showHistory(record)}>
            History
          </Button>
        );
      },
    },
  ];

  const handleChange = (value) => {
    setLevel(value);
    getParentToLevel(value);
  };

  const getParentToLevel = async (level) => {
    try {
      let response = await axiosService.post("api/binaryOption/getParentToLevel", {
        limit: 1000,
        page: 1,
        level,
      });
      setArray(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getListUserF1 = async (limit, page) => {
    try {
      let response = await axiosService.post("api/binaryOption/getListUserF1", {
        limit: limit.toString(),
        page: page.toString(),
      });
      setArray2(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const showHistory = (record) => {
    history.push("/user/users/" + record.id);
  };

  useEffect(() => {
    getParentToLevel(level);

    setCurrent(1);
    getListUserF1(ROW_PER_TABLE, 1);
  }, []);

  let referral = "";
  if (localStorage.getItem("user")) {
    referral = JSON.parse(localStorage.getItem("user")).referral;
  }

  const referralLink = `${DOMAIN}signup/${referral}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    message.success(t("copied"));
  };

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => setIsModalVisible(false);
  const handleCancel = () => setIsModalVisible(false);

  const onPaginationChange = (page) => {
    setCurrent(page);
    getListUserF1(ROW_PER_TABLE, page);
  };

  return (
    <>
      <div className="referral-link">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("referralLink")}</h2>

        <Input type="text" value={referralLink} />

        <div className="referral-link-action">
          <Button className="copy" onClick={copyLink} type="primary">
            {t("copy")}
          </Button>
          <Button className="qr" onClick={showModal}>
            {t("qrCode")}
          </Button>

          {/* Modal */}
          <Modal
            title={t("qrCode")}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            footer={null}
          >
            <div style={{ textAlign: "center" }}>
              <QRCode value={referralLink} size={180} />
              <div style={{ marginTop: 12, fontWeight: 600 }}>{referralLink}</div>
            </div>
          </Modal>
          {/* End modal */}

          <Button className="share"> {t("share")}</Button>
        </div>
      </div>

      <div className="acc-manage" style={{ marginTop: window.innerWidth < 576 ? 10 : 30 }}>
        <div className="title-area">
          <h2 className={isDarkTheme ? "title dark" : "title"}>{t("accountManagement")}</h2>

          <div className="select-box">
            <Select
              value={level}
              style={{
                width: 120,
              }}
              onChange={handleChange}
            >
              <Option value={100}>Level 0</Option>
              <Option value={1}>Level 1</Option>
              <Option value={2}>Level 2</Option>
              <Option value={3}>Level 3</Option>
              <Option value={4}>Level 4</Option>
              <Option value={5}>Level 5</Option>
            </Select>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={array}
          rowKey={(record) => record.id}
          pagination={true}
          scroll={{
            x: 600,
          }}
        />
      </div>

      <div className="acc-list-user-f1" style={{ marginTop: window.innerWidth < 576 ? 10 : 30 }}>
        <div className="title-area">
          <h2 className={isDarkTheme ? "title dark" : "title"}>List users F1</h2>

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
          columns={columns2}
          dataSource={array2}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{
            x: 1300,
          }}
        />
      </div>
    </>
  );
}

import { Button, Descriptions, Image, Input, Modal, Pagination, Table, Tag } from "antd";
import { React, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant.js";
import { getTheme } from "../function/getTheme";
import { showAlert } from "../function/showAlert";
import { axiosService, DOMAIN2 } from "../util/service";

const { Search } = Input;

export default function ManageKYCUsers() {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();

  const [arrayUser, setArrayUser] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [record, setRecord] = useState("");

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  async function getAllUsersKYC(limit, page) {
    try {
      const response = await axiosService.post("api/admin/getAllUserKyc", {
        limit: limit.toString(),
        page: page.toString(),
      });
      setArrayUser(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchUsersKYC(keyword) {
    try {
      const response = await axiosService.post("api/admin/sreachListUserKyc", {
        limit: "10",
        page: "1",
        keyWord: keyword,
      });
      setArrayUser(response.data.data);
      setTotalRecord(10);
      setCurrent(1);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllUsersKYC(ROW_PER_TABLE, 1);
  }, []);

  const updateKYC_Approve = async (id) => {
    setLoading2(true);
    try {
      const response = await axiosService.post("api/admin/updateKyc", {
        idKyc: id,
        type: "APPROVED",
      });
      showAlert("success", response.data.message);
      getAllUsersKYC(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading2(false);
      setIsModalVisible(false);
    }
  };

  const updateKYC_Reject = async (id) => {
    setLoading(true);
    try {
      const response = await axiosService.post("api/admin/updateKyc", {
        idKyc: id,
        type: "CANCEL",
      });
      showAlert("success", response.data.message);
      getAllUsersKYC(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  const columns = [
    // {
    //   title: "No.",
    //   key: "No.",
    //   width: 80,
    //   render: (t, r, i) => {
    //     return <span>{i + 1}</span>;
    //   },
    // },
    {
      title: "UserID",
      dataIndex: "userid",
      key: "userid",
      width: 80,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: t("firstName"),
      dataIndex: "firstname",
      key: "firstname",
      width: 150,
    },
    {
      title: t("lastName"),
      dataIndex: "lastname",
      key: "lastname",
      width: 150,
    },
    {
      title: t("gender"),
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (_, { gender }) => {
        if (gender === 0) return <span>{t("male")}</span>;
        if (gender === 1) return <span>{t("female")}</span>;
        return <span>-</span>;
      },
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: t("passport"),
      dataIndex: "passport",
      key: "passport",
      width: 150,
    },
    {
      title: t("status"),
      key: "kyc_status",
      dataIndex: "kyc_status",
      width: 120,
      render: (_, { kyc_status }) => {
        let color;
        if (kyc_status === "PENDING") color = "orange";
        if (kyc_status === "APPROVED") color = "green";
        if (kyc_status === "CANCEL") color = "red";
        return (
          <Tag color={color}>
            <strong>{kyc_status.toUpperCase()}</strong>
          </Tag>
        );
      },
    },
    {
      title: t("action"),
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button size="small" onClick={() => showModal(record)}>
          {t("review")}
        </Button>
      ),
    },
  ];

  const columnsMobile = [
    // {
    //   title: "No.",
    //   key: "No.",
    //   width: 80,
    //   render: (t, r, i) => {
    //     return <span>{i + 1}</span>;
    //   },
    // },
    {
      title: "UserID",
      dataIndex: "userid",
      key: "userid",
      width: 80,
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      width: 100,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: t("firstName"),
      dataIndex: "firstname",
      key: "firstname",
      width: 150,
    },
    {
      title: t("lastName"),
      dataIndex: "lastname",
      key: "lastname",
      width: 150,
    },
    {
      title: t("gender"),
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (_, { gender }) => {
        if (gender === 0) return <span>{t("male")}</span>;
        if (gender === 1) return <span>{t("female")}</span>;
        return <span>-</span>;
      },
    },
    {
      title: t("phone"),
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: t("passport"),
      dataIndex: "passport",
      key: "passport",
      width: 150,
    },
    {
      title: t("status"),
      key: "kyc_status",
      dataIndex: "kyc_status",
      width: 120,
      render: (_, { kyc_status }) => {
        let color;
        if (kyc_status === "PENDING") color = "orange";
        if (kyc_status === "APPROVED") color = "green";
        if (kyc_status === "CANCEL") color = "red";
        return (
          <Tag color={color}>
            <strong>{kyc_status.toUpperCase()}</strong>
          </Tag>
        );
      },
    },
    {
      title: t("action"),
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button size="small" onClick={() => showModal(record)}>
          {t("review")}
        </Button>
      ),
    },
  ];

  const showModal = (record) => {
    setIsModalVisible(true);
    setRecord(record);
  };

  const handleOk_Approve = () => {
    updateKYC_Approve(record.id);
  };
  const handleOk_Reject = () => {
    updateKYC_Reject(record.id);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllUsersKYC(ROW_PER_TABLE, page);
  };

  const onSearch = (keyword) => {
    if (keyword !== "") {
      searchUsersKYC(keyword);
    } else {
      getAllUsersKYC(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  const onChange = (e) => {
    let keyword = e.target.value;
    if (keyword === "") {
      getAllUsersKYC(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  return (
    <div className="kyc-users">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("adKYCUser")}</h2>

        <Search
          placeholder="Search"
          // enterButton
          className="search-box"
          allowClear
          onSearch={onSearch}
          onChange={onChange}
        />

        <Pagination
          defaultCurrent={1}
          current={current}
          total={totalRecord}
          onChange={onPaginationChange}
          showSizeChanger={false}
          showQuickJumper={false}
          className="pagination-box"
        />
      </div>

      <Table
        bordered
        className="manage-kyc-users-table"
        rowClassName="t1-row"
        columns={window.innerWidth < 576 ? columnsMobile : columns}
        dataSource={arrayUser}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 1320,
        }}
      />

      {/* Modal */}
      <Modal
        className="feb2023-modal-kyc-user-no-line"
        title={null}
        closable={false}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        centered
        footer={
          record.kyc_status === "PENDING"
            ? [
                <Button key="cancel" onClick={handleCancel}>
                  {t("close")}
                </Button>,
                <Button key="submitReject" type="primary" danger loading={loading} onClick={handleOk_Reject}>
                  {t("adRejectKYC")}
                </Button>,
                <Button key="submitApprove" type="primary" loading={loading2} onClick={handleOk_Approve}>
                  {t("adApproveKYC")}
                </Button>,
              ]
            : [
                <Button key="cancelBtn" onClick={handleCancel}>
                  {t("close")}
                </Button>,
              ]
        }
      >
        <Descriptions bordered column={window.innerWidth <= 768 ? 1 : 2} size="small">
          <Descriptions.Item label="UserID">{record.userid}</Descriptions.Item>
          <Descriptions.Item label={t("time")}>{record.created_at}</Descriptions.Item>
          <Descriptions.Item label="Username">{record.userName}</Descriptions.Item>
          <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
          <Descriptions.Item label={t("firstName")}>{record.firstname}</Descriptions.Item>
          <Descriptions.Item label={t("lastName")}>{record.lastname}</Descriptions.Item>
          <Descriptions.Item label={t("gender")}>{record.gender}</Descriptions.Item>
          <Descriptions.Item label={t("phone")}>{record.phone}</Descriptions.Item>
          <Descriptions.Item label={t("passport")}>{record.passport}</Descriptions.Item>
          <Descriptions.Item label={t("country")}>{record.country}</Descriptions.Item>
          <Descriptions.Item label={t("status")}>{record.kyc_status}</Descriptions.Item>
          <Descriptions.Item label={t("photoP1")}>
            <Image height={70} src={`${DOMAIN2}${record.front_image}`} />
          </Descriptions.Item>
          <Descriptions.Item label={t("photoP2")}>
            <Image height={70} src={`${DOMAIN2}${record.back_image}`} />
          </Descriptions.Item>
          <Descriptions.Item label={t("photoP3")}>
            <Image height={70} src={`${DOMAIN2}${record.selfie_image}`} />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      {/* End modal */}
    </div>
  );
}

import { Button, Checkbox, Input, Modal, Pagination, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ROW_PER_TABLE } from "../constant/constant.js";
import { getTheme } from "../function/getTheme";
import { localeFixedDown, xx } from "../function/numberFormatter";
import { showAlert } from "../function/showAlert";
import { convertTZtoTimeString } from "../function/timeFormat";
import { useSearchParams } from "../hooks/useSearchParams";
import { axiosService } from "../util/service";

const { Search } = Input;

export default function ManageUsers({ history }) {
  const isDarkTheme = getTheme();
  const { t } = useTranslation();
  const urlUsername = useSearchParams();

  const [arrayUser, setArrayUser] = useState([]);

  // keyword
  const [tuKhoa, setTuKhoa] = useState("");

  // for pagination
  const [current, setCurrent] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  // for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [record, setRecord] = useState(null);
  const [balanceField, setBalanceField] = useState("");
  const [levelField, setLevelField] = useState("");

  const showModal = (record) => {
    setIsModalVisible(true);
    setRecord(record);
    setBalanceField(record.balance);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setRecord(null);
    setBalanceField("");
    setBalance(record.id, balanceField);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRecord(null);
    setBalanceField("");
  };

  // Modal 2

  const showModal2 = (record) => {
    setIsModalVisible2(true);
    setRecord(record);
    setLevelField(record.level);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
    setRecord(null);
    setLevelField("");
    setLevel(record.id, levelField);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
    setRecord(null);
    setLevelField("");
  };

  const handleChangeBalance = (e) => {
    setBalanceField(e.target.value);
  };

  const handleChangeLevel = (e) => {
    setLevelField(e.target.value);
  };

  async function getAllUsers(limit, page) {
    try {
      const response = await axiosService.post("api/admin/getAllUser", {
        limit: limit.toString(),
        page: page.toString(),
      });

      setArrayUser(response.data.data.array);
      setTotalRecord(response.data.data.total);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchUsers(keyword) {
    try {
      const response = await axiosService.post("api/admin/sreachListUser", {
        limit: "100",
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

  async function setLevel(id, level) {
    try {
      const response = await axiosService.post("api/binaryOption/setLevel", {
        id,
        level,
      });
      showAlert("success", response.data.message);

      if (tuKhoa == "") {
        await getAllUsers(ROW_PER_TABLE, current);
      } else {
        await searchUsers(tuKhoa);
      }
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  }

  useEffect(() => {
    if (urlUsername.length > 0) {
      // có từ khoá
      setTuKhoa(urlUsername);
      searchUsers(urlUsername);
    } else {
      // không có từ khoá -> hiển thị all user
      getAllUsers(ROW_PER_TABLE, 1);
    }
  }, [urlUsername]);

  const blockAndUnblockUser = async (id) => {
    try {
      const response = await axiosService.post("api/admin/blockAndUnBlockUser", {
        id: id,
      });
      // showAlert("success", response.data.message);
      getAllUsers(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const activeUser = async (id) => {
    try {
      const response = await axiosService.post("api/admin/activeUser", {
        id: id,
      });
      showAlert("success", response.data.message);
      getAllUsers(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const setBalance = async (id, balance) => {
    try {
      const response = await axiosService.post("api/admin/setBalance", {
        id: id.toString(),
        balance: balance.toString(),
      });
      showAlert("success", response.data.message);

      if (tuKhoa == "") {
        await getAllUsers(ROW_PER_TABLE, current);
      } else {
        await searchUsers(tuKhoa);
      }
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const blockLevel = async (id) => {
    try {
      const response = await axiosService.post("api/admin/blockLevelAndUnBlockLevelUser", {
        id,
      });
      showAlert("success", response.data.message);
      getAllUsers(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const blockTrade = async (id) => {
    try {
      const response = await axiosService.post("api/admin/tradeAndUnTradeUser", {
        id,
      });
      showAlert("success", response.data.message);
      getAllUsers(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const x10Trade = async (id) => {
    try {
      const response = await axiosService.post("api/admin/tradeAndUnTradeUserX10", {
        id,
      });
      showAlert("success", response.data.message);
      getAllUsers(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const restart2FA = async (id) => {
    try {
      const response = await axiosService.post("api/admin/resart2fa", {
        id,
      });
      showAlert("success", response.data.message);
      getAllUsers(ROW_PER_TABLE, current);
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const showHistory = (record) => {
    history.push("/admin/users/" + record.id);
  };

  const setMarketing = async (id) => {
    try {
      const response = await axiosService.post("api/admin/setMarketing", {
        id,
      });
      showAlert("success", response.data.message);

      if (tuKhoa == "") {
        await getAllUsers(ROW_PER_TABLE, current);
      } else {
        await searchUsers(tuKhoa);
      }
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    }
  };

  const columns = [
    {
      title: "No.",
      key: "No.",
      width: 60,
      render: (t, r, i) => {
        return <span>{(current - 1) * 10 + i + 1}</span>;
      },
    },
    {
      title: "Username",
      key: "userName",
      width: 170,
      render: (_, record) => {
        return (
          <>
            {record.block === 1 && (
              <Tooltip title={t("blocked")}>
                <i className="fa-solid fa-lock" style={{ fontSize: 12, color: "red", marginRight: 5 }}></i>
              </Tooltip>
            )}
            <span>{record.userName}</span>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: t("referral"),
      dataIndex: "referral",
      key: "referral",
      width: 170,
    },
    {
      title: t("level"),
      key: "level",
      width: 150,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              {t("level")} {record.level}
            </span>
            <Tooltip title="Edit level">
              <i className="fa-solid fa-pen-to-square" onClick={() => showModal2(record)}></i>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Marketing",
      key: "Marketing",
      width: 100,
      render: (_, { marketing, id }) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Checkbox checked={marketing == 0 ? false : true} onChange={(e) => setMarketing(id)} />
          </div>
        );
      },
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      key: "balance",
      width: 150,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>$ {localeFixedDown(record?.balance, 2, ",")}</span>
            <Tooltip title="Edit balance">
              <i className="fa-solid fa-pen-to-square" onClick={() => showModal(record)}></i>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Before Total Order",
      key: "Before Total Order",
      dataIndex: "beforeTotalOrder",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: "Before Commission",
      key: "Before Commission",
      dataIndex: "beforeCommission",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: "Total Order",
      key: "Total Order",
      dataIndex: "totalOrder",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: "Commission Balance",
      key: "Commission Balance",
      dataIndex: "commissionBalance",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: t("time"),
      dataIndex: "created_at",
      key: "created_at",
      width: 170,
      render: (time) => {
        return <span>{convertTZtoTimeString(time)}</span>;
      },
    },
    {
      title: t("adParentName"),
      key: "userNameParent",
      width: 200,
      dataIndex: "userNameParent",
    },
    {
      title: t("active"),
      dataIndex: "active",
      key: "active",
      width: 80,
      render: (_, record) => {
        if (record.active === 0) {
          return (
            <Button size="small" onClick={() => activeUser(record.id)}>
              {t("active")}
            </Button>
          );
        } else {
          return (
            <Tag color={"green"}>
              <strong>{t("actived")}</strong>
            </Tag>
          );
        }
      },
    },
    {
      title: t("block"),
      dataIndex: "block",
      key: "block_action",
      width: 90,
      render: (_, record) => {
        if (record.block === 0) {
          return (
            <Button size="small" onClick={() => blockAndUnblockUser(record.id)}>
              {t("block")}
            </Button>
          );
        } else {
          return (
            <Button size="small" onClick={() => blockAndUnblockUser(record.id)}>
              {t("unblock")}
            </Button>
          );
        }
      },
    },
    {
      title: t("history"),
      key: "action_1",
      width: 100,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => showHistory(record)}>
            {t("history")}
          </Button>
        );
      },
    },
    {
      title: "Block level",
      key: "action_2",
      width: 120,
      render: (_, record) => {
        if (record.blockLevel == 1) {
          return (
            <Button size="small" onClick={() => blockLevel(record.id)}>
              Unblock level
            </Button>
          );
        } else if (record.blockLevel == 0) {
          return (
            <Button size="small" onClick={() => blockLevel(record.id)}>
              Block level
            </Button>
          );
        }
      },
    },
    {
      title: "Block trade",
      key: "action_3",
      width: 120,
      render: (_, record) => {
        if (record.trade == 1) {
          return (
            <Button size="small" onClick={() => blockTrade(record.id)}>
              Unblock trade
            </Button>
          );
        } else if (record.trade == 0) {
          return (
            <Button size="small" onClick={() => blockTrade(record.id)}>
              Block trade
            </Button>
          );
        }
      },
    },
    {
      title: "Trade x10",
      key: "action_4",
      width: 120,
      render: (_, record) => {
        if (record.double10 == 1) {
          return (
            <Button size="small" onClick={() => x10Trade(record.id)}>
              x1
            </Button>
          );
        } else if (record.double10 == 0) {
          return (
            <Button size="small" onClick={() => x10Trade(record.id)}>
              x10
            </Button>
          );
        }
      },
    },
    {
      title: "Restart 2FA",
      key: "action_5",
      width: 120,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => restart2FA(record.id)}>
            Restart 2FA
          </Button>
        );
      },
    },
    {
      title: t("network"),
      key: "Network",
      width: 120,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => history.push("/admin/user-network/" + record.id)}>
            {t("network")}
          </Button>
        );
      },
    },
  ];

  const columnsMobile = [
    {
      title: "No.",
      key: "No.",
      width: 60,
      render: (t, r, i) => {
        return <span>{(current - 1) * 10 + i + 1}</span>;
      },
    },
    {
      title: "Username",
      key: "userName",
      width: 170,
      render: (_, record) => {
        return (
          <>
            {record.block === 1 && (
              <i className="fa-solid fa-lock" style={{ fontSize: 12, color: "red", marginRight: 5 }}></i>
            )}
            <span>{record.userName}</span>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: t("referral"),
      dataIndex: "referral",
      key: "referral",
      width: 170,
    },
    {
      title: t("level"),
      key: "level",
      width: 150,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              {t("level")} {record.level}
            </span>
            <i className="fa-solid fa-pen-to-square" onClick={() => showModal2(record)}></i>
          </div>
        );
      },
    },
    {
      title: "Marketing",
      key: "Marketing",
      width: 100,
      render: (_, { marketing, id }) => {
        return (
          <div style={{ textAlign: "center" }}>
            <Checkbox checked={marketing == 0 ? false : true} onChange={(e) => setMarketing(id)} />
          </div>
        );
      },
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      key: "balance",
      width: 150,
      render: (_, record) => {
        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>$ {localeFixedDown(record?.balance, 2, ",")}</span>
            <i className="fa-solid fa-pen-to-square" onClick={() => showModal(record)}></i>
          </div>
        );
      },
    },
    {
      title: "Before Total Order",
      key: "Before Total Order",
      dataIndex: "beforeTotalOrder",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: "Before Commission",
      key: "Before Commission",
      dataIndex: "beforeCommission",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: "Total Order",
      key: "Total Order",
      dataIndex: "totalOrder",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: "Commission Balance",
      key: "Commission Balance",
      dataIndex: "commissionBalance",
      width: 100,
      render: (num) => xx(num),
    },
    {
      title: t("time"),
      dataIndex: "created_at",
      key: "created_at",
      width: 170,
      render: (time) => {
        return <span>{convertTZtoTimeString(time)}</span>;
      },
    },
    {
      title: t("adParentName"),
      key: "userNameParent",
      width: 200,
      dataIndex: "userNameParent",
    },
    {
      title: t("active"),
      dataIndex: "active",
      key: "active",
      width: 80,
      render: (_, record) => {
        if (record.active === 0) {
          return (
            <Button size="small" onClick={() => activeUser(record.id)}>
              {t("active")}
            </Button>
          );
        } else {
          return (
            <Tag color={"green"}>
              <strong>{t("actived")}</strong>
            </Tag>
          );
        }
      },
    },
    {
      title: t("block"),
      dataIndex: "block",
      key: "block_action",
      width: 90,
      render: (_, record) => {
        if (record.block === 0) {
          return (
            <Button size="small" onClick={() => blockAndUnblockUser(record.id)}>
              {t("block")}
            </Button>
          );
        } else {
          return (
            <Button size="small" onClick={() => blockAndUnblockUser(record.id)}>
              {t("unblock")}
            </Button>
          );
        }
      },
    },
    {
      title: t("history"),
      key: "action_1",
      width: 100,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => showHistory(record)}>
            {t("history")}
          </Button>
        );
      },
    },
    {
      title: "Block level",
      key: "action_2",
      width: 120,
      render: (_, record) => {
        if (record.blockLevel == 1) {
          return (
            <Button size="small" onClick={() => blockLevel(record.id)}>
              Unblock level
            </Button>
          );
        } else if (record.blockLevel == 0) {
          return (
            <Button size="small" onClick={() => blockLevel(record.id)}>
              Block level
            </Button>
          );
        }
      },
    },
    {
      title: "Block trade",
      key: "action_3",
      width: 120,
      render: (_, record) => {
        if (record.trade == 1) {
          return (
            <Button size="small" onClick={() => blockTrade(record.id)}>
              Unblock trade
            </Button>
          );
        } else if (record.trade == 0) {
          return (
            <Button size="small" onClick={() => blockTrade(record.id)}>
              Block trade
            </Button>
          );
        }
      },
    },
    {
      title: "Trade x10",
      key: "action_4",
      width: 120,
      render: (_, record) => {
        if (record.double10 == 1) {
          return (
            <Button size="small" onClick={() => x10Trade(record.id)}>
              x1
            </Button>
          );
        } else if (record.double10 == 0) {
          return (
            <Button size="small" onClick={() => x10Trade(record.id)}>
              x10
            </Button>
          );
        }
      },
    },
    {
      title: "Restart 2FA",
      key: "action_5",
      width: 120,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => restart2FA(record.id)}>
            Restart 2FA
          </Button>
        );
      },
    },
    {
      title: t("network"),
      key: "Network",
      width: 120,
      render: (_, record) => {
        return (
          <Button size="small" onClick={() => history.push("/admin/user-network/" + record.id)}>
            {t("network")}
          </Button>
        );
      },
    },
  ];

  const onSearch = (keyword) => {
    if (keyword !== "") {
      searchUsers(keyword);
    } else {
      getAllUsers(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  const onChange = (e) => {
    let keyword = e.target.value;
    setTuKhoa(keyword);

    if (keyword === "") {
      getAllUsers(ROW_PER_TABLE, 1);
      setCurrent(1);
    }
  };

  const onPaginationChange = (page) => {
    setCurrent(page);
    getAllUsers(ROW_PER_TABLE, page);
  };

  return (
    <div className="all-users">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("allUser")}</h2>

        <Search
          placeholder="Search"
          className="search-box"
          allowClear
          onSearch={onSearch}
          onChange={onChange}
          value={tuKhoa}
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
        size={window.innerWidth < 576 ? "middle" : "large"}
        columns={window.innerWidth < 576 ? columnsMobile : columns}
        dataSource={arrayUser}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{
          x: 2800,
        }}
        className="manage-all-users-table"
        rowClassName="t1-row"
        bordered
      />

      {/* Modal */}
      <Modal title={t("editbalance")} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} centered>
        <div className="field balance_field">
          <label htmlFor="balance_field">{t("balance")}</label>
          <Input
            size="large"
            id="balance_field"
            name="balance_field"
            addonBefore="$"
            value={balanceField}
            onChange={handleChangeBalance}
          />
        </div>
      </Modal>
      {/* End modal */}

      {/* Modal 2 */}
      <Modal title={t("editlevel")} visible={isModalVisible2} onOk={handleOk2} onCancel={handleCancel2} centered>
        <div className="field level_field">
          <label htmlFor="level_field">{t("level")}</label>
          <Input id="level_field" name="level_field" value={levelField} onChange={handleChangeLevel} size="large" />
        </div>
      </Modal>
      {/* End modal 2 */}
    </div>
  );
}

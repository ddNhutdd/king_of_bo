import { Button, Form, Input, Radio, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ROW_PER_TABLE } from "../../constant/constant";
import { xx3 } from "../../function/numberFormatter";
import { axiosService } from "../../util/service";

export default function VIPNetwork() {
  const { t } = useTranslation();

  const { user } = useSelector((root) => root.userReducer);

  const [loading, setLoading] = useState(false);

  const [searchBy, setSearchBy] = useState("byLevel");
  const [levelValue, setLevelValue] = useState(1);
  const [userNameValue, setUserNameValue] = useState("");
  const [timeRange, setTimeRange] = useState("alltime");

  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState(1); // 1 là lấy tất cả phân trang // 2 là tìm theo tên // 3 là tìm theo level

  const getListParent = async (limit, page) => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/user/getParentList", { userid: user?.id, limit, page });
      setData(response.data.data.array);
      setTotal(response.data.data.total);
      setMode(1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchListParent_byName = async (userid, limit, page, userName) => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/user/getParentListToUserName", { userid, limit, page, userName });
      setData(response.data.data.array);
      setTotal(response.data.data.total);
      setMode(2);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const searchListParent_byLevel = async (userid, limit, page, level) => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/user/getParentListToLevel", { userid, limit, page, level });
      setData(response.data.data.array);
      setTotal(response.data.data.total);
      setMode(3);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListParent(ROW_PER_TABLE, 1);
  }, []);

  const options = [
    {
      label: t("level"),
      value: "byLevel",
    },
    {
      label: t("username"),
      value: "byUsername",
    },
  ];
  const options2 = [
    {
      label: t("yesterday"),
      value: "yesterday",
    },
    {
      label: t("last7days"),
      value: "last7days",
    },
    {
      label: t("last30days"),
      value: "last30days",
    },
    {
      label: t("alltime"),
      value: "alltime",
    },
  ];
  const columns = [
    {
      key: "Username",
      title: t("username"),
      dataIndex: "userName",
      width: 150,
    },
    {
      title: t("level"),
      key: "Level",
      dataIndex: "level",
      width: 150,
    },
    {
      key: "Total Vol",
      title: t("total"),
      width: 150,
      render: (_, record) => {
        if (timeRange == "alltime") return xx3(record.totalOrder);
        else if (timeRange == "last30days") return record.totalOrder30Day ? xx3(record.totalOrder30Day) : 0;
        else if (timeRange == "last7days") return record.totalOrder7Day ? xx3(record.totalOrder7Day) : 0;
        else if (timeRange == "yesterday") return xx3(record.beforeTotalOrder);
      },
    },
    {
      title: t("Commission Balance"),
      key: "Commission Balance",
      width: 150,
      render: (_, record) => {
        if (timeRange == "alltime") return xx3(record.totalCommission);
        else if (timeRange == "last30days")
          return record.commissionBalance30Day ? xx3(record.commissionBalance30Day) : 0;
        else if (timeRange == "last7days") return record.commissionBalance7Day ? xx3(record.commissionBalance7Day) : 0;
        else if (timeRange == "yesterday") return xx3(record.beforeCommission);
      },
    },
  ];

  const onRadChange = ({ target: { value } }) => {
    setSearchBy(value);
  };
  const handleSelectChange = (value) => {
    setLevelValue(value);
  };

  const handleSearch = async () => {
    if (searchBy == "byLevel") {
      setCurrent(1);
      await searchListParent_byLevel(user?.id, ROW_PER_TABLE, 1, levelValue);
    } else if (searchBy == "byUsername") {
      setCurrent(1);
      await searchListParent_byName(user?.id, ROW_PER_TABLE, 1, userNameValue);
    }
  };

  const handleChangeTimeRange = (e) => setTimeRange(e.target.value);

  const handleReset = () => {
    setLoading(false);
    setSearchBy("byLevel");
    setLevelValue(1);
    setUserNameValue("");
    setTimeRange("alltime");
    setMode(1);
    setCurrent(1);
    getListParent(ROW_PER_TABLE, 1);
  };

  return (
    <div className="vip-network-container">
      <div className="title">
        <h1>{t("manageAffiliate")}</h1>
      </div>

      <div className="search-area">
        <div className="search-type">
          <p>{t("searchBy")}</p>
          <Radio.Group
            options={options}
            value={searchBy}
            onChange={onRadChange}
            optionType="button"
            size={window.innerWidth <= 992 ? "middle" : "large"}
          />
        </div>

        <div className="divider"></div>

        <div className="search-main">
          {searchBy == "byLevel" && (
            <div className="search-by-level">
              <p>{t("searchBy1")}</p>
              <Select
                defaultValue={1}
                value={levelValue}
                style={{
                  width: 220,
                }}
                size={window.innerWidth <= 992 ? "middle" : "large"}
                onChange={handleSelectChange}
                options={[
                  {
                    value: 1,
                    label: t("level") + " 1",
                  },
                  {
                    value: 2,
                    label: t("level") + " 2",
                  },
                  {
                    value: 3,
                    label: t("level") + " 3",
                  },
                  {
                    value: 4,
                    label: t("level") + " 4",
                  },
                  {
                    value: 5,
                    label: t("level") + " 5",
                  },
                  {
                    value: 6,
                    label: t("level") + " 6",
                  },
                  {
                    value: 7,
                    label: t("level") + " 7",
                  },
                ]}
              />
            </div>
          )}

          {searchBy == "byUsername" && (
            <div className="search-by-username">
              <p>{t("searchBy2")}</p>
              <Form onFinish={() => handleSearch()}>
                <Input
                  value={userNameValue}
                  onChange={(e) => setUserNameValue(e.target.value)}
                  style={{ width: 220 }}
                  size={window.innerWidth <= 992 ? "middle" : "large"}
                  placeholder={t("enterUsername")}
                />
              </Form>
            </div>
          )}
        </div>

        <div className="divider"></div>

        <Button size={window.innerWidth <= 992 ? "middle" : "large"} type="primary" onClick={handleSearch}>
          {t("search")}
        </Button>

        <Button
          size={window.innerWidth <= 992 ? "middle" : "large"}
          type="text"
          style={{ marginLeft: 10, fontWeight: 600 }}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>

      <div className="search-result">
        <div className="time-range">
          <Radio.Group options={options2} value={timeRange} optionType="button" onChange={handleChangeTimeRange} />
        </div>

        <Table
          loading={loading}
          className="vip-network-table-2"
          rowClassName="t2-row"
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.id}
          scroll={window.innerWidth <= 768 ? {} : { x: 600 }}
          pagination={{
            position: ["bottomRight"],
            total,
            current,
            hideOnSinglePage: false,
            showSizeChanger: false,
            showQuickJumper: false,
            showLessItems: true,
            pageSize: ROW_PER_TABLE,
            onChange: async (page) => {
              setCurrent(page);
              if (mode == 1) {
                await getListParent(ROW_PER_TABLE, page);
              } else if (mode == 2) {
                await searchListParent_byName(user?.id, ROW_PER_TABLE, page, userNameValue);
              } else if (mode == 3) {
                await searchListParent_byLevel(user?.id, ROW_PER_TABLE, page, levelValue);
              }
            },
          }}
        />
      </div>
    </div>
  );
}

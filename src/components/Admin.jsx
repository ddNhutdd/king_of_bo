import { Button, Descriptions, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deepSearch } from "../function/deepSearch";
import { getTheme } from "../function/getTheme";
import { localeFixed } from "../function/numberFormatter";
import { axiosService } from "../util/service";

const LIMIT = 50;
const LIMIT_1000 = 10000;

export default function Admin() {
  const [network, setNetwork] = useState([]);
  const [data, setData] = useState({});

  const { t } = useTranslation();
  const history = useHistory();

  const [valueConfigWin, setValueConfigWin] = useState(0);
  const [valueConfigLose, setValueConfigLose] = useState(0);
  const [valueConfigProfit, setValueConfigProfit] = useState(0);

  const isDarkTheme = getTheme();

  const [loading, setLoading] = useState(false);

  const [current, setCurrent] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const { user } = useSelector((root) => root.userReducer);

  // hàm getNetwork cho admin
  const getNetwork = async (page) => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/user/getParentF1", {
        userid: 1,
        page,
        limit: LIMIT,
      });
      setNetwork([...network, ...response.data.data.array]);
      setTotalPage(Math.ceil(response.data.data.total / LIMIT));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // hàm getNetwork cho user cấp dưới của admin
  const getNetworkDownline = async (userid, page) => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/user/getParentF1", {
        userid,
        page,
        limit: LIMIT_1000,
      });

      if (response.data.data.array.length > 0) {
        const item = deepSearch(network, userid, "id");
        item.array = response.data.data.array;
        setNetwork([...network]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const pageToLoadMore = current + 1;
    getNetwork(pageToLoadMore);
    setCurrent(pageToLoadMore);
  };

  const loadExpansion = (id) => {
    getNetworkDownline(id, 1);
  };

  const clearExpansion = (id) => {
    const item = deepSearch(network, id, "id");
    item.array = undefined;
    setNetwork([...network]);
  };

  useEffect(() => {
    getNetwork(1);
    getAPI();

    getValueConfig("win");
    getValueConfig("lose");
    getValueConfig("profit");
  }, []);

  const renderTree = (array) => {
    return array.map((item, index) => {
      if (item.array) {
        return (
          <li key={index}>
            <div>
              <i className="fa-solid fa-user"></i>{" "}
              <span>
                <span className="item-name" onClick={() => history.push("/admin/manage-users?user=" + item.userName)}>
                  {item.userName}
                </span>{" "}
                <span className="item-mail">{item.email}</span>
              </span>
              <Button
                shape="round"
                size="small"
                danger
                style={{ marginLeft: 10, padding: "0 5px" }}
                onClick={() => clearExpansion(item.id)}
              >
                <i className="fa-solid fa-minus"></i>
              </Button>
            </div>
            <ul>{renderTree(item.array)}</ul>
          </li>
        );
      } else
        return (
          <li key={index}>
            <i className="fa-solid fa-user"></i>{" "}
            <span>
              <span className="item-name" onClick={() => history.push("/admin/manage-users?user=" + item.userName)}>
                {item.userName}
              </span>{" "}
              <span className="item-mail">{item.email}</span>
            </span>
            {item.checkParentUser && (
              <Button
                shape="round"
                size="small"
                style={{ marginLeft: 10, padding: "0 5px" }}
                onClick={() => loadExpansion(item.id)}
              >
                <i className="fa-solid fa-plus"></i>
              </Button>
            )}
          </li>
        );
    });
  };

  const getAPI = async () => {
    try {
      let response = await axiosService.post("api/admin/getStatistical");
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getValueConfig = async (string) => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", { name: string });

      const value = response.data.data[0].value;

      if (string == "win") {
        setValueConfigWin(value);
      } else if (string == "lose") {
        setValueConfigLose(value);
      } else if (string == "profit") {
        setValueConfigProfit(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("network")}</h2>

        <div className={isDarkTheme ? "tree dark" : "tree"}>
          <ul>
            <li>
              <i className="fa-solid fa-user"></i>
              <span>
                <span className="item-name" onClick={() => history.push("/admin/manage-users?user=" + user?.userName)}>
                  {user?.userName}
                </span>{" "}
                <span className="item-mail">{user?.email}</span>
              </span>
              {network.length && <ul>{renderTree(network)}</ul>}

              {current < totalPage && (
                <Button
                  size="small"
                  onClick={() => loadMore()}
                  shape="round"
                  style={{ marginTop: 10 }}
                  loading={loading}
                >
                  <i className="fa-solid fa-plus" style={{ marginRight: 5 }}></i>
                  More
                </Button>
              )}
            </li>
          </ul>
        </div>
      </div>

      {loading && (
        <div className="fullpage-loading">
          <Spin size="large" />
        </div>
      )}

      <div className="static">
        <h2 className={isDarkTheme ? "title dark" : "title"}>{t("staticstics")}</h2>

        <Descriptions bordered column={window.innerWidth <= 992 ? 1 : 2}>
          <Descriptions.Item label={t("adTotalBalance")}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>$ {localeFixed(data?.balance, 2, ",")}</span>
          </Descriptions.Item>

          <Descriptions.Item label={t("adTotalCommission")}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>$ {localeFixed(data?.commissionBalance, 2, ",")}</span>
          </Descriptions.Item>

          <Descriptions.Item label={t("adTotalDeposit")}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>$ {localeFixed(data?.deposit, 2, ",")}</span>
          </Descriptions.Item>

          <Descriptions.Item label={t("adTotalWithdraw")}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>$ {localeFixed(data?.widthdraw, 2, ",")}</span>
          </Descriptions.Item>

          <Descriptions.Item label={t("adWin")}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>$ {localeFixed(valueConfigWin, 2, ",")}</span>
          </Descriptions.Item>

          <Descriptions.Item label={t("adLose")}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>$ {localeFixed(valueConfigLose, 2, ",")}</span>
          </Descriptions.Item>

          <Descriptions.Item label={t("profit")}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>$ {localeFixed(valueConfigProfit, 2, ",")}</span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
}

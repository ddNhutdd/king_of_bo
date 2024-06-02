import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { axiosService } from "../../util/service";
import General from "./General";
import VIPCommission from "./VIPCommission";
import VIPNetwork from "./VIPNetwork";

export default function VIP() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [defaultKey, setDefaultKey] = useState("1");

  const { user } = useSelector((root) => root.userReducer);

  const getProfileAPI = async () => {
    try {
      let response = await axiosService.post("api/user/getProfile");
      dispatch({
        type: "UPDATE_USER_LEVEL",
        payload: response.data.data.level,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onTabChange = (activeKey) => {
    if (activeKey == "1") {
      history.push("/user/vip-general");
    } else if (activeKey == "2") {
      history.push("/user/vip-commission");
    } else if (activeKey == "3") {
      history.push("/user/vip-network-management");
    }
  };

  const getDefaultKey = () => {
    if (history.location.pathname == "/user/vip-general") {
      setDefaultKey("1");
    } else if (history.location.pathname == "/user/vip-commission") {
      setDefaultKey("2");
    } else if (history.location.pathname == "/user/vip-network-management") {
      setDefaultKey("3");
    } else {
      setDefaultKey("1");
    }
  };

  useEffect(() => {
    getProfileAPI();
  }, []);

  useEffect(() => {
    getDefaultKey();
  }, [location]);

  if (user?.level == 0) {
    // user chưa mua vip
    return <Redirect to={"/user/affiliate"} />;
  }

  return (
    <Tabs activeKey={defaultKey} size={window.innerWidth <= 576 ? "small" : "large"} type="card" onChange={onTabChange}>
      <Tabs.TabPane tab={t("vvipGeneral")} key="1">
        <General />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("vvipCommission")} key="2">
        <VIPCommission />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("vvipNetwork")} key="3">
        <VIPNetwork />
      </Tabs.TabPane>
    </Tabs>
  );
}

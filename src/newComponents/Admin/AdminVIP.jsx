import { Tabs } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import AdminVIPCommission from "./AdminVIPCommission";
import AdminVIPGeneral from "./AdminVIPGeneral";
import AdminVIPNetwork from "./AdminVIPNetwork";

export default function AdminVIP() {
  const { t } = useTranslation();

  return (
    <Tabs defaultActiveKey="1" size={window.innerWidth <= 576 ? "small" : "large"} type="card">
      <Tabs.TabPane tab={t("vvipGeneral")} key="1">
        <AdminVIPGeneral />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("vvipCommission")} key="2">
        <AdminVIPCommission />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t("vvipNetwork")} key="3">
        <AdminVIPNetwork />
      </Tabs.TabPane>
    </Tabs>
  );
}

import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showAlert } from "../../function/showAlert";
import { axiosService } from "../../util/service";

export default function SendNoti() {
  const { t } = useTranslation();
  const [notiReceiverType, setNotiReceiverType] = useState("all"); // all hoặc one
  const [noti, setNoti] = useState({
    address: "",
    titleV: "",
    contentV: "",
    titleE: "",
    contentE: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSendNoti = () => {
    if (notiReceiverType == "one" && !noti.address) {
      showAlert("error", t("warning1"));
      return;
    }
    if (!noti.titleE) {
      showAlert("error", t("warning4"));
      return;
    }
    if (!noti.contentE) {
      showAlert("error", t("warning5"));
      return;
    }
    if (!noti.titleV) {
      showAlert("error", t("warning6"));
      return;
    }
    if (!noti.contentV) {
      showAlert("error", t("warning7"));
      return;
    }

    if (notiReceiverType == "all") {
      Modal.confirm({
        title: <div style={{ fontSize: 18, fontWeight: 600 }}>{t("confirm")}</div>,
        icon: <QuestionCircleFilled />,
        content: (
          <span style={{ fontSize: 15 }}>
            {t("cf1")} <b>{t("allusers")}</b>?
          </span>
        ),
        okText: t("sendNoti"),
        cancelText: t("cancel"),
        cancelButtonProps: { size: "large" },
        okButtonProps: { size: "large" },
        onOk: async () => {
          await sendNotiToAllUser();
        },
      });
    } else if (notiReceiverType == "one") {
      Modal.confirm({
        title: <div style={{ fontSize: 18, fontWeight: 600 }}>{t("confirm")}</div>,
        icon: <QuestionCircleFilled />,
        content: (
          <span style={{ fontSize: 15 }}>
            {t("cf1")} <b>{noti.address}</b>?
          </span>
        ),
        okText: t("sendNoti"),
        cancelText: t("cancel"),
        cancelButtonProps: { size: "large" },
        okButtonProps: { size: "large" },
        onOk: async () => {
          await sendNotiToAddress();
        },
      });
    }
  };

  const sendNotiToAllUser = async () => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/admin/sendNotificationAllUser", {
        titleVN: noti.titleV,
        messageVN: noti.contentV,
        titleEN: noti.titleE,
        messageEN: noti.contentE,
      });
      showAlert("success", response.data.message);

      // reset
      setNoti({
        address: "",
        titleV: "",
        contentV: "",
        titleE: "",
        contentE: "",
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const sendNotiToAddress = async () => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/admin/sendNotificationToEmail", {
        titleVN: noti.titleV,
        messageVN: noti.contentV,
        titleEN: noti.titleE,
        messageEN: noti.contentE,
        email: noti.address,
      });
      showAlert("success", response.data.message);

      // reset
      setNoti({
        address: "",
        titleV: "",
        contentV: "",
        titleE: "",
        contentE: "",
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (notiReceiverType == "all") {
      setNoti({ ...noti, address: "" });
    }
  }, [notiReceiverType]);

  return (
    <div className="admin-sendtouser-noti">
      <div className="ezone-1">
        <div className="noti-receiver">
          <p>{t("sendNotiTo")}</p>
          <Select
            size="large"
            defaultValue="all"
            style={{
              width: 180,
            }}
            onChange={(value) => setNotiReceiverType(value)}
            options={[
              {
                value: "all",
                label: t("allusers"),
              },
              {
                value: "one",
                label: t("emailAddress"),
              },
            ]}
          />
        </div>

        <div className="email-address">
          <Input
            placeholder={notiReceiverType == "all" ? "" : t("enterEmail")}
            disabled={notiReceiverType == "all"}
            style={notiReceiverType == "all" ? { display: "none" } : {}}
            size="large"
            value={noti.address}
            onChange={(e) => setNoti({ ...noti, address: e.target.value })}
          />
        </div>
      </div>

      <div className="ezone-2">
        <div className="ezone2-title">
          <p>{t("titleEN")}</p>
          <Input
            allowClear
            size="large"
            placeholder={t("titleEN")}
            value={noti.titleE}
            onChange={(e) => setNoti({ ...noti, titleE: e.target.value })}
          />
        </div>

        <div className="ezone2-content">
          <p>{t("contentEN")}</p>
          <Input.TextArea
            allowClear
            rows={2}
            size="large"
            placeholder={t("contentEN")}
            value={noti.contentE}
            onChange={(e) => setNoti({ ...noti, contentE: e.target.value })}
          />
        </div>

        <div className="ezone2-title">
          <p>{t("titleVN")}</p>
          <Input
            allowClear
            size="large"
            placeholder={t("titleVN")}
            value={noti.titleV}
            onChange={(e) => setNoti({ ...noti, titleV: e.target.value })}
          />
        </div>

        <div className="ezone2-content">
          <p>{t("contentVN")}</p>
          <Input.TextArea
            allowClear
            rows={2}
            size="large"
            placeholder={t("contentVN")}
            value={noti.contentV}
            onChange={(e) => setNoti({ ...noti, contentV: e.target.value })}
          />
        </div>
      </div>

      <div className="ezone-3">
        <Button size="large" type="primary" onClick={handleSendNoti} loading={loading}>
          <i className="fa-solid fa-paper-plane" style={{ marginRight: 10 }}></i>
          {t("sendNoti")}
        </Button>
      </div>
    </div>
  );
}

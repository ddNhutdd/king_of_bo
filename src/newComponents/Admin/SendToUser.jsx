import { QuestionCircleFilled } from "@ant-design/icons";
import { Button, Input, Modal, Select, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showAlert } from "../../function/showAlert";
import { axiosService } from "../../util/service";
import SendNoti from "./SendNoti";

export default function SendToUser() {
  const { t } = useTranslation();
  const [emailReceiverType, setEmailReceiverType] = useState("all"); // all hoặc one
  const [email, setEmail] = useState({
    address: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSendEmail = () => {
    if (emailReceiverType == "one" && !email.address) {
      showAlert("error", t("warning1"));
      return;
    }
    if (!email.title) {
      showAlert("error", t("warning2"));
      return;
    }
    if (!email.content) {
      showAlert("error", t("warning3"));
      return;
    }

    if (emailReceiverType == "all") {
      Modal.confirm({
        title: <div style={{ fontSize: 18, fontWeight: 600 }}>{t("confirm")}</div>,
        icon: <QuestionCircleFilled />,
        content: (
          <span style={{ fontSize: 15 }}>
            {t("cf2")} <b>{t("allusers")}</b>?
          </span>
        ),
        okText: t("sendEmail"),
        cancelText: t("cancel"),
        cancelButtonProps: { size: "large" },
        okButtonProps: { size: "large" },
        onOk: async () => {
          await sendEmailToAllUser();
        },
      });
    } else if (emailReceiverType == "one") {
      Modal.confirm({
        title: <div style={{ fontSize: 18, fontWeight: 600 }}>{t("confirm")}</div>,
        icon: <QuestionCircleFilled />,
        content: (
          <span style={{ fontSize: 15 }}>
            {t("cf2")} <b>{email.address}</b>?
          </span>
        ),
        okText: t("sendEmail"),
        cancelText: t("cancel"),
        cancelButtonProps: { size: "large" },
        okButtonProps: { size: "large" },
        onOk: async () => {
          await sendEmailToEmail();
        },
      });
    }
  };

  const sendEmailToAllUser = async () => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/admin/sendEmailAllUser", {
        title: email.title,
        message: email.content,
      });
      showAlert("success", response.data.message);

      // reset
      setEmail({
        address: "",
        title: "",
        content: "",
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailToEmail = async () => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/admin/sendEmailToEmail", {
        title: email.title,
        message: email.content,
        email: email.address,
      });
      showAlert("success", response.data.message);

      // reset
      setEmail({
        address: "",
        title: "",
        content: "",
      });
    } catch (error) {
      console.log(error);
      showAlert("error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emailReceiverType == "all") {
      setEmail({ ...email, address: "" });
    }
  }, [emailReceiverType]);

  return (
    <Tabs defaultActiveKey="1" size={window.innerWidth <= 576 ? "small" : "large"} type="card">
      <Tabs.TabPane tab={t("sendEmail")} key="1">
        <div className="admin-sendtouser-email">
          <div className="ezone-1">
            <div className="email-receiver">
              <p>{t("sendEmailTo")}</p>
              <Select
                size="large"
                defaultValue="all"
                style={{
                  width: 180,
                }}
                onChange={(value) => setEmailReceiverType(value)}
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
                placeholder={emailReceiverType == "all" ? "" : t("enterEmail")}
                disabled={emailReceiverType == "all"}
                style={emailReceiverType == "all" ? { display: "none" } : {}}
                size="large"
                value={email.address}
                onChange={(e) => setEmail({ ...email, address: e.target.value })}
              />
            </div>
          </div>

          <div className="ezone-2">
            <div className="ezone2-title">
              <p>{t("title")}</p>
              <Input
                allowClear
                size="large"
                placeholder={t("title")}
                value={email.title}
                onChange={(e) => setEmail({ ...email, title: e.target.value })}
              />
            </div>

            <div className="ezone2-content">
              <p>{t("content")}</p>
              <Input.TextArea
                allowClear
                rows={6}
                size="large"
                placeholder={t("content")}
                value={email.content}
                onChange={(e) => setEmail({ ...email, content: e.target.value })}
              />
            </div>
          </div>

          <div className="ezone-3">
            <Button size="large" type="primary" onClick={handleSendEmail} loading={loading}>
              <i className="fa-solid fa-paper-plane" style={{ marginRight: 10 }}></i>
              {t("sendEmail")}
            </Button>
          </div>
        </div>
      </Tabs.TabPane>

      <Tabs.TabPane tab={t("sendNoti")} key="2">
        <SendNoti />
      </Tabs.TabPane>
    </Tabs>
  );
}

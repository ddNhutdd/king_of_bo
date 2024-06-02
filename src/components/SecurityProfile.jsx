import { Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { showErrorToast, showSuccessToast } from "../function/showToastify";
import { axiosService } from "../util/service";

export default function SecurityProfile() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.userReducer);

  const [info, setInfo] = useState({ password: "", newPassword: "" });
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [step, setStep] = useState(1);

  const changePassword = async (info) => {
    try {
      let response = await axiosService.post("/api/user/changePassword", info);
      showSuccessToast(response.data.message);
      setInfo({ password: "", newPassword: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    }
  };

  const generateOTPToken = async () => {
    try {
      let response = await axiosService.post("api/user/generateOTPToken");
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Modal đổi mật khẩu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setInfo({ password: "", newPassword: "" });
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    await changePassword(info);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Modal đổi mật khẩu

  // Modal 2FA: đang bật -> tắt
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = () => {
    setCode("");
    setIsModalOpen2(true);
  };
  const handleOk2 = async () => {
    await turnOff2FA_API(code);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  // Modal 2FA: đang bật -> tắt

  // Modal 2FA: đang tắt -> bật
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const showModal3 = () => {
    setStep(1);
    setCode("");
    generateOTPToken();
    setIsModalOpen3(true);
  };
  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };
  // Modal 2FA: đang tắt -> bật

  const getProfileAPI = async () => {
    try {
      let response = await axiosService.post("api/user/getProfile");
      dispatch({
        type: "UPDATE_USER_2FA",
        payload: response.data.data.twofa,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const turnOff2FA_API = async (code) => {
    try {
      let response = await axiosService.post("api/user/turn2FA", {
        otp: code,
      });
      handleCancel2();
      showSuccessToast(response.data.message);
      dispatch({
        type: "2FA_STATUS_CHANGED",
        payload: 0,
      });
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    }
  };

  const turnOn2FA_API = async (code) => {
    try {
      let response = await axiosService.post("api/user/turn2FA", {
        otp: code,
      });
      handleCancel3();
      showSuccessToast(response.data.message);
      dispatch({
        type: "2FA_STATUS_CHANGED",
        payload: 1,
      });
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    }
  };

  useEffect(() => {
    getProfileAPI();
  }, []);

  const handleChange = (event) => {
    setInfo({
      ...info,
      [event.target.id]: event.target.value,
    });
  };

  const renderModal = () => {
    if (!data) return <></>;

    if (step === 1) {
      return (
        <>
          <p>{t("fa2scan")}</p>

          <div style={{ textAlign: "center" }}>
            <QRCode value={data.otpAuth} size={170} style={{ marginTop: 20 }} />
            <p style={{ fontWeight: 600, fontSize: 18, marginTop: 20, letterSpacing: 3 }}>{data.secret}</p>
          </div>

          <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={() => setStep(2)}>
              {t("next")}
            </Button>
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <p>{t("enter2fa")}</p>

          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            size="large"
            autoFocus
            className="otpCodeInput"
          />

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button onClick={() => setStep(1)} style={{ marginRight: 16 }}>
              {t("previous")}
            </Button>
            <Button type="primary" onClick={() => turnOn2FA_API(code)}>
              {t("on2fa")}
            </Button>
          </div>
        </>
      );
    }
  };

  return (
    <div className="security-profile">
      <h2 className="title">{t("SecurityProfile")}</h2>

      <div className="security-zone-password">
        <div>
          <h3 style={{ fontWeight: 600 }} className="subtitle">
            {t("password")}
          </h3>
          <p>{t("changePassText")}</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <Button type="primary" size="large" disabled={user?.twofa == 0} onClick={showModal}>
            {t("changePass")}
          </Button>
          {user?.twofa == 0 && <p style={{ color: "red", marginTop: 5 }}>* {t("changePasswordNeedTwoFA")}</p>}
        </div>
      </div>

      <div className="security-zone-twofa">
        <div>
          <h3 style={{ fontWeight: 600 }} className="subtitle">
            2FA
          </h3>
          <p>{t("fa2Desc")}</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              if (user?.twofa == 0) {
                showModal3();
              } else {
                showModal2();
              }
            }}
          >
            {user?.twofa == 0 ? t("turn2faOn") : t("turn2faOff")}
          </Button>
        </div>
      </div>

      <Modal
        title={<div style={{ fontSize: 18, fontWeight: 600 }}>{t("changePass")}</div>}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={t("cancel")}
        okText={t("changePass")}
        className="newModalChangePassword"
      >
        <form>
          <div className="password-field field">
            <label htmlFor="password">{t("p1")}</label>
            <Input.Password id="password" name="password" value={info.password} onChange={handleChange} size="large" />
          </div>

          <div className="newPassword-field field">
            <label htmlFor="newPassword">{t("p2")}</label>
            <Input.Password
              id="newPassword"
              name="newPassword"
              value={info.newPassword}
              onChange={handleChange}
              size="large"
            />
          </div>
        </form>
      </Modal>

      <Modal
        title={<div style={{ fontSize: 18, fontWeight: 600 }}>{t("fa2")}</div>}
        visible={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        cancelText={t("cancel")}
        okText={t("off2fa")}
      >
        {/* đang bật -> tắt */}
        <label htmlFor="code" style={{ display: "block", marginBottom: 5 }}>
          {t("enter2fa")}
        </label>

        <Input
          size="large"
          id="code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          autoFocus
          className="otpCodeInput"
        />
      </Modal>

      <Modal
        title={<div style={{ fontSize: 18, fontWeight: 600 }}>{t("fa2")}</div>}
        visible={isModalOpen3}
        footer={null}
        onCancel={handleCancel3}
      >
        {/* đang tắt -> bật */}
        {renderModal()}
      </Modal>
    </div>
  );
}

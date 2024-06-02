import { Button, Form, Input, Modal, Spin } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { showErrorToast, showSuccessToast } from "../function/showToastify";
import { loginAction } from "../redux/actions/loginAction";
import { axiosService } from "../util/service";
import OtpInput from "react-otp-input";

export default function Login(props) {
  // khi user nhấn đăng nhập thì check xem email đó đã bật 2fa chưa
  // nếu bật rồi thì phải bắt nhập 2fa mới đăng nhập được
  // nếu chưa bật thì đăng nhập bình thường bằng email và password

  // Modal nhập 2FA khi đăng nhập
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fa2code, setFa2code] = useState("");
  const showModal2FA = () => {
    setIsModalOpen(true);
  };
  const handleOk2FA = () => {
    if (!fa2code || fa2code == "") {
      showErrorToast(t("fa2Empty"));
      return;
    }
    dispatch(loginAction(formik.values, setLoading, fa2code));
  };
  const handleCancel2FA = () => {
    setIsModalOpen(false);
    setFa2code("");
  };
  // Modal nhập 2FA khi đăng nhập

  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.userReducer);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required(t("required")).email(t("invalidEmail")),
      password: Yup.string().required(t("required")),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      check2FABeforeLogin(values.email);
    },
  });

  const formik2 = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required(t("required")).email(t("invalidEmail")),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      sendEmailToResetPassword(values.email);
      setIsModalVisible(false);
    },
  });

  const sendEmailToResetPassword = async (email) => {
    setLoading2(true);
    try {
      let response = await axiosService.post("api/user/sendmailforgetpassword", { email });
      showSuccessToast(response.data.message);
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    } finally {
      setLoading2(false);
    }
  };

  const check2FABeforeLogin = async (email) => {
    try {
      await axiosService.post("api/user/checkuser2fa", { email });
      // thành công -> email đã bật 2FA -> show modal cho nhập 2FA
      showModal2FA();
    } catch (error) {
      if (error.response.status == 400) {
        // nếu lỗi 400 -> email chưa bật 2FA nên không cần nhập mã ở đây, cứ đăng nhập bình thường
        dispatch(loginAction(formik.values, setLoading));
      } else {
        // nếu lỗi khác
        console.log(error);
        showErrorToast("Đã xảy ra lỗi");
      }
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      formik.handleSubmit();
    }
  };

  useEffect(() => {
    document.getElementById("login-form")?.addEventListener("keypress", handleEnter);
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleOk = () => formik2.handleSubmit();
  const handleCancel = () => setIsModalVisible(false);

  if (localStorage.getItem("user") && localStorage.getItem("token")) {
    if (user.id === 1) return <Redirect to="/admin/dashboard" />;
    else return <Redirect to="/user/trade" />;
  }

  if (loading2) {
    return (
      <div className="main-login">
        <div className="center-area" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin style={{ marginRight: 12 }} />
          <span>{t("pleaseWait")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-login">
      <div className="center-area">
        <h2 className="title">{t("loginToYourAccount")}</h2>

        <div className="link-to-signup">
          {t("notHaveAccount")}
          <span onClick={() => props.history.push("/signup")}> {t("createAccount")}</span>
        </div>

        <form id="login-form">
          <div className="email-field field">
            <label htmlFor="email">{t("email")}</label>
            <Input
              size="large"
              type="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              style={{ caretColor: "white" }}
              name="email"
            />
            {formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
          </div>

          <div className="password-field field">
            <label htmlFor="password">{t("password")}</label>
            <Input.Password
              size="large"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              style={{ caretColor: "white" }}
              name="password"
            />
            {formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
          </div>

          <div className="forgot" onClick={() => showModal()}>
            {t("forgetPass")}
          </div>

          <Button
            type="primary"
            style={{ width: "100%", fontWeight: "bold" }}
            size="large"
            onClick={formik.handleSubmit}
            loading={loading}
          >
            {t("login")}
          </Button>
        </form>
      </div>

      {/* Modal */}
      <Modal
        title={null}
        closable={false}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t("resetPass")}
        cancelText={t("cancel")}
        centered
      >
        <p>{t("resetPassDecs")}</p>

        <form>
          <div className="email-field field">
            <label htmlFor="email" style={{ display: "block", marginBottom: 4 }}>
              {t("email")}
            </label>
            <Input
              size="large"
              type="email"
              id="email"
              name="email"
              values={formik2.values.email}
              onChange={formik2.handleChange}
            />
            {formik2.errors.email ? <div style={{ fontWeight: 500, color: "red" }}>{formik2.errors.email}</div> : null}
          </div>
        </form>
      </Modal>
      {/* End modal */}

      {/* Modal 2FA old version*/}
      <Modal
        title={<div style={{ fontSize: 16, fontWeight: 600 }}>{t("need2FA")}</div>}
        closable={true}
        visible={isModalOpen}
        onOk={handleOk2FA}
        onCancel={handleCancel2FA}
        okText={t("login")}
        cancelText={t("cancel")}
        centered
        width={450}
      >
        <p>{t("need2FAContent")}</p>

        <Form onFinish={() => handleOk2FA()}>
          <div className="code-field field enter-2fa-when-login">
            <label htmlFor="code2fa" style={{ display: "block", marginBottom: 4 }}>
              {t("otp2fa")}
            </label>
            <Input
              autoFocus
              size="large"
              id="code2fa"
              name="code2fa"
              value={fa2code}
              onChange={(e) => setFa2code(e.target.value)}
            />
          </div>
        </Form>
      </Modal>
      {/* Modal 2FA old version*/}

      {/* Modal 2FA new version*/}
      {/* <Modal
        title={
          <div style={{ fontSize: window.innerWidth <= 768 ? 16 : 18, fontWeight: 600, textAlign: "center" }}>
            {t("need2FA")}
          </div>
        }
        closable={false}
        visible={isModalOpen}
        onOk={handleOk2FA}
        onCancel={handleCancel2FA}
        okText={t("login")}
        cancelText={t("cancel")}
        cancelButtonProps={{ size: window.innerWidth <= 768 ? "middle" : "large" }}
        okButtonProps={{
          size: window.innerWidth <= 768 ? "middle" : "large",
          type: "primary",
          style: { marginLeft: 16 },
        }}
        className="otpInputModalWhenLogin"
      >
        <form onSubmit={() => console.log("object")}>
          <OtpInput
            containerStyle="otpInputContainer"
            inputStyle="otpInputInput"
            value={fa2code}
            onChange={(code) => setFa2code(code)}
            numInputs={6}
            shouldAutoFocus={true}
            isInputNum={true}
          />
        </form>
      </Modal> */}
      {/* Modal 2FA new version*/}
    </div>
  );
}

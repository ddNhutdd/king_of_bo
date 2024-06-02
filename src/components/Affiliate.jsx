import { Button, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { useCopyToClipboard } from "usehooks-ts";
import handShaking from "../assets/img/hand-shaking.svg";
import notEnough from "../assets/img/not-enough.svg";
import step1 from "../assets/img/step1.svg";
import step2 from "../assets/img/step2.svg";
import step3 from "../assets/img/step3.svg";
import { showSuccessToast } from "../function/showToastify";
import { axiosService, DOMAIN } from "../util/service";

export default function Affiliate() {
  const history = useHistory();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.userReducer);
  const REF = user?.referral;
  const LINK = DOMAIN + "signup/" + REF;

  const [value, copy] = useCopyToClipboard();
  const [value2, copy2] = useCopyToClipboard();

  const [loading, setLoading] = useState(false);

  // Modal $100
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Modal $100

  // Modal thông báo không đủ số dư
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleOk2 = () => {
    setIsModalOpen2(false);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };
  // Modal thông báo không đủ số dư

  const getProfileAPI = async () => {
    try {
      let response = await axiosService.post("api/user/getProfile");
      dispatch({
        type: "UPDATE_USER_LEVEL",
        payload: response.data.data.level,
      });
      dispatch({
        type: "UPDATE_USER_BALANCE",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const buyVIP = async () => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/binaryOption/buyMemberVip");
      showSuccessToast(response.data.message);
      getProfileAPI();
    } catch (error) {
      console.log(error);
      showModal2();
    } finally {
      handleCancel();
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileAPI();
  }, []);

  if (user?.level != 0) {
    // user đã mua vip
    return <Redirect to={"/user/vip"} />;
  }

  return (
    <div className="affiliate-page">
      <div className="top"></div>

      <div className="center">
        <div className="vip-license">
          <div className="vip-title">{t("vipvipTitle")}</div>

          <Button type="primary" size="large" onClick={showModal}>
            {t("vipvip100")}
          </Button>
        </div>

        <div className="referral-zone">
          <div className="field">
            <label>{t("rf1")}</label>
            <div className="input-wrapper">
              <input type="text" value={LINK} readOnly />
              <Button
                size={window.innerWidth <= 768 ? "small" : "middle"}
                type="primary"
                onClick={() => {
                  copy(LINK);
                  message.success("Copied to clipboard");
                }}
              >
                {window.innerWidth <= 768 ? <i className="fa-regular fa-copy"></i> : "Copy"}
              </Button>
            </div>
          </div>

          <div className="field">
            <label>{t("rf2")}</label>
            <div className="input-wrapper">
              <input type="text" value={REF} readOnly />
              <Button
                size={window.innerWidth <= 768 ? "small" : "middle"}
                type="primary"
                onClick={() => {
                  copy2(REF);
                  message.success("Copied to clipboard");
                }}
              >
                {window.innerWidth <= 768 ? <i className="fa-regular fa-copy"></i> : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="steps">
          <div className="item-step step1">
            <img src={step1} alt="Affiliate" />
            <div className="content">
              <h4>{t("affiliate11")}</h4>
              <p>{t("affiliate12")}</p>
            </div>
          </div>

          <div className="item-step step2">
            <img src={step2} alt="Affiliate" />
            <div className="content">
              <h4>{t("affiliate21")}</h4>
              <p>{t("affiliate22")}</p>
            </div>
          </div>

          <div className="item-step step3">
            <img src={step3} alt="Affiliate" />
            <div className="content">
              <h4>{t("affiliate31")}</h4>
              <p>{t("affiliate32")}</p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={null}
        footer={null}
        centered
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="modal-confirm-100do"
        width={400}
      >
        <div className="modal-confirm-100do-content">
          <h2>{t("confirmYourParticipation")}</h2>
          <img src={handShaking} />
          <p>{t("confirmYourParticipation2")}</p>
          <p>{t("confirmYourParticipation3")}</p>

          <Button
            loading={loading}
            type="primary"
            size="large"
            style={{ width: "100%", fontWeight: "bold", marginTop: 30, marginBottom: 10 }}
            onClick={() => buyVIP()}
          >
            {t("confirm")}
          </Button>

          <span className="confirmNote">{t("confirmNote")}</span>
        </div>
      </Modal>

      <Modal
        title={null}
        footer={null}
        centered
        visible={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        width={500}
      >
        <div className="modal-thongbao-khongdutien">
          <h2 className="title">{t("notEnoughBalance")}</h2>
          <img src={notEnough} alt="" />
          <Button
            size="large"
            type="primary"
            style={{ width: "60%", marginBottom: 25 }}
            onClick={() => history.push("/user/wallet")}
          >
            {t("depositNow")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

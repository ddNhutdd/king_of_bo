import { Alert, Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showErrorToast, showSuccessToast } from "../function/showToastify";
import { axiosService } from "../util/service";

export default function TransferChild() {
  const { t } = useTranslation();

  // modal to show error
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

  const [data, setData] = useState({
    amount: "",
    username: "",
    otp: "",
    note: "",
  });

  const [fee, setFee] = useState(0);

  // loading
  const [loading, setLoading] = useState(false);

  // blocked
  const [isBlocked, setIsBlocked] = useState(false);
  const [isKYC, setIsKYC] = useState(true);

  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.userReducer);

  const handleSubmit = () => {
    // check lỗi trước (bị chặn, chưa kyc, chưa 2fa)
    if (isBlocked || !isKYC) {
      showModal();
      return;
    }

    // nếu không lỗi thì thực hiện chuyển tiền như lúc trước

    if (!data.amount || !data.username || !data.otp) {
      return;
    }

    transfer(data.username, data.amount, data.otp, data.note);
  };

  const getProfile = async () => {
    try {
      let response = await axiosService.post("/api/user/getProfile");

      dispatch({
        type: "UPDATE_USER_BALANCE",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // lấy tỉ lệ phần trăm phí chuyển tiền, admin có thể chỉnh
  const getFeeTransfer = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", { name: "transfer" });
      setFee(response.data.data[0]?.value);
    } catch (error) {
      console.log(error);
    }
  };

  const transfer = async (username, amount, otp, note) => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/crypto/transfer", {
        userNameTo: username,
        amount: amount,
        api: "transfer",
        otp: otp,
        note,
      });
      showSuccessToast(response.data.message);
      setData({
        amount: "",
        username: "",
        otp: "",
      });
      getProfile();
      dispatch({
        type: "USER_TRANSFERED",
      });
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeeTransfer();
    checkKYC();

    if (user.block === 1) {
      // bị blocked
      setIsBlocked(true);
    } else if (user.twofa === 0) {
      // chưa 2fa
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, []);

  const checkKYC = async () => {
    try {
      let response = await axiosService.post("/api/user/checkKycUser");
      if (response.data.data === "APPROVED") {
        setIsKYC(true);
      } else {
        setIsKYC(false);
      }
    } catch (error) {
      if (error.response.data.message === "user is not kyc") {
        setIsKYC(false);
      }
    }
  };

  const renderAlert = () => {
    if (user.block === 1) {
      // bị blocked
      return (
        <Alert
          banner
          icon={<i className="fa-solid fa-circle-exclamation"></i>}
          message={t("accountBlocked")}
          description={t("accountBlocked2")}
          type="error"
        />
      );
    } else if (user.twofa === 0) {
      // chưa 2fa
      return (
        <Alert
          banner
          icon={<i className="fa-solid fa-circle-exclamation"></i>}
          description={t("newAlertContentForTransfer")}
          type="error"
        />
      );
    } else if (!isKYC) {
      // chưa kyc
      return (
        <Alert
          banner
          icon={<i className="fa-solid fa-circle-exclamation"></i>}
          description={t("newAlertContentForTransfer")}
          type="error"
        />
      );
    }
  };

  const renderAlert2 = () => {
    if (user.block === 1) {
      // bị blocked
      return (
        <>
          <h3>{t("nkmsBlock")}</h3>
          <p>{t("nkmsBlock2")}</p>
        </>
      );
    } else if (user.twofa === 0) {
      // chưa 2fa
      return (
        <>
          <h3>{t("nkmsBlock3")}</h3>
          <p>{t("nkmsBlock4")}</p>
        </>
      );
    } else if (!isKYC) {
      // chưa kyc
      return (
        <>
          <h3>{t("nkmsBlock3")}</h3>
          <p>{t("nkmsBlock4")}</p>
        </>
      );
    }
  };

  function toNonAccentVietnamese(str) {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  }

  const stringToSlug = (str) => {
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(RegExp(from[i], "gi"), to[i]);
    }

    str = str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/-+/g, "");

    return str;
  };

  return (
    <>
      <div className="transfer-child">
        <h2 className="title" style={{ color: "yellow" }}>
          {t("transfer")}
        </h2>

        {(isBlocked || !isKYC) && <div style={{ marginBottom: 25 }}>{renderAlert()}</div>}

        <form>
          <div className="field">
            <label htmlFor="amount">{t("amount")}</label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="username">{t("userReceive")}</label>
            <Input
              type="text"
              id="username"
              name="username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: stringToSlug(e.target.value) })}
            />
          </div>

          <div className="field">
            <label htmlFor="note">{t("transferNote")}</label>
            <Input
              id="note"
              name="note"
              value={data.note}
              onChange={(e) => setData({ ...data, note: toNonAccentVietnamese(e.target.value) })}
            />
          </div>

          <div className="field">
            <label htmlFor="otp">{t("otp2fa")}</label>
            <Input
              type="text"
              id="otp"
              name="otp"
              value={data.otp}
              onChange={(e) => setData({ ...data, otp: e.target.value })}
            />
          </div>

          <div className="transfer-description">
            <dl>
              <div>
                <dt>
                  <i className="fa-solid fa-circle-info"></i>
                </dt>
                <dd>
                  {t("trans1")}: ${fee}
                </dd>
              </div>

              <div>
                <dt>
                  <i className="fa-solid fa-circle-info"></i>
                </dt>
                <dd>{t("trans2")}</dd>
              </div>
            </dl>
          </div>

          <Button type="primary" size="large" onClick={handleSubmit} style={{ width: 140 }} loading={loading}>
            {t("transferOther")}
          </Button>
        </form>
      </div>

      <Modal
        title={null}
        closable={false}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        footer={null}
        maskClosable={false}
        destroyOnClose
      >
        <div className="transfer-alert-in-modal-klo">
          <i className="fa-solid fa-circle-xmark"></i>
          {renderAlert2()}
          <Button type="primary" size="large" style={{ width: 120 }} onClick={handleCancel}>
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
}

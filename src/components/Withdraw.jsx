import { Alert, Button, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { xx } from "../function/numberFormatter";
import { showErrorToast, showSuccessToast } from "../function/showToastify";
import { axiosService } from "../util/service";
import WithdrawHistory from "./WithdrawHistory";

export default function Withdraw() {
  const { t } = useTranslation();

  const typeList = ["BEP20"];
  const [currentType, setCurrentType] = useState("BEP20");

  // modal show error
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

  // to update history
  const [count, setCount] = useState(0);

  const [info, setInfo] = useState({
    address: "",
    amount: "",
    otp: "",
  });

  const [amountR, setAmountR] = useState("");

  const [fee, setFee] = useState(0);

  // blocked
  const [isBlocked, setIsBlocked] = useState(false);
  const [isKYC, setIsKYC] = useState(true);

  const dispatch = useDispatch();
  const { user } = useSelector((root) => root.userReducer);

  useEffect(() => {
    getFeeWithdraw();
    getProfile();
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

  useEffect(() => {
    if (info.amount !== "" && info.amount !== 0) {
      setAmountR(Number(info.amount) - fee);
    } else {
      setAmountR("");
    }
  }, [info]);

  const handleChangeType = (type) => {
    setCurrentType(type);
  };

  const handleChangeInput = (e) => {
    setInfo({
      ...info,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // check lỗi trước (bị chặn, chưa kyc, chưa 2fa)
    if (isBlocked || !isKYC) {
      showModal();
      return;
    }

    // nếu không lỗi thì thực hiện rút tiền như lúc trước

    if (Number(info.amount) < 5) {
      showErrorToast(t("decs2"));
      return;
    }

    withdraw({
      symbol: "USDT",
      amount: info.amount,
      network: currentType,
      toAddress: info.address,
      otp: info.otp,
    });
  };

  // lấy tỉ lệ phần trăm phí rút tiền, admin có thể chỉnh
  const getFeeWithdraw = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", { name: "withdraw" });
      setFee(response.data.data[0]?.value);
    } catch (error) {
      console.log(error);
    }
  };

  const withdraw = async (info) => {
    try {
      let response = await axiosService.post("/api/crypto/widthdraw", info);
      console.log(response.data);
      showSuccessToast(response.data.message);
      setInfo({
        address: "",
        amount: "",
        otp: "",
      });
      setCount((count) => count + 1);
      getProfile();
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    }
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

  const setMaxAmount = () => {
    setInfo({
      ...info,
      amount: Math.floor(user.balance),
    });
  };

  const renderAlert = () => {
    if (user.block === 1) {
      // bị blocked
      return (
        <Alert
          banner
          icon={<i className="fa-solid fa-circle-exclamation"></i>}
          message={t("accountBlocked")}
          description={t("accountBlocked3")}
          type="error"
        />
      );
    } else if (user.twofa === 0) {
      // chưa 2fa
      return (
        <Alert
          banner
          icon={<i className="fa-solid fa-circle-exclamation"></i>}
          description={t("newAlertContentForWithdraw")}
          type="error"
        />
      );
    } else if (!isKYC) {
      // chưa kyc
      return (
        <Alert
          banner
          icon={<i className="fa-solid fa-circle-exclamation"></i>}
          description={t("newAlertContentForWithdraw")}
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
          <h3>{t("allalBlock")}</h3>
          <p>{t("allalBlock2")}</p>
        </>
      );
    } else if (user.twofa === 0) {
      // chưa 2fa
      return (
        <>
          <h3>{t("allalBlock3")}</h3>
          <p>{t("allalBlock4")}</p>
        </>
      );
    } else if (!isKYC) {
      // chưa kyc
      return (
        <>
          <h3>{t("allalBlock3")}</h3>
          <p>{t("allalBlock4")}</p>
        </>
      );
    }
  };

  return (
    <>
      <div className="withdraw" style={{ marginBottom: window.innerWidth < 576 ? 10 : 30 }}>
        <h2 className="title">{t("wallet")} USDT</h2>

        {(isBlocked || !isKYC) && <div style={{ marginBottom: 25 }}>{renderAlert()}</div>}

        <div className="type">
          {typeList.map((item, index) => {
            return (
              <Button
                key={index}
                type={item === currentType ? "primary" : "default"}
                onClick={() => handleChangeType(item)}
              >
                {item}
              </Button>
            );
          })}
        </div>

        <form>
          <div className="field address">
            <label htmlFor="address">{t("wallet")} USDT</label>
            <Input type="text" id="address" name="address" value={info.address} onChange={handleChangeInput} />
          </div>

          <div className="field amount">
            <label htmlFor="amount">{t("amountOf")} USDT</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                type="text"
                id="amount"
                name="amount"
                value={info.amount}
                onChange={handleChangeInput}
                addonAfter={"USDT"}
              />

              <Button style={{ marginLeft: 10 }} onClick={setMaxAmount}>
                {t("max")}
              </Button>
            </div>
          </div>

          <div className="field field3">
            <span>{t("maxAvailable")}</span>
            <span className="strong">{xx(user?.balance)} USDT</span>
          </div>

          <div className="field amount2">
            <label htmlFor="amount2">{t("amountReceive")}</label>
            <Input type="text" id="amount2" name="amount2" value={xx(amountR)} disabled />
          </div>

          <div className="field otp">
            <label htmlFor="otp">2FA</label>
            <Input type="text" id="otp" name="otp" value={info.otp} onChange={handleChangeInput} />
          </div>
        </form>

        <div className="withdraw-description">
          <dl>
            <div>
              <dt>
                <i className="fa-solid fa-circle-info"></i>
              </dt>
              <dd>
                {t("decs1")}: ${fee}
              </dd>
            </div>

            <div>
              <dt>
                <i className="fa-solid fa-circle-info"></i>
              </dt>
              <dd>{t("decs2")}</dd>
            </div>
          </dl>
        </div>

        <Button type="primary" size="large" style={{ width: 150 }} onClick={handleSubmit}>
          {t("withdraw")}
        </Button>
      </div>

      <WithdrawHistory count={count} />

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
        <div className="withdraw-alert-in-modal-ejk">
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

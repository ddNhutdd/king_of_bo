import { Divider } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { localeFixed } from "../function/numberFormatter";
import { axiosService } from "../util/service";
import svgBell from "../assets/img/bell.svg";

export default function NotificationItem({ noti, onCloseNoti, isLastNoti }) {
  // mỗi cái type khác nhau là loại thông báo khác nhau
  // API có trả về title với detail nhưng lấy từ đó thì không translate được
  // dựa theo type, phải tự customize nội dung

  // type == 0: Receive commission from VIP member
  // type == 3: Nhận hoa hồng giao dịch
  // type == 4: Rút tiền nội bộ thành công
  // type == 5: Nạp tiền nội bộ thành công
  // type == 6: Nạp tiền
  // type == 7: Rút tiền
  // type == 8: Thông báo do admin gửi
  // type == 9: tắt 2fa thành công
  // type == 10: bật 2fa thành công
  // type == 11: kyc bị từ chối
  // type == 12: kyc được phê duyệt
  // type == 13: kyc pending
  // type == 14: thông báo nhận prize pool

  const { t, i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const renderNotiTitle = () => {
    let notiTitle = "";
    if (noti.type === 0) notiTitle = t("noti-type0-title");
    else if (noti.type === 3) notiTitle = t("noti-type3-title");
    else if (noti.type === 4) notiTitle = t("noti-type4-title");
    else if (noti.type === 5) notiTitle = t("noti-type5-title");
    else if (noti.type === 6) notiTitle = t("noti-type6-title");
    else if (noti.type === 7) notiTitle = t("noti-type7-title");
    else if (noti.type === 8) {
      if (i18n.language == "vn") notiTitle = noti?.titleVN;
      else notiTitle = noti?.titleEN;
    } else if (noti.type == 9) notiTitle = t("noti-type9-title");
    else if (noti.type == 10) notiTitle = t("noti-type10-title");
    else if (noti.type == 11) notiTitle = t("noti-type11-title");
    else if (noti.type == 12) notiTitle = t("noti-type12-title");
    else if (noti.type == 13) notiTitle = t("noti-type13-title");
    else if (noti.type == 14) notiTitle = t("noti-type14-title");

    return notiTitle;
  };

  const renderNotiContent = () => {
    let notiDetail = "";
    if (noti.type === 0)
      notiDetail = (
        <div>
          {t("noti-type0-detail1")} <span style={{ color: "white", fontWeight: 600 }}>${noti.amountRoseMemberVip}</span>
          {t("noti-type0-detail2")}
        </div>
      );
    else if (noti.type === 4)
      notiDetail = (
        <div>
          <div>
            {t("noti-type4-detail1") + ": "}{" "}
            <span style={{ fontWeight: 600, color: "white" }}>{noti.userNameTransfer}</span>
          </div>
          <div>
            <span>{t("noti-type4-detail2") + ": "}</span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "white", marginInline: 2 }}></i>
            <span style={{ fontWeight: 600, color: "white" }}>{localeFixed(noti.amountTransfer, 2, ",")}</span>
          </div>
          <div>Memo: {noti.memo || ""}</div>
        </div>
      );
    else if (noti.type === 5)
      notiDetail = (
        <div>
          <div>
            {t("noti-type5-detail1") + ": "}
            <span style={{ fontWeight: 600, color: "white" }}>{noti.userNameTransfer}</span>
          </div>
          <div>
            <span>{t("noti-type5-detail2") + ": "}</span>
            <i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "white", marginInline: 2 }}></i>
            <span style={{ fontWeight: 600, color: "white" }}>{localeFixed(noti.amountTransfer, 2, ",")}</span>
          </div>
          <div>Memo: {noti.memo || ""}</div>
        </div>
      );
    else if (noti.type === 3)
      notiDetail = (
        <div>
          <div>
            <span>{t("noti-type3-detail1")}</span>{" "}
            <span style={{ fontWeight: 600, color: "white" }}>${localeFixed(noti.amountCommission, 2, ",")}</span>{" "}
            <span>{t("noti-type3-detail2")}</span>{" "}
            <span style={{ fontWeight: 600, color: "white" }}>{noti.timeCommission}</span>
          </div>
        </div>
      );
    else if (noti.type === 6) {
      notiDetail = (
        <div>
          <span>{t("noti-type6-detail")}</span>{" "}
          <span style={{ fontWeight: 600, color: "white" }}>${localeFixed(noti.amountDeposit, 2, ",")}</span>
        </div>
      );
    } else if (noti.type === 7) {
      notiDetail = (
        <div>
          <span>{t("noti-type7-detail")}</span>{" "}
          <span style={{ fontWeight: 600, color: "white" }}>${localeFixed(noti.amountWithdraw, 2, ",")}</span>
        </div>
      );
    } else if (noti.type === 8) {
      if (i18n.language == "vn") notiDetail = <div>{noti?.messageVN}</div>;
      else notiDetail = <div>{noti?.messageEN}</div>;
    } else if (noti.type === 9 || noti.type === 10 || noti.type === 12 || noti.type === 13) notiDetail = <div></div>;
    else if (noti.type === 11) notiDetail = <div>{t("noti-type11-content")}</div>;
    else if (noti.type === 14)
      notiDetail = (
        <div>
          <span>{t("n14c1")}</span> <span style={{ fontWeight: 600, color: "white" }}>{noti.peoplePool}</span>{" "}
          <span>{t("n14c2")}</span>{" "}
          <span style={{ fontWeight: 600, color: "white" }}>${localeFixed(noti.totalPool, 2, ",")}</span>{" "}
          <span>{t("n14c3")}</span> <span style={{ fontWeight: 600, color: "white" }}>{noti.userNamePool}</span>{" "}
          <span>{t("n14c4")}</span>{" "}
          <span style={{ fontWeight: 600, color: "white" }}>${localeFixed(noti.megaPool, 2, ",")}</span>{" "}
          <span>{t("n14c5")}</span>
        </div>
      );

    return notiDetail;
  };

  const clickNotification = async (idNotification) => {
    // click để đánh dấu là đã đọc ở backend
    try {
      await axiosService.post("api/binaryOption/clickNotification", { idNotification });
      dispatch({
        type: "USER_SEEN_A_NOTIFICATION",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNotiClick = async (noti) => {
    // nếu thông báo đã xem rồi (watched === 1) thì không gọi API click nữa
    if (noti.watched === 0) {
      await clickNotification(noti.id);
    }

    // thông báo từ admin (type 8) nhấn vô không làm gì cả, các loại khác thì close drawer rồi chuyển trang
    if (noti.type === 8) {
      return;
    }

    onCloseNoti();

    if (noti.type === 4 || noti.type === 5) {
      history.push("/user/transfer");
    } else if (noti.type === 6) {
      history.push("/user/deposit");
    } else if (noti.type === 7) {
      history.push("/user/withdraw");
    } else if (noti.type === 9 || noti.type === 10 || noti.type === 11 || noti.type === 12 || noti.type === 13) {
      history.push("/user/profile");
    } else if (noti.type === 0 || noti.type === 3) {
      history.push("/user/vip-commission");
    } else if (noti.type === 14) {
      history.push("/user/streak-challenge");
    }
  };

  return (
    <>
      <div
        className={`notification-item-rfc ${noti.watched == 0 ? "not-seen" : "seen"}`}
        onClick={() => handleNotiClick(noti)}
      >
        <div className="left">
          <img src={svgBell} alt="bell" />
        </div>

        <div className="right">
          <h4 className={`noti-title ${noti.type == 8 || noti.type == 3 ? "title-golden" : ""}`}>
            {renderNotiTitle()}
          </h4>
          <div className={`noti-content ${noti.type == 8 ? "content-golden" : ""}`}>{renderNotiContent()}</div>
          <span className="noti-time">{noti.created_at}</span>
        </div>

        <i className={`fa-solid fa-circle ${noti.watched == 0 ? "not-seen" : "seen"}`}></i>
      </div>

      {!isLastNoti && <Divider className="notification-divider" />}
    </>
  );
}

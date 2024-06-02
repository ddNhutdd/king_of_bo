import { Button, Divider, Drawer, Modal, Popover, Select, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import nodataSVG from "../../assets/img/antd-nodata.svg";
import avatarDefault from "../../assets/img/avatar-default.svg";
import logo from "../../assets/img/logo/logoImgTextHorizontal.png";
import prizePoolImg from "../../assets/img/prize/prize.png";
import svgNoti from "../../assets/img/svg/noti.svg";
import svgProfile from "../../assets/img/svg/profile.svg";
import svgSetting from "../../assets/img/svg/setting.svg";
import svgArrow from "../../assets/img/svgexport-arrow.svg";
import newSVG from "../../assets/img/vip/new.svg";
import NotificationItem from "../../components/NotificationItem";
import QuickDeposit from "../../components/QuickDeposit";
import { APP_NAME } from "../../constant/constant";
import { getDefaultLanguage, getSupportedLanguageList } from "../../function/getDefaultLanguage";
import { localeFixedDown, nFormatter } from "../../function/numberFormatter";
import { DOMAIN2, axiosService } from "../../util/service";
import socket from "../../util/socket";
import svgLang from "../../assets/img/lang.svg";
import svgSound from "../../assets/img/sound.svg";
import svgEye from "../../assets/img/eye.svg";
import svgRead from "../../assets/img/read.svg";
import svgHamburger from "../../assets/img/svg/hamburger.svg";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { currentBalance, user } = useSelector((root) => root.userReducer);
  const { isShowSidePane } = useSelector((root) => root.sidepaneReducer);
  const { countTransfer } = useSelector((root) => root.historyReducer); // khi transfer thành công thì gọi lại thông báo
  const { countNoti } = useSelector((root) => root.historyReducer); // khi user nhấn đã đọc thông báo
  const { isShowWallet } = useSelector((root) => root.historyReducer);

  // Amount Prize Pool
  const [amountPP, setAmountPP] = useState(0);

  // Modal Quick Deposit
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = () => setIsModalOpen2(true);
  const handleOk2 = () => setIsModalOpen2(false);
  const handleCancel2 = () => setIsModalOpen2(false);
  // Modal Quick Deposit

  // Drawer as sidebar when screen width <= 768
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  // Drawer as sidebar when screen width <= 768

  // Drawer notification
  const [openNoti, setOpenNoti] = useState(false);

  const [listNoti, setListNoti] = useState([]);
  const [numberOfUnseenNoti, setNumberOfUnseenNoti] = useState(0); // số thông báo chưa xem

  const showDrawerNoti = () => {
    setOpenNoti(true);
  };
  const onCloseNoti = () => setOpenNoti(false);
  // Drawer notification

  const getProfileAPI = async () => {
    try {
      let response = await axiosService.post("api/user/getProfile");
      dispatch({
        type: "UPDATE_USER_BALANCE",
        payload: response.data.data,
      });
      dispatch({
        type: "UPDATE_USER_LEVEL",
        payload: response.data.data.level,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getNotifications = async () => {
    try {
      let response = await axiosService.post("api/binaryOption/getListNotification", { limit: 20, page: 1 });
      setListNoti(response.data.data.array);
      setNumberOfUnseenNoti(+response.data.data.total - +response.data.data.watched);
    } catch (error) {
      console.log(error);
    }
  };

  const refillDemoBalance = async () => {
    try {
      await axiosService.post("api/binaryOption/updateBalanceDemo");
      await getProfileAPI();
    } catch (error) {
      console.log(error);
    }
  };

  const getAmountPrizePool = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", {
        name: "POOL",
      });
      setAmountPP(response.data.data[0]?.value);
      dispatch({
        type: "GET_PRIZE_POOL_VALUE",
        payload: response.data.data[0]?.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // const confirmLogout = () => {
  //   Modal.destroyAll();
  //   Modal.confirm({
  //     title: <div style={{ fontSize: 16, fontWeight: 600 }}>{t("loginDetectTitle")}</div>,
  //     icon: <ExclamationCircleFilled />,
  //     content: <div style={{ fontSize: 15 }}>{t("loginDetectContent")}</div>,
  //     cancelButtonProps: {
  //       style: {
  //         display: "none",
  //       },
  //     },
  //     onOk: () => {
  //       signout();
  //     },
  //     keyboard: false,
  //   });
  // };

  useEffect(() => {
    getProfileAPI();
    getAmountPrizePool();
    getNotifications();

    socket.emit("joinUser", `${user.id}`);
  }, []);

  useEffect(() => {
    socket.removeAllListeners();
    socket.on("logout", (res) => {
      signout();
    });
    // socket khi nhận được tiền
    socket.on("transfer", (res) => {
      getNotifications();
      getProfileAPI();
    });
  }, [location]);

  useEffect(() => {
    getNotifications();
  }, [countTransfer, countNoti]);

  const handleChangeAccountType = (type) => {
    dispatch({
      type: "CHANGE_ACCOUNT_TYPE",
      payload: type,
    });
  };

  const onLangChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    document.title = "BinaTrade - " + t("headingText");
  };

  const onChange = (checked) => {
    // checked: true / false
    localStorage.setItem("sound", checked ? "yes" : "no");
  };

  let defaultSound = "yes";
  if (localStorage.getItem("sound") == null || localStorage.getItem("sound") == undefined) {
    defaultSound = "yes";
  } else if (localStorage.getItem("sound") == "yes") {
    defaultSound = "yes";
  } else if (localStorage.getItem("sound") == "no") {
    defaultSound = "no";
  } else {
    defaultSound = "yes";
  }

  const signout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({
      type: "USER_LOGOUT",
    });
    history.push("/login");
  };

  const renderAccountText = () => {
    if (currentBalance === "live") {
      return t("liveAccount");
    } else {
      if (user.level >= 1) {
        return t("liveAccount");
      } else {
        return t("demoAccount");
      }
    }
  };

  const renderAccountText2 = () => {
    if (user.level >= 1) {
      return t("liveAccount");
    } else {
      return t("demoAccount");
    }
  };

  return (
    <div className="botrade-navbar">
      <div className="botrade-logo">
        {window.innerWidth <= 992 ? (
          <img src={svgHamburger} onClick={() => showDrawer()} style={{ width: "unset", height: "unset" }} />
        ) : (
          <img src={logo} alt={APP_NAME} />
        )}
      </div>

      <div className="botrade-action">
        <div className="prize-pool" onClick={() => history.push("/user/streak-challenge")}>
          <img src={prizePoolImg} />
          <div className="pp-content">
            <p>Prize Pool</p>
            <span>${nFormatter(Number(amountPP), 1)}</span>
          </div>
        </div>

        <Popover
          overlayClassName="balance-popover"
          trigger="click"
          placement="bottomRight"
          content={
            <>
              <div className="botrade-balance-choser">
                <div className={`field ${currentBalance === "live" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="botrade-balance-choser-radio"
                    id="botrade-balance-choser-radio-1"
                    defaultChecked={currentBalance === "live"}
                    onClick={() => handleChangeAccountType("live")}
                  />
                  <label htmlFor="botrade-balance-choser-radio-1" onClick={() => handleChangeAccountType("live")}>
                    <div className="div-as-label">
                      <span className="text">{t("liveAccount")}</span>
                      <span className="num">${localeFixedDown(user?.balance, 0, ",")}</span>
                    </div>
                  </label>
                  <img src={svgArrow} />
                </div>

                <Divider />

                <Divider />

                <div className={`field ${currentBalance === "demo" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="botrade-balance-choser-radio"
                    id="botrade-balance-choser-radio-2"
                    defaultChecked={currentBalance === "demo"}
                    onClick={() => handleChangeAccountType("demo")}
                  />
                  <label htmlFor="botrade-balance-choser-radio-2" onClick={() => handleChangeAccountType("demo")}>
                    <div className="div-as-label">
                      <span className="text">{renderAccountText2()}</span>
                      <span className="num">${localeFixedDown(user?.demoBalance, 0, ",")}</span>
                    </div>
                  </label>
                  <i className="fa-solid fa-rotate-right refill-demo-balance" onClick={() => refillDemoBalance()}></i>
                </div>
              </div>
            </>
          }
          title={null}
        >
          <div className="balance">
            <div className="left">
              <span className="text">{renderAccountText()}</span>
              <span className="num">
                $
                {isShowWallet
                  ? currentBalance === "live"
                    ? localeFixedDown(user?.balance, 0, ",")
                    : localeFixedDown(user?.demoBalance, 0, ",")
                  : "******"}
              </span>
            </div>

            <div className="right">
              <i className="fa-solid fa-circle-chevron-down"></i>
            </div>
          </div>
        </Popover>

        {window.innerWidth <= 992 ? null : (
          <div className="quick-deposit">
            <button onClick={() => showModal2()}>{t("quickDeposit")}</button>
          </div>
        )}

        {window.innerWidth <= 992 ? null : (
          <div className="setting">
            <Popover
              overlayClassName="setting-popover"
              trigger="click"
              placement="bottomRight"
              content={
                <div className="setting-modal">
                  {/* <h2 className="setting-title">{t("setting")}</h2> */}

                  <div className="language-field">
                    <span className="langlang">
                      <img src={svgLang} alt="" />
                      {t("language")}
                    </span>

                    <Select
                      size="large"
                      style={{
                        width: 180,
                      }}
                      onChange={onLangChange}
                      value={getDefaultLanguage()}
                      listHeight={300}
                    >
                      {getSupportedLanguageList().map((lang, index) => {
                        return (
                          <Select.Option key={index} value={lang.code}>
                            <div style={{ display: "flex", alignItems: "center", height: "38px" }}>
                              <img
                                src={`/img/flag/${lang.code}.png`}
                                alt="en"
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 8,
                                }}
                              />
                              <span>{lang.nameText}</span>
                            </div>
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </div>

                  <Divider />

                  <div className="sound-field">
                    <span className="langlang">
                      <img src={svgSound} alt="" />
                      {t("soundd")}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>OFF</span>
                      <Switch defaultChecked={defaultSound == "yes"} onChange={onChange} size="default" />
                      <span style={{ fontSize: 15, fontWeight: 700 }}>ON</span>
                    </div>
                  </div>

                  <div className="eye-field">
                    <span className="langlang">
                      <img src={svgEye} alt="" />
                      <span>{t("showBalance")}</span>
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>OFF</span>
                      <Switch defaultChecked={defaultSound == "yes"} size="default" />
                      <span style={{ fontSize: 15, fontWeight: 700 }}>ON</span>
                    </div>
                  </div>
                </div>
              }
              title={null}
            >
              <div className="setting-content-inside">
                <img src={svgSetting} />
                <span>{t("setting")}</span>
              </div>
            </Popover>
          </div>
        )}

        {window.innerWidth <= 992 ? null : (
          <div className="profile-xj" onClick={() => history.push("/user/profile")}>
            <div className="profile-content-inside">
              <img src={svgProfile} />
              <span>{t("profile")}</span>
            </div>
          </div>
        )}

        <Popover
          overlayClassName="notification-popover"
          trigger="click"
          placement="bottomRight"
          content={
            <div className="notifications-drawer-content">
              <div className="title-row">
                <div className="left">
                  <h2 className="title">{t("Notifications")}</h2>
                  <img src={svgRead} style={{ color: "red" }} />
                </div>
                <div className="right">
                  <span>Xem tất cả</span>
                </div>
              </div>

              <div className="body-row">
                {listNoti.length == 0 && (
                  <div className="no-data">
                    <img src={nodataSVG} alt="No data" />
                    <span>{t("noNotis")}</span>
                  </div>
                )}

                {listNoti.length != 0 && (
                  <>
                    {listNoti.map((noti, index) => {
                      return (
                        <NotificationItem
                          key={index}
                          noti={noti}
                          onCloseNoti={onCloseNoti}
                          isLastNoti={index == listNoti.length - 1}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          }
          title={null}
        >
          <div className="notification">
            <div className="notification-content-inside">
              <img src={svgNoti} />
              {window.innerWidth <= 992 ? null : <span>{t("notification")}</span>}
              {numberOfUnseenNoti != 0 && <div className="noti-count">{numberOfUnseenNoti}</div>}
            </div>
          </div>
        </Popover>

        {window.innerWidth <= 992 ? null : <Divider type="vertical" style={{ height: 40, margin: "0 25px" }} />}

        {history.location.pathname == "/user/trade" && window.innerWidth > 992 && (
          <Button
            type={isShowSidePane ? "primary" : "default"}
            style={{
              backgroundColor: "#2f3342",
              width: 39,
              height: 39,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              dispatch({
                type: "TOGGLE_SIDEPANE",
              });
            }}
          >
            {isShowSidePane ? <i className="fa-solid fa-list"></i> : <i className="fa-solid fa-ellipsis-vertical"></i>}
          </Button>
        )}

        <ToastContainer />
      </div>

      <Drawer
        title={null}
        closable={false}
        placement="left"
        onClose={onClose}
        visible={open}
        className="drawer-as-sidebar"
        width={280}
      >
        <div className="botrade-sidebar-in-drawer">
          <div className="top">
            <div className="title">
              <i className="fa-solid fa-xmark" onClick={() => onClose()}></i>
              <img src={logo} alt="" />
            </div>

            <div className="quick-deposit">
              <Button
                type="primary"
                size="large"
                style={{ fontWeight: 600, width: "100%" }}
                onClick={() => {
                  onClose();
                  showModal2();
                }}
              >
                Quick deposit
              </Button>
            </div>

            <div className="menu-title">Make Money</div>

            <div className="menu-list">
              <NavLink
                exact
                to="/user/trade"
                className="xbotrade-btn"
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                <i className="fa-brands fa-hive"></i>
                <span>{t("trade")}</span>
              </NavLink>

              <NavLink
                exact
                to="/user/affiliate"
                className={
                  history.location.pathname == "/user/affiliate" || history.location.pathname == "/user/vip"
                    ? "xbotrade-btn xbotrade-btn-active"
                    : "xbotrade-btn"
                }
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                <i className="fa-solid fa-crown"></i>
                <span>{t("vipMember")}</span>
              </NavLink>

              <NavLink
                exact
                to="/user/streak-challenge"
                className="xbotrade-btn with-image"
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                <i className="fa-solid fa-rocket"></i>
                <span>{t("streakChallenge")}</span>
                <img src={newSVG} alt="" />
              </NavLink>
            </div>

            <div className="menu-title">Manage Profile</div>

            <div className="menu-list">
              <NavLink
                exact
                to="/user/profile"
                className="xbotrade-btn"
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                {/* <i className="fa-solid fa-circle-user"></i> */}
                <img
                  src={!user.avatar ? avatarDefault : `${DOMAIN2}${user.avatar}`}
                  alt=""
                  style={{
                    width: 21,
                    height: 21,
                    marginRight: 10,
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "50%",
                  }}
                />
                <span>{user?.userName || t("profile")}</span>
              </NavLink>

              <NavLink
                exact
                to="/user/dashboard"
                className="xbotrade-btn"
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                <i className="fa-solid fa-gauge"></i>
                <span>{t("dashboard")}</span>
              </NavLink>

              <NavLink
                exact
                to="/user/order-history"
                className="xbotrade-btn"
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
                <span>{t("orders")}</span>
              </NavLink>

              <NavLink
                exact
                to="/user/wallet"
                className="xbotrade-btn"
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                <i className="fa-solid fa-wallet"></i>
                <span>{t("wallet")}</span>
              </NavLink>
            </div>

            <div className="menu-title">Setting & Help</div>

            <div className="menu-list">
              <NavLink
                exact
                to="/user/setting"
                className="xbotrade-btn"
                activeClassName="xbotrade-btn-active"
                onClick={onClose}
              >
                <i className="fa-solid fa-gear"></i>
                <span>{t("setting")}</span>
              </NavLink>

              <div className="xbotrade-btn" onClick={() => signout()}>
                <i className="fa-solid fa-arrow-right-from-bracket" style={{ transform: "scaleX(-1)" }}></i>
                <span>{t("logout")}</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <Drawer
        title={null}
        closable={false}
        onClose={onCloseNoti}
        visible={openNoti}
        className="notifications-drawer-wrapper"
        width={window.innerWidth <= 576 ? 300 : 378}
      >
        <div className="notifications-drawer-content">
          <div className="title-row">
            <h2 className="title">{t("Notifications")}</h2>

            {/* <Tooltip title="Mark all as read">
              <Button size="small" style={{ width: 45 }}>
                <i className="fa-solid fa-check-double"></i>
              </Button>
            </Tooltip> */}
          </div>

          {listNoti.length == 0 && (
            <div className="no-data">
              <img src={nodataSVG} alt="No data" />
              <span>{t("noNotis")}</span>
            </div>
          )}

          {listNoti.length != 0 && (
            <>
              {listNoti.map((noti, index) => {
                return (
                  <NotificationItem
                    key={index}
                    noti={noti}
                    onCloseNoti={onCloseNoti}
                    isLastNoti={index == listNoti.length - 1}
                  />
                );
              })}
            </>
          )}
        </div>
      </Drawer>

      <Modal
        title={
          <div
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {t("quickDeposit")}
          </div>
        }
        footer={null}
        visible={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        width={460}
      >
        <QuickDeposit />
      </Modal>
    </div>
  );
}

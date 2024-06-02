import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";

export default function SidebarAdmin(props) {
  const { showSidebar } = useSelector((root) => root.sidebarReducer);

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [showMenu, setShowMenu] = useState(false);
  const [showMenu2, setShowMenu2] = useState(false);

  let sidebarHideClass = showSidebar ? "" : "sidebar-hide";

  const signout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({
      type: "USER_LOGOUT",
    });
    props.history.push("/login");
  };

  const hideSideBar = () => {
    if (window.innerWidth < 576) {
      dispatch({
        type: "TOGGLE_SIDEBAR",
      });
    }
  };

  const toggleMenu = () => {
    if (!showMenu) {
      setShowMenu(true);

      if (showMenu2) {
        setShowMenu2(false);
      }
    } else {
      setShowMenu(false);
    }
  };
  const toggleMenu2 = () => {
    if (!showMenu2) {
      setShowMenu2(true);

      if (showMenu) {
        setShowMenu(false);
      }
    } else {
      setShowMenu2(false);
    }
  };

  useEffect(() => {
    const path = history.location.pathname;
    if (path == "/admin/manage-deposit" || path == "/admin/manage-withdrawals" || path == "/admin/manage-transfer") {
      setShowMenu(true);
      if (showMenu2) {
        setShowMenu2(false);
      }
    }

    if (path == "/admin/history-order" || path == "/admin/history-profit" || path == "/admin/history-set-result") {
      setShowMenu2(true);
      if (showMenu) {
        setShowMenu(false);
      }
    }
  }, []);

  return (
    <div className={`sidebar-admin ${sidebarHideClass}`}>
      <NavLink exact to="/admin/dashboard" activeClassName="btn-active" className="btn" onClick={hideSideBar}>
        <i className="fa-solid fa-house"></i>
        <span>{t("dashboard")}</span>
      </NavLink>

      <NavLink exact to="/admin/kyc-users" activeClassName="btn-active" className="btn" onClick={hideSideBar}>
        <i className="fa-solid fa-user-shield"></i>
        <span>{t("adKYCUser")}</span>
      </NavLink>

      <NavLink exact to="/admin/manage-users" activeClassName="btn-active" className="btn" onClick={hideSideBar}>
        <i className="fa-solid fa-user-group"></i>
        <span>{t("allUser")}</span>
      </NavLink>

      {/* start funding here */}
      <div className="btn btn-special" onClick={() => toggleMenu()}>
        <i className="fa-solid fa-coins"></i>
        <span>{t("funding")}</span>
        <i className={`fa-solid fa-caret-up menuArrow ${showMenu ? "" : "rotate"}`}></i>
      </div>

      <div className={`collapse-menu ${showMenu ? "" : "hide"}`}>
        <NavLink
          exact
          to="/admin/manage-deposit"
          activeClassName="btn-active"
          className="btn btn-child"
          onClick={hideSideBar}
        >
          <span>{t("deposit")}</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/manage-withdrawals"
          activeClassName="btn-active"
          className="btn btn-child"
          onClick={hideSideBar}
        >
          <span>{t("withdraw")}</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/manage-transfer"
          activeClassName="btn-active"
          className="btn btn-child"
          onClick={hideSideBar}
        >
          <span>{t("transfer")}</span>
        </NavLink>
      </div>
      {/* end funding here */}

      <NavLink exact to="/admin/trade" className="btn" activeClassName="btn-active" onClick={hideSideBar}>
        <i className="fa-solid fa-money-bill-transfer"></i>
        <span>{t("trade")}</span>
      </NavLink>

      <NavLink exact to="/admin/prize-pool" className="btn" activeClassName="btn-active" onClick={hideSideBar}>
        <i className="fa-solid fa-rocket"></i>
        <span>Prize Pool</span>
      </NavLink>

      {/* start history here */}
      <div className="btn btn-special" onClick={() => toggleMenu2()}>
        <i className="fa-solid fa-clock-rotate-left"></i>
        <span>{t("history")}</span>
        <i className={`fa-solid fa-caret-up menuArrow ${showMenu2 ? "" : "rotate"}`}></i>
      </div>

      <div className={`collapse-menu-2 ${showMenu2 ? "" : "hide"}`}>
        <NavLink
          exact
          to="/admin/history-order"
          activeClassName="btn-active"
          className="btn btn-child"
          onClick={hideSideBar}
        >
          <span>{t("adHistoryOrder")}</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/history-profit"
          activeClassName="btn-active"
          className="btn btn-child"
          onClick={hideSideBar}
        >
          <span>{t("adHistoryProfit")}</span>
        </NavLink>

        <NavLink
          exact
          to="/admin/history-set-result"
          activeClassName="btn-active"
          className="btn btn-child"
          onClick={hideSideBar}
        >
          <span>{t("adHistorySetResult")}</span>
        </NavLink>
      </div>
      {/* end history here */}

      <NavLink exact to="/admin/commission" className="btn" activeClassName="btn-active" onClick={hideSideBar}>
        <i className="fa-solid fa-money-bill-wave"></i>
        <span>{t("commission")}</span>
      </NavLink>

      <NavLink exact to="/admin/send-to-user" className="btn" activeClassName="btn-active" onClick={hideSideBar}>
        <i className="fa-solid fa-paper-plane"></i>
        <span>{t("adminSendMail")}</span>
      </NavLink>

      <div
        className="btn"
        onClick={() => {
          signout();
          if (window.innerWidth < 576) {
            dispatch({
              type: "TOGGLE_SIDEBAR",
            });
          }
        }}
      >
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>{t("logout")}</span>
      </div>
    </div>
  );
}

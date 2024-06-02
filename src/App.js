import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Admin from "./components/Admin";
import AdminHistoryOrder from "./components/AdminHistoryOrder";
import AdminHistoryProfit from "./components/AdminHistoryProfit";
import AdminHistorySetResult from "./components/AdminHistorySetResult";
import Affiliate from "./components/Affiliate";
import Challenge from "./components/Challenge";
import ChartHistory from "./components/ChartHistory";
import CommissionAdmin from "./components/CommissionAdmin";
import EasterEggs from "./components/EasterEggs";
import Home from "./components/Home";
import ManageDeposit from "./components/ManageDeposit";
import ManageKYCUsers from "./components/ManageKYCUsers";
import ManagePrizePool from "./components/ManagePrizePool";
import ManageTransfer from "./components/ManageTransfer";
import ManageUsers from "./components/ManageUsers";
import ManageWithdrawals from "./components/ManageWithdrawals";
import NewDashboard from "./components/NewDashboard";
import Profile from "./components/Profile";
import ScrollToTop from "./components/ScrollToTop";
import TradeAdmin from "./components/TradeAdmin";
import User from "./components/User";
import UserHistory from "./components/UserHistory";
import UserWallet from "./components/UserWallet";
import WalletNew from "./components/WalletNew";
import ManageUserNetwork from "./newComponents/Admin/ManageUserNetwork";
import SendToUser from "./newComponents/Admin/SendToUser";
import OrderMobile from "./newComponents/Mobile/Order";
import SettingMobile from "./newComponents/Mobile/Setting";
import VIP from "./newComponents/VIPMember/VIP";
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import SignupPage from "./pages/SignupPage";
import VerifyPage from "./pages/VerifyPage";
import VerifyTokenPage from "./pages/VerifyTokenPage";
import VerifyTokenPage2 from "./pages/VerifyTokenPage2";
import AdminTemplate from "./templates/AdminTemplate";
import UserTemplateNew from "./templates/UserTemplateNew";
import ProfileNew from "./components/ProfileNew";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const signout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({
      type: "USER_LOGOUT",
    });
    history.push("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const expiresInRefreshToken = JSON.parse(localStorage.getItem("user")).expiresInRefreshToken;
      if (expiresInRefreshToken < Date.now()) {
        signout();
      }
    }

    document.title = "BinaTrade - " + t("headingText");
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/signup/:referral" component={SignupPage} />
          <Route exact path="/login" component={LoginPage} />

          <AdminTemplate path="/admin/dashboard" component={Admin} />
          <AdminTemplate path="/admin/kyc-users" component={ManageKYCUsers} />
          <AdminTemplate path="/admin/manage-users" component={ManageUsers} />
          <AdminTemplate path="/admin/users/:uid" component={UserHistory} />
          <AdminTemplate path="/admin/manage-withdrawals" component={ManageWithdrawals} />
          <AdminTemplate path="/admin/manage-deposit" component={ManageDeposit} />
          <AdminTemplate path="/admin/manage-transfer" component={ManageTransfer} />
          <AdminTemplate path="/admin/trade" component={TradeAdmin} />
          <AdminTemplate path="/admin/commission" component={CommissionAdmin} />
          <AdminTemplate path="/admin/history-order" component={AdminHistoryOrder} />
          <AdminTemplate path="/admin/history-profit" component={AdminHistoryProfit} />
          <AdminTemplate path="/admin/history-set-result" component={AdminHistorySetResult} />
          <AdminTemplate path="/admin/prize-pool" component={ManagePrizePool} />
          <AdminTemplate path="/admin/user-network/:uid" component={ManageUserNetwork} />
          <AdminTemplate path="/admin/send-to-user" component={SendToUser} />

          <UserTemplateNew path="/user/trade" component={User} />
          <UserTemplateNew path="/user/trade-history" component={ChartHistory} />
          <UserTemplateNew path="/user/profile" component={Profile} />
          {/* <UserTemplateNew path="/user/wallet" component={UserWallet} /> */}
          <UserTemplateNew path="/user/profile-new" component={ProfileNew} />
          <UserTemplateNew path="/user/wallet" component={WalletNew} />
          <UserTemplateNew path="/user/deposit" component={UserWallet} />
          <UserTemplateNew path="/user/withdraw" component={UserWallet} />
          <UserTemplateNew path="/user/transfer" component={UserWallet} />
          <UserTemplateNew path="/user/affiliate" component={Affiliate} />
          <UserTemplateNew path="/user/streak-challenge" component={Challenge} />
          <UserTemplateNew path="/user/dashboard" component={NewDashboard} />
          <UserTemplateNew path="/user/vip" component={VIP} />
          <UserTemplateNew path="/user/vip-general" component={VIP} />
          <UserTemplateNew path="/user/vip-commission" component={VIP} />
          <UserTemplateNew path="/user/vip-network-management" component={VIP} />
          <UserTemplateNew path="/user/order-history" component={OrderMobile} />
          <UserTemplateNew path="/user/setting" component={SettingMobile} />

          <Route exact path="/verify-account" component={VerifyPage} />
          <Route exact path="/verify/:token" component={VerifyTokenPage} />
          <Route exact path="/verifyForgotPassword/:token" component={VerifyTokenPage2} />
          <Route exact path="/eggs" component={EasterEggs} />

          <Route exact path="*" component={Page404} />
        </Switch>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;

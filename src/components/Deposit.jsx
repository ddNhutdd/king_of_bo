import React from "react";
import Wallet from "./Wallet";
import DepositHistory from "./DepositHistory";

export default function Deposit() {
  return (
    <div className="deposit">
      <div className="wallets">
        {/* <Wallet walletName="USDT" typeList={["BEP20", "TRC20"]} /> */}
        <Wallet walletName="USDT" typeList={["BEP20"]} />
      </div>

      <DepositHistory />
    </div>
  );
}

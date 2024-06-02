import { Button } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Transfer from "./Transfer";
import Withdraw from "./Withdraw";

// component này bọc Rút tiền và Nội bộ lại chung 1 tab

export default function WithdrawWrap() {
  const { t } = useTranslation();
  const history = useHistory();

  const [type, setType] = useState(history.location.pathname == "/user/withdraw" ? 2 : 1); // 1 là nội bộ // 2 là rút tiền về ví (rút crypto)

  return (
    <div className="withdrawWrap-sas">
      <div className="btns-type">
        <Button
          size="large"
          onClick={() => {
            setType(1);
            history.push("/user/transfer");
          }}
          type={type == 1 ? "primary" : "default"}
        >
          <div>{t("transfer")}</div>
          <div className="feefee">{t("feefee")}: 0 USDT</div>
        </Button>

        <Button
          size="large"
          onClick={() => {
            setType(2);
            history.push("/user/withdraw");
          }}
          type={type == 2 ? "primary" : "default"}
        >
          <div>BEP20 (BSC)</div>
          <div className="feefee">{t("feefee")}: 1 USDT</div>
        </Button>
      </div>

      {type == 1 && <Transfer />}
      {type == 2 && <Withdraw />}
    </div>
  );
}

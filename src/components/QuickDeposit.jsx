import { Button, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { useCopyToClipboard } from "usehooks-ts";
import { axiosService } from "../util/service";

export default function QuickDeposit() {
  const { t } = useTranslation();

  // const array = ["BEP20", "TRC20"];
  const array = ["BEP20"];

  const [wallet, setWallet] = useState(array[0]);
  const [address, setAddress] = useState("");

  const [value, copy] = useCopyToClipboard();

  const handleWalletChange = (value) => setWallet(value);

  const createWallet = async (symbol) => {
    try {
      let response = await axiosService.post("/api/user/createWallet", {
        symbol,
      });
      setAddress(response.data.data?.address || "");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    createWallet("USDT." + wallet);
  }, [wallet]);

  const handleCopy = () => {
    copy(address);
    message.success("Copied to clipboard");
  };

  return (
    <div className="quickDepositInModal">
      <div className="row1 chooseWallet">
        <label>{t("wallet")}</label>
        <Select
          value={wallet}
          style={{
            width: "100%",
          }}
          onChange={handleWalletChange}
          options={array.map((item) => ({
            value: item,
            label: item,
          }))}
        />
      </div>

      <div className="row2 qrCode">
        <QRCode value={address} size={160} />
      </div>

      <div className="row3 action">
        <div className="asInput">{address}</div>

        <Button type="primary" size="large" style={{ width: 120 }} onClick={handleCopy}>
          Copy
        </Button>
      </div>
    </div>
  );
}

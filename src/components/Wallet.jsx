import { Button, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { axiosService } from "../util/service";

export default function Wallet({ walletName, typeList }) {
  const { t } = useTranslation();

  const [type, setType] = useState(typeList[0]);
  const [wallet, setWallet] = useState({
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const createWallet = async (symbol) => {
    setLoading(true);
    try {
      let response = await axiosService.post("/api/user/createWallet", {
        symbol,
      });
      if (response.data.status === true) {
        setWallet({
          ...wallet,
          address: response.data.data?.address || "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(wallet.address);
    message.success("Copied to clipboard");
  };

  useEffect(() => {
    createWallet(`${walletName}.${type}`);
  }, []);

  const handleTypeChange = (type) => {
    setType(type);
    createWallet(`${walletName}.${type}`);
  };

  return (
    <div className="wallet">
      <h2 className="title">
        {t("wallet")} {walletName}
      </h2>

      <div className="deposit-type">
        {typeList.map((item, index) => {
          return (
            <Button key={index} type={item === type ? "primary" : "default"} onClick={() => handleTypeChange(item)}>
              {item}
            </Button>
          );
        })}
      </div>

      {loading ? (
        <div className="deposit-content">
          <div
            style={{
              width: "100%",
              height: 309.33,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        </div>
      ) : (
        <div className="deposit-content">
          <div className="qr">
            <QRCode value={wallet.address} size={170} />
          </div>

          <div className="address">{wallet.address}</div>

          <Button type="primary" size="large" style={{ width: 200 }} onClick={copyLink}>
            {t("copyAd")}
          </Button>
        </div>
      )}

      <div className="deposit-description">
        <dl>
          <div>
            <dt>
              <i className="fa-solid fa-circle-info"></i>
            </dt>
            <dd>
              {t("w1")} {walletName} {t("w2")} {walletName} {t("w3")}
            </dd>
          </div>
          <div>
            <dt>
              <i className="fa-solid fa-circle-info"></i>
            </dt>
            <dd>
              {t("w4")} {walletName}. {t("w5")}.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

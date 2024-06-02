import { Button, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { axiosService } from "../util/service";
import { getTheme } from "../function/getTheme";

export default function ExchangeRate() {
  const isDarkTheme = getTheme();

  const [rate, setRate] = useState(0);

  const getTiGia = async () => {
    try {
      let response = await axiosService.post("api/user/getValueConfig", {
        name: "USD",
      });
      setRate(response.data.data[0].value);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeRate = (number) => {
    setRate(number);
  };

  const handleUpdateRate = () => {
    console.log(rate);
  };

  useEffect(() => {
    getTiGia();
  }, []);

  return (
    <div className="exchange-rate-component">
      <div className="title-area">
        <h2 className={isDarkTheme ? "title dark" : "title"}>Exchange rate</h2>
      </div>

      <div className="exchange-rate-field">
        <InputNumber
          style={{ width: 250 }}
          value={rate}
          onChange={handleChangeRate}
          addonBefore="1 USD = "
          addonAfter="VND"
        />

        <Button style={{ marginLeft: 25, width: 100 }} type="primary" onClick={handleUpdateRate}>
          Update
        </Button>
      </div>
    </div>
  );
}

import { Drawer, InputNumber } from "antd";
import { t } from "i18next";
import React, { memo, useEffect, useState } from "react";
import svgAdd from "../assets/img/svg/add.svg";
import svgDel from "../assets/img/svg/delete.svg";
import svgSub from "../assets/img/svg/sub.svg";
import { xx } from "../function/numberFormatter";

// trong này có nút dot và all chưa xử lý

function DrawerKeyboard({ visible, setVisible, setAmountOutside, amountOutside }) {
  const [amount, setAmount] = useState(0);
  const [profit, setProfit] = useState(0);

  const updateAmount = (type) => {
    switch (type) {
      case "add":
        setAmount((amount) => amount + 5);
        break;
      case "subtract":
        if (amount == 4 || amount == 3 || amount == 2 || amount == 1) {
          setAmount(0);
          // tránh trừ 5 ra số âm
        } else {
          setAmount((amount) => amount - 5);
        }
        break;
      default:
        break;
    }
  };

  const handleChangeAmount = (value) => setAmount(value);
  const incAmount = (value) => setAmount((v) => v + value);
  const handleKeyboardInputNum = (value) => {
    let currentAmount = amount.toString();
    if (currentAmount == "") currentAmount = "0";
    if (currentAmount.length > 10) return; // max 10 digits
    currentAmount += value.toString();
    setAmount(parseFloat(currentAmount));
  };
  const handleKeyboardDel = () => {
    let currentAmount = amount.toString();
    if (currentAmount == "" || currentAmount == "0") return;
    currentAmount = currentAmount.slice(0, -1);
    if (currentAmount == "") currentAmount = "0";
    setAmount(parseFloat(currentAmount));
  };
  const handleKeyboardDone = () => {
    let currentAmount = Number(amount);
    setAmountOutside(currentAmount);
    setVisible(false);
  };

  useEffect(() => {
    setProfit(amount * 1.95);
  }, [amount]);

  useEffect(() => {
    setAmount(Number(amountOutside));
  }, [visible]);

  return (
    <Drawer
      height={465} // fix all keyboards
      title="Khối lượng giao dịch"
      placement="bottom"
      onClose={() => setVisible(false)}
      visible={visible}
      closable={false}
      className="drawer-keyboard"
      destroyOnClose={true}
    >
      <div className="drawer-keyboard-main">
        <div className="row-amount-mobile">
          <button
            className={`amount-line-1-subtract ${amount <= 0 ? "disabled" : ""}`}
            onClick={() => updateAmount("subtract")}
            disabled={amount <= 0}
          >
            <img src={svgSub} alt="" />
          </button>

          <InputNumber
            className="input-center"
            type="number"
            style={{ width: "100%" }}
            value={amount}
            onChange={handleChangeAmount}
            min={0}
            controls={false}
            id="chart-pane-input-amount-number"
            prefix={<span style={{ fontSize: 16, color: "white" }}>$</span>}
            readOnly
            addonAfter={
              <i
                className="fa-solid fa-circle-xmark"
                style={{ fontSize: 18, color: "grey" }}
                onClick={() => setAmount(0)}
              ></i>
            }
          />

          <button className="amount-line-1-add" onClick={() => updateAmount("add")}>
            <img src={svgAdd} alt="" />
          </button>
        </div>

        <div className="row-profit-mobile">
          <div className="subtitle">
            {t("profit")}
            <span>95%</span>
          </div>

          {profit > 0 ? <div className="profit-value">+${xx(profit)}</div> : null}
          {profit == 0 ? <div className="profit-value">+$0.00</div> : null}
        </div>

        <div className="row-add">
          <button onClick={() => incAmount(5)}>+5</button>
          <button onClick={() => incAmount(10)}>+10</button>
          <button onClick={() => incAmount(50)}>+50</button>
          <button onClick={() => incAmount(100)}>+100</button>
        </div>

        <div className="row-grid">
          <button className="n1" onClick={() => handleKeyboardInputNum("1")}>
            1
          </button>
          <button className="n2" onClick={() => handleKeyboardInputNum("2")}>
            2
          </button>
          <button className="n3" onClick={() => handleKeyboardInputNum("3")}>
            3
          </button>
          <button className="all">Tất cả</button>
          <button className="n4" onClick={() => handleKeyboardInputNum("4")}>
            4
          </button>
          <button className="n5" onClick={() => handleKeyboardInputNum("5")}>
            5
          </button>
          <button className="n6" onClick={() => handleKeyboardInputNum("6")}>
            6
          </button>
          <button className="n7" onClick={() => handleKeyboardInputNum("7")}>
            7
          </button>
          <button className="n8" onClick={() => handleKeyboardInputNum("8")}>
            8
          </button>
          <button className="n9" onClick={() => handleKeyboardInputNum("9")}>
            9
          </button>
          <button className="done" onClick={() => handleKeyboardDone()}>
            Hoàn tất
          </button>
          <button className="dot">.</button>
          <button className="n0" onClick={() => handleKeyboardInputNum("0")}>
            0
          </button>
          <button className="del" onClick={() => handleKeyboardDel()}>
            <img src={svgDel} alt="" />
          </button>
        </div>
      </div>
    </Drawer>
  );
}

export default memo(DrawerKeyboard);

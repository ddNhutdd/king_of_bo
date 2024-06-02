import { InputNumber, Modal, Progress, Spin } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import orderSound from "../assets/sound/order-sound.mp3";
import winSound from "../assets/sound/win-sound.mp3";
import { localeFixedDown, xx } from "../function/numberFormatter";
import { showErrorToast, showSuccessToast } from "../function/showToastify";
import { axiosService } from "../util/service";
import ResultBorder from "./ResultBorder";
import ResultStreak from "./ResultStreak";
import svgUp from "../assets/img/svg/up.svg";
import svgDown from "../assets/img/svg/down.svg";

function ChartPane({ symbol }) {
  const { t } = useTranslation();

  const orderAudio = new Audio(orderSound);
  const winAudio = new Audio(winSound);

  let willPlaySound = true;
  if (localStorage.getItem("sound") == null || localStorage.getItem("sound") == undefined) {
    willPlaySound = true;
  } else if (localStorage.getItem("sound") == "yes") {
    willPlaySound = true;
  } else if (localStorage.getItem("sound") == "no") {
    willPlaySound = false;
  } else {
    willPlaySound = true;
  }

  const [amount, setAmount] = useState(10);
  const [amountBuy, setAmountBuy] = useState(0);
  const [amountSell, setAmountSell] = useState(0);
  const [amountBuy2, setAmountBuy2] = useState(0);
  const [amountSell2, setAmountSell2] = useState(0);
  // amountBuy2, amountSell2 để lưu lại số lần đầu, cộng dồn vào lần sau

  const [profit, setProfit] = useState(0);
  const [money, setMoney] = useState(0);

  const [firstClick, setFirstClick] = useState(true);
  // firstClick này dùng kết hợp với user.trade

  const [firstClick2, setFirstClick2] = useState(true);
  // firstClick2 này dùng kết hợp với user.double10

  const [currentOrderStatus, setCurrentOrderStatus] = useState(false);
  const [counter, setCounter] = useState(0);

  const [lastData, setLastData] = useState({});

  // Modal hiển thị kết quả trade
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [winOrLose, setWinOrLose] = useState(undefined);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  // Modal hiển thị kết quả trade

  // Modal hiển thị kết quả streak win
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [winOrLoseStreak, setWinOrLoseStreak] = useState(undefined);
  const showModal2 = () => setIsModalOpen2(true);
  const handleOk2 = () => setIsModalOpen2(false);
  const handleCancel2 = () => {
    setIsModalOpen2(false);
    setWinOrLoseStreak(undefined);
  };
  // Modal hiển thị kết quả streak win

  const dispatch = useDispatch();
  const { res, arrayRes } = useSelector((root) => root.resReducer);
  const { currentBalance, pendingOrder, user } = useSelector((root) => root.userReducer);
  const { time } = useSelector((root) => root.timeReducer);

  const [loading, setLoading] = useState(false);

  const idCandle = arrayRes[arrayRes.length - 1]?.id;

  let timeButtonClassName = currentOrderStatus ? "order box green" : "order box red";

  useEffect(() => {
    if (time >= 1 && time <= 30) {
      // [1-30]: order
      setCounter(31 - time);
      setCurrentOrderStatus(true);
    } else {
      // [31-60]: wait
      setCounter(61 - time);
      setCurrentOrderStatus(false);
    }

    if (time === 30) {
      // ngay trước lúc chuyển sang wait, lưu res lại
      setLastData(res);
    }

    if (time === 1) {
      // qua vòng order mới setFirstClick thành true
      setFirstClick(true);
      setFirstClick2(true);
    }

    // user bị block trade, nhấn lần 1 thì cập nhật amount2, nhấn lần 2 thì cập nhật amount chính, đồng thời cộng dồn amount2 qua, sau đó clear amount2
    // nhưng nếu chỉ nhấn lần 1 mà không nhấn lần 2, thì amount2 sẽ không bị xoá
    // vậy nên sẽ xoá amount2 khi chuyển qua wait, lúc đó người dùng không nhấn gì được nữa
    if (time === 31) {
      // bắt đầu wait -> xoá amount2
      setAmountBuy2(0);
      setAmountSell2(0);
    }
  }, [time]);

  useEffect(() => {
    let p = 0;
    if (amountBuy > amountSell) {
      p = amountBuy * 1.95 - amountSell;
    } else if (amountBuy < amountSell) {
      p = amountSell * 1.95 - amountBuy;
    } else {
      p = amountBuy * -0.05;
    }
    setProfit(p);
  }, [amountBuy, amountSell]);

  useEffect(() => {
    setProfit(amount * 1.95);
  }, [amount]);

  useEffect(() => {
    if (idCandle) {
      const lastCandle = arrayRes[arrayRes.length - 2];

      // arrayRes.length - 1 là item cuối cùng trong mảng res -> lần cập nhật đầu tiên của nến mới nhất
      // arrayRes.length - 2 là lần cập nhật cuối cùng của cây nến trước đó -> tính kq bằng nến này

      const lastID = lastCandle?.id;

      if (
        idCandle > lastID &&
        lastCandle.order === 0 &&
        (amountBuy !== 0 || amountSell !== 0 || amountBuy2 !== 0 || amountSell2 !== 0)
      ) {
        // idCandle > lastID: lúc chuyển order wait
        // lastCandle.order == 0: wait

        // calculate result
        let x = 0;
        for (let order of pendingOrder) {
          if (order.side == "sell") {
            if (lastCandle.close < lastCandle.open) {
              // thắng lệnh sell
              x += order.amount + order.amount * order.configProfit;
            } else {
              // hoà hoặc thua lệnh sell
              // x -= order.amount;
            }
          } else if (order.side == "buy") {
            if (lastCandle.close > lastCandle.open) {
              // thắng lệnh buy
              x += order.amount + order.amount * order.configProfit;
            } else {
              // hoà hoặc thua lệnh buy
              // x -= order.amount;
            }
          }
        }

        // show result
        if (x > 0) {
          // thắng
          setWinOrLose("win");
          if (willPlaySound) winAudio.play();

          if (
            pendingOrder.length > 0 &&
            pendingOrder[pendingOrder.length - 1].streakStr == "win" &&
            pendingOrder[pendingOrder.length - 1].streak == 14
          ) {
            // chuỗi 15 streak win
            setWinOrLoseStreak("win");
            showModal2();
          } else {
            // thắng bình thường
            setMoney((money) => money + x);
            showModal();
          }
        } else {
          // thua hoặc hoà
          setWinOrLose("lose");

          if (
            pendingOrder.length > 0 &&
            pendingOrder[pendingOrder.length - 1].streakStr == "lose" &&
            pendingOrder[pendingOrder.length - 1].streak == 14
          ) {
            // chuỗi 15 streak lose
            if (willPlaySound) winAudio.play();
            setWinOrLoseStreak("lose");
            showModal2();
          } else {
            // thua bình thường - không phát âm thanh cũng không show modal
          }
        }

        // reset
        setAmountBuy(0);
        setAmountSell(0);
        setAmountBuy2(0);
        setAmountSell2(0);

        dispatch({
          type: "CLEAR_ORDER",
        });

        setTimeout(() => {
          // hide result after 3s

          handleCancel();
          setWinOrLose(undefined);
          setMoney(0);

          getProfileAPI(); // after 3s get profile to update balance
        }, 3000);
      }
    }
  }, [idCandle]);

  useEffect(() => {
    getProfileAPI();
    getAllOrderPendingUser(currentBalance);

    const getChart = async (symbol) => {
      try {
        let response = await axiosService.post("api/binaryOption/getChart", { symbol });
        const x = response.data.data;
        setLastData(x[x.length - 1]);
      } catch (error) {
        console.log(error);
      }
    };

    getChart(symbol);

    const x = document.getElementById("chart-pane-input-amount-number");
    x.addEventListener(
      "keyup",
      function (e) {
        if (e.keyCode === 13) {
          x.blur();
        }
      },
      false
    );
  }, []);

  const handleChangeAmount = (value) => {
    setAmount(value);
  };

  const changeAmount = (value) => {
    // cộng dồn vô amount hiện tại
    setAmount((amount) => amount + value);
  };

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

  const usingAllBalance = () => {
    try {
      if (currentBalance === "demo") {
        setAmount(Number(localeFixedDown(user?.demoBalance, 2, "")));
      } else if (currentBalance === "live") {
        setAmount(Number(localeFixedDown(user?.balance, 2, "")));
      }
    } catch (error) {
      setAmount(0);
    }
  };

  const handleBuy = () => {
    if (currentOrderStatus == false) return;

    if (amount <= 0) {
      showErrorToast(t("pleaseEnterAmount"));
      return;
    }
    if (amount < 1) {
      showErrorToast(t("tradeAtLeast1"));
      return;
    }

    let realAmount = amount;
    if (user.double10 == 1 && firstClick2) {
      realAmount = amount * 10 + (amount % 10);
      setAmount(realAmount);
    }

    if (user.trade === 1 && firstClick) {
      orderAPI2(symbol, currentBalance, "buy", realAmount);
    } else {
      orderAPI(symbol, currentBalance, "buy", realAmount);
    }
  };

  const handleSell = () => {
    if (currentOrderStatus == false) return;

    if (amount <= 0) {
      showErrorToast(t("pleaseEnterAmount"));
      return;
    }
    if (amount < 1) {
      showErrorToast(t("tradeAtLeast1"));
      return;
    }

    let realAmount = amount;
    if (user.double10 == 1 && firstClick2) {
      realAmount = amount * 10 + (amount % 10);
      setAmount(realAmount);
    }

    if (user.trade === 1 && firstClick) {
      orderAPI2(symbol, currentBalance, "sell", realAmount);
    } else {
      orderAPI(symbol, currentBalance, "sell", realAmount);
    }
  };

  const orderAPI = async (symbol, type, side, amount) => {
    setLoading(true);

    // check amountBuy2 / amountSell2 có giá trị thì cộng dồn vào lần này
    let payloadAmount = amount;
    if (side === "buy") {
      if (amountBuy2 !== 0) {
        payloadAmount += amountBuy2;
      }
    }
    if (side === "sell") {
      if (amountSell2 !== 0) {
        payloadAmount += amountSell2;
      }
    }

    try {
      let response = await axiosService.post("api/binaryOption/order", {
        symbol,
        type,
        side,
        amount: payloadAmount,
        api: "order",
      });
      dispatch({
        type: "ORDER_SUCCESS",
        payload: response.data.data,
      });
      showSuccessToast(t("orderSuccessToast"));
      if (willPlaySound) orderAudio.play();
      // reset amount về mặc định 10
      setAmount(10);

      if (side === "buy") {
        if (amountBuy2 !== 0) {
          setAmountBuy((amountBuy) => amountBuy + amount + amountBuy2);
          setAmountBuy2(0);
        } else {
          setAmountBuy((amountBuy) => amountBuy + amount);
        }
      }
      if (side === "sell") {
        if (amountSell2 !== 0) {
          setAmountSell((amountSell) => amountSell + amount + amountSell2);
          setAmountSell2(0);
        } else {
          setAmountSell((amountSell) => amountSell + amount);
        }
      }
    } catch (error) {
      console.log(error);
      showErrorToast(error.response.data.message);
    } finally {
      getProfileAPI();
      setLoading(false);
      setFirstClick2(false);
    }
  };

  const orderAPI2 = async (symbol, type, side, amount) => {
    // không gọi API order ở lần đầu tiên
    // ghi nhớ amount vào amountBuy2 / amountSell2

    if (side === "buy") setAmountBuy2((amountBuy2) => amountBuy2 + amount);
    if (side === "sell") setAmountSell2((amountSell2) => amountSell2 + amount);

    setFirstClick(false);
    setFirstClick2(false);
  };

  const getProfileAPI = async () => {
    try {
      let response = await axiosService.post("api/user/getProfile");
      dispatch({
        type: "UPDATE_USER_BALANCE",
        payload: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllOrderPendingUser = async (type) => {
    try {
      let response = await axiosService.post("api/binaryOption/getAllOrderPendingUser", { type });
      const arr = response.data.data;
      if (arr.length != 0) {
        for (let item of arr) {
          if (item.side === "buy") setAmountBuy((amountBuy) => amountBuy + item.amount);
          if (item.side === "sell") setAmountSell((amountSell) => amountSell + item.amount);
        }
      }
      dispatch({
        type: "GET_ALL_ORDER_PENDING_USER",
        payload: arr,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chartpane">
      <div className="amount">
        <div className="subtitle">{t("amountTienCuoc")}</div>

        <div className="amount-line-1">
          <button
            onClick={() => updateAmount("subtract")}
            disabled={amount <= 0}
            className={`amount-line-1-subtract ${amount <= 0 ? "disabled" : ""}`}
          >
            -
          </button>
          <InputNumber
            className="input-center-desktop"
            size="large"
            value={amount}
            onChange={handleChangeAmount}
            min={0}
            controls={false}
            id="chart-pane-input-amount-number"
            prefix={<i className="fa-solid fa-dollar-sign" style={{ fontSize: 14, color: "black" }}></i>}
          />
          <button onClick={() => updateAmount("add")} className="amount-line-1-add">
            +
          </button>
        </div>

        <div className="btn-group">
          <button className="btn-child-op" onClick={() => changeAmount(5)}>
            +5
          </button>
          <button className="btn-child-op" onClick={() => changeAmount(10)}>
            +10
          </button>
          <button className="btn-child-op" onClick={() => changeAmount(20)}>
            +20
          </button>
          <button className="btn-child-op" onClick={() => changeAmount(50)}>
            +50
          </button>
          <button className="btn-child-op" onClick={() => changeAmount(100)}>
            +100
          </button>
          <button className="btn-child-op" onClick={() => usingAllBalance()}>
            {t("all")}
          </button>
        </div>
      </div>

      <div className="profit">
        <div className="subtitle">
          {t("profit")}
          <span>95%</span>
        </div>

        <div className="profit-value">+${xx(profit)}</div>
      </div>

      <div className="trader">
        <div className="subtitle">{t("traderSentiment")}</div>

        {currentOrderStatus ? (
          // order
          <>
            <Progress
              percent={100}
              success={{
                percent: (res.buyer / (res.buyer + res.seller + 1)) * 100,
              }}
            />
            <div className="span-group">
              <span className="span1">{Math.round((res.buyer / (res.buyer + res.seller + 1)) * 100)}%</span>
              <span className="span2">{Math.round((res.seller / (res.buyer + res.seller + 1)) * 100)}%</span>
            </div>
          </>
        ) : (
          // wait
          <>
            <Progress
              percent={100}
              success={{
                percent: (lastData.buyer / (lastData.buyer + lastData.seller + 1)) * 100,
              }}
            />
            <div className="span-group">
              <span className="span1">
                {Math.round((lastData.buyer / (lastData.buyer + lastData.seller + 1)) * 100)}%
              </span>
              <span className="span2">
                {Math.round((lastData.seller / (lastData.buyer + lastData.seller + 1)) * 100)}%
              </span>
            </div>
          </>
        )}
      </div>

      {res.symbol ? (
        <>
          <div className={currentOrderStatus && !loading ? "buy box" : "buy box disable"} onClick={handleBuy}>
            {loading ? (
              <div style={{ textAlign: "center", width: "100%" }}>
                <Spin />
              </div>
            ) : (
              <>
                <span style={{ textTransform: "uppercase" }}>
                  {t("buy")}
                  <img src={svgUp} style={{ marginLeft: 6 }} />
                </span>
              </>
            )}
          </div>

          <div className={timeButtonClassName}>
            <span className="ob-text">{currentOrderStatus ? t("order") : t("wait")}</span>
            <span className="ob-counter">{counter}s</span>
          </div>

          <div className={currentOrderStatus && !loading ? "sell box" : "sell box disable"} onClick={handleSell}>
            {loading ? (
              <div style={{ textAlign: "center", width: "100%" }}>
                <Spin />
              </div>
            ) : (
              <>
                <span style={{ textTransform: "uppercase" }}>
                  {t("sell")}
                  <img src={svgDown} style={{ marginLeft: 6 }} />
                </span>
              </>
            )}
          </div>
        </>
      ) : null}

      <Modal
        className="modal-result-chartpane"
        closeIcon={<i className="fa-solid fa-xmark" style={{ fontSize: 35, color: "white" }}></i>}
        centered
        title={null}
        footer={null}
        closable={true}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        width={700}
      >
        <ResultBorder type={winOrLose} data={money} />
      </Modal>

      <Modal
        className="modal-result-chartpane"
        closeIcon={<i className="fa-solid fa-xmark" style={{ fontSize: 35, color: "white" }}></i>}
        centered
        title={null}
        footer={null}
        closable={true}
        visible={isModalOpen2}
        onOk={handleOk2}
        onCancel={handleCancel2}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <ResultStreak type={winOrLoseStreak} />
      </Modal>
    </div>
  );
}

export default memo(ChartPane);

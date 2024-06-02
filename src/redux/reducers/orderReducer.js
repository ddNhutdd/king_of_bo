const defaultState = {
  arrayOrderBuy: [],
  arrayOrderSell: [],
};

export const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "NEW_ORDER": {
      if (action.payload.side === "buy") {
        const order = action.payload;

        let item = state.arrayOrderBuy.find((item) => item.userid == order.userid && item.symbol == order.symbol);
        if (item) {
          // nếu có rồi
          item.amount += order.amount; // amount cộng dồn lại
          item.balance = order.balance; // balance lấy cái cuối cùng

          return {
            ...state,
            arrayOrderBuy: [...state.arrayOrderBuy],
          };
        } else {
          return {
            ...state,
            arrayOrderBuy: [...state.arrayOrderBuy, order],
          };
        }

        // cập nhật balance sell
        let itemSell = state.arrayOrderSell.find((item) => item.userid == order.userid && item.symbol == order.symbol);
      } else if (action.payload.side === "sell") {
        const order = action.payload;

        let item = state.arrayOrderSell.find((item) => item.userid == order.userid && item.symbol == order.symbol);
        if (item) {
          // nếu có rồi
          item.amount += order.amount;
          item.balance = order.balance;

          return {
            ...state,
            arrayOrderSell: [...state.arrayOrderSell],
          };
        } else {
          return {
            ...state,
            arrayOrderSell: [...state.arrayOrderSell, order],
          };
        }
      }
    }
    case "CLEAR_ORDER": {
      return {
        ...state,
        arrayOrderBuy: [],
        arrayOrderSell: [],
      };
    }
    case "GET_ORDER_NOW": {
      return {
        ...state,
        arrayOrderBuy: action.orderBuy,
        arrayOrderSell: action.orderSell,
      };
    }
    default:
      return state;
  }
};

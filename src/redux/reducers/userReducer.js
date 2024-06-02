const defaultState = {
  user: JSON.parse(localStorage.getItem("user")),
  currentBalance: "live",
  pendingOrder: [],
};

export const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "USER_LOGIN": {
      return {
        ...state,
        user: action.payload,
      };
    }
    case "USER_LOGOUT": {
      return {
        ...state,
        user: {},
      };
    }
    case "CHANGE_ACCOUNT_TYPE": {
      return {
        ...state,
        currentBalance: action.payload,
      };
    }
    case "ORDER_SUCCESS": {
      return {
        ...state,
        pendingOrder: [...state.pendingOrder, action.payload],
      };
    }
    case "CLEAR_ORDER": {
      return {
        ...state,
        pendingOrder: [],
      };
    }
    case "UPDATE_USER_BALANCE": {
      const userUpdate = {
        ...state.user,
        balance: action.payload.balance,
        demoBalance: action.payload.demoBalance,
      };

      localStorage.setItem("user", JSON.stringify(userUpdate));

      return {
        ...state,
        user: userUpdate,
      };
    }
    case "UPDATE_USER_LEVEL": {
      const userUpdate = {
        ...state.user,
        level: action.payload,
      };

      localStorage.setItem("user", JSON.stringify(userUpdate));

      return {
        ...state,
        user: userUpdate,
      };
    }
    case "UPDATE_USER_OTHER_DATA": {
      const userUpdate = {
        ...state.user,
        totalMember: action.payload.totalMember,
        totalMemberVip: action.payload.totalMemberVip,
        totalCommission: action.payload.totalCommission,
        commissionMemberVip: action.payload.commissionMemberVip,
      };

      localStorage.setItem("user", JSON.stringify(userUpdate));

      return {
        ...state,
        user: userUpdate,
      };
    }
    case "UPDATE_USER_2FA": {
      const userUpdate = {
        ...state.user,
        twofa: action.payload,
      };

      localStorage.setItem("user", JSON.stringify(userUpdate));

      return {
        ...state,
        user: userUpdate,
      };
    }
    case "UPDATE_USER_AVATAR": {
      const userUpdate = {
        ...state.user,
        avatar: action.payload,
      };

      localStorage.setItem("user", JSON.stringify(userUpdate));

      return {
        ...state,
        user: userUpdate,
      };
    }
    case "GET_ALL_ORDER_PENDING_USER": {
      return {
        ...state,
        pendingOrder: action.payload,
      };
    }
    case "2FA_STATUS_CHANGED": {
      return {
        ...state,
        user: {
          ...state.user,
          twofa: action.payload,
        },
      };
    }
    case "UPDATE_USER_BLOCK_TRADE_STATUS": {
      const userUpdate = {
        ...state.user,
        trade: action.payload.trade,
        double10: action.payload.double10,
      };

      localStorage.setItem("user", JSON.stringify(userUpdate));

      return {
        ...state,
        user: userUpdate,
      };
    }
    default:
      return state;
  }
};

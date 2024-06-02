const defaultState = {
  count: 0,
  countTransfer: 0,
  countNoti: 0, // dùng để load lại noti list khi user đọc thông báo xong
  isShowWallet: true,
};

export const historyReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "HISTORY_1_CHANGED": {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    case "USER_TRANSFERED": {
      return {
        ...state,
        countTransfer: state.countTransfer + 1,
      };
    }
    case "USER_SEEN_A_NOTIFICATION": {
      return {
        ...state,
        countNoti: state.countNoti + 1,
      };
    }
    case "TOGGLE_SHOW_USER_WALLET": {
      return {
        ...state,
        isShowWallet: !state.isShowWallet,
      };
    }
    default:
      return state;
  }
};

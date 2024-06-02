const defaultState = {
  res: {},
  arrayRes: [],
};

export const resReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "GET_SOCKET": {
      const newArrayRes = [...state.arrayRes.slice(-200), action.payload];
      // tránh kích thước mảng quá lớn nếu web chạy thời gian dài

      return {
        ...state,
        res: action.payload,
        arrayRes: newArrayRes,
      };
    }

    default:
      return state;
  }
};

const defaultState = {
  time: 0,
};

export const timeReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "GET_TIME_SOCKET": {
      return {
        ...state,
        time: action.payload,
      };
    }
    default:
      return state;
  }
};

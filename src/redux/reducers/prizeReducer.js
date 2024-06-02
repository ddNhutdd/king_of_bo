const defaultState = {
  prizePoolValue: 0,
};

export const prizeReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "GET_PRIZE_POOL_VALUE": {
      return {
        ...state,
        prizePoolValue: action.payload,
      };
    }
    default:
      return state;
  }
};

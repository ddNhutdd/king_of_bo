const defaultState = {
  isShowSidePane: false,
};

export const sidepaneReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEPANE": {
      if (state.isShowSidePane) {
        return {
          ...state,
          isShowSidePane: false,
        };
      } else {
        return {
          ...state,
          isShowSidePane: true,
        };
      }
    }

    default:
      return state;
  }
};

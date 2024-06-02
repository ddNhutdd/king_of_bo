let defaultState;

if (window.innerWidth < 576) {
  defaultState = {
    showSidebar: false,
  };
} else {
  defaultState = {
    showSidebar: true,
  };
}

export const sidebarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR": {
      return {
        ...state,
        showSidebar: !state.showSidebar,
      };
    }
    default:
      return state;
  }
};

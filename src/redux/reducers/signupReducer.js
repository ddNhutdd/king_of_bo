const defaultState = {
  userSignup: {},
};

export const signupReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "USER_SIGNUP": {
      return {
        ...state,
        userSignup: action.userSignup,
      };
    }
    default:
      return state;
  }
};

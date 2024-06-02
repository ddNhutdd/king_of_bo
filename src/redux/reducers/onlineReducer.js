const defaultState = {
  userOnline: 0,
};

export const onlineReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "NUMBER_USERS_ONLINE": {
      return {
        ...state,
        userOnline: action.payload,
      };
    }

    default:
      return state;
  }
};

import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { chartReducer } from "./reducers/chartReducer";
import { historyReducer } from "./reducers/historyReducer";
import { onlineReducer } from "./reducers/onlineReducer";
import { orderReducer } from "./reducers/orderReducer";
import { prizeReducer } from "./reducers/prizeReducer";
import { resReducer } from "./reducers/resReducer";
import { sidebarReducer } from "./reducers/sidebarReducer";
import { sidepaneReducer } from "./reducers/sidepaneReducer";
import { signupReducer } from "./reducers/signupReducer";
import { timeReducer } from "./reducers/timeReducer";
import { userReducer } from "./reducers/userReducer";

// Redux DevTools Extension
// import { composeWithDevTools } from "@redux-devtools/extension";

const rootReducer = combineReducers({
  sidebarReducer,
  userReducer,
  signupReducer,
  historyReducer,
  chartReducer,
  resReducer,
  orderReducer,
  timeReducer,
  onlineReducer,
  sidepaneReducer,
  prizeReducer,
});

const middleWare = applyMiddleware(reduxThunk);
const composeCustom = compose(middleWare);

const store = createStore(rootReducer, composeCustom);

export default store;

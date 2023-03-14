import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import UserReducer from "../redux/ReduxReducers/UserReducers";
import MssgReducer from "./ReduxReducers/MssgsReducers";
const middleswares = [thunk];

const Reducers = combineReducers({
  user: UserReducer,
  mssgs: MssgReducer,
});

const InitialValues = {
  user: localStorage.getItem("User")
    ? JSON.parse(localStorage.getItem("User"))
    : sessionStorage.getItem("User")
    ? JSON.parse(sessionStorage.getItem("User"))
    : {},
  mssgs: [],
};

const store = createStore(
  Reducers,
  InitialValues,
  composeWithDevTools(applyMiddleware(...middleswares))
);

export default store;

import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "../reducers";
import thunk from "redux-thunk";
import { logger } from "redux-logger";

const store = createStore(rootReducer, compose(applyMiddleware(thunk, logger)));

export default store;

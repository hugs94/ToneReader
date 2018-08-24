import { combineReducers } from "redux";
import sessionReducer from "./session";
import usersReducer from "./users";
import rooms from "./rooms";
import mood from "./mood";
import usersRoom from "./userRoom";

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  usersState: usersReducer,
  roomState: rooms,
  moodState: mood,
  usersRoom: usersRoom
});

export default rootReducer;

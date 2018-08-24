import moment from "moment";
import { USER_TONE_DEFAULT } from "../const/emotes";
const INITIAL_STATE = {
  userState: USER_TONE_DEFAULT
};

const applyUserMood = (state, action) => ({
  ...state,
  userMood: action.userMood
});
const applyUserMoodRoom = (state, action) => ({
  ...state,
  userMood: action.userMood
});
const applyRoomMood = (state, action) => ({
  ...state,
  userState: action.roomMood
});

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "MOOD_USER_SET": {
      if (action === null) {
        return { ...state };
      } else {
        return applyUserMood(state, action);
      }
    }
    case "MOOD_ROOM_SET": {
      applyUserMoodRoom(state, action);
    }
    case "USERS_ROOM_WAIT": {
      return { ...state };
    }
    case "USERS_ROOM_MOOD_WAIT": {
      return { ...state };
    }
    case "ORDER_MOOD_START_STATE":
      return { ...state };

    default:
      return { ...state };
  }
};

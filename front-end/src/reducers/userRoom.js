const INITIAL_STATE = {
  rooms: {}
};

const applySetRooms = (state, action) => ({
  ...state,
  rooms: action.rooms
});

function usersRoom(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "USERS_ROOM": {
      return applySetRooms(state, action);
    }
    default:
      return state;
  }
}

export default usersRoom;

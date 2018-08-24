const INITIAL_STATE = {
  authUser: null
};

const applySetAuthUser = (state, action) => ({
  ...state,
  uid: action.uid,
  displayName: action.displayName,
  authUser: action.authUser
});

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "AUTH_USER_SET": {
      return applySetAuthUser(state, action);
    }
    default:
      return state;
  }
}

export default sessionReducer;

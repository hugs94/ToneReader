import React from "react";
import { connect } from "react-redux";

import { firebase } from "../firebase";
import { setStartState, clearState } from "../actions/rooms";
import { getMoodData } from "../actions/mood";

// this component to wrap/contain all components
// and 'watch' firebase AuthState, to correctly load other
// components/state by initiating actions/dispatcher.
const Authentication = Component => {
  class Authentication extends React.Component {
    componentDidMount() {
      const { onSetAuthUser } = this.props;

      firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          const displayName = authUser.displayName
            ? authUser.displayName
            : authUser.email;
          const uid = authUser.uid;
          onSetAuthUser(uid, displayName, authUser);
          this.props.setStartState();
          this.props.getMoodData();
        } else {
          onSetAuthUser(null), this.props.clearState;
        }
        //console.log("loaded auth state changed");
      });
    }

    render() {
      return <Component />;
    }
  }

  const mapDispatchToProps = dispatch => ({
    onSetAuthUser: (uid, displayName, authUser) =>
      dispatch({ type: "AUTH_USER_SET", uid, displayName, authUser }),
    setStartState: () => dispatch(setStartState()),
    getMoodData: () => dispatch(getMoodData()),
    clearState: () => dispatch(clearState)
  });

  return connect(
    null,
    mapDispatchToProps
  )(Authentication);
};

export default Authentication;

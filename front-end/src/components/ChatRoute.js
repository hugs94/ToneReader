import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { compose } from "redux";
//import Header from "../components/Header";
import MainRoom from "./MainRoom";
import RoomList from "./RoomList";
import Authorization from "../session/Authorization";
import * as routes from "../const/routes";
import Tones from "./Tones";

export const ChatRoute = ({ sessionState, component: Component, ...rest }) => (
  <Route
    {...rest}
    component={props => (
      <div>
        {/*<Header />*/}
        <div className="container">
          <RoomList />
          <Component {...props} />
          <Tones />
        </div>
      </div>
    )}
  />
);

const mapStateToProps = state => ({
  sessionState: !!state.sessionState.uid
});

export default connect(mapStateToProps)(ChatRoute);

// const authCondition = authUser => !!authUser;

// export default compose(
//   Authorization(authCondition),
//   connect(mapStateToProps)
// )(ChatRoute);

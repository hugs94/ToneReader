import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";

import { WrapPwForgetForm } from "./PassForget";
import WrapPasswordChangeForm from "./PassChange";
import Authorization from "../session/Authorization";

const AccountPage = ({ authUser }) => (
  <div>
    <h1>Account: {authUser.email}</h1>
    <WrapPwForgetForm />
    <WrapPasswordChangeForm />
  </div>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

const authCondition = authUser => !!authUser;

export default compose(
  Authorization(authCondition),
  connect(mapStateToProps)
)(AccountPage);

import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Layout, Menu, Breadcrumb, Button } from "antd";
import SignOutButton from "./SignOut";
import * as routes from "../const/routes";
const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;
const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={["0"]}
    style={{ lineHeight: "64px" }}
  >
    <Menu.Item key="1">
      <Link to={routes.LANDING}>Landing</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={routes.HOME}>Home</Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to={routes.ACCOUNT}>Account</Link>
    </Menu.Item>
    <Menu.Item key="4">
      <SignOutButton />
    </Menu.Item>
  </Menu>
);

const NavigationNonAuth = () => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={["0"]}
    style={{ lineHeight: "64px" }}
  >
    <Menu.Item key="1">
      <Link to={routes.LANDING}>Landing</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to={routes.SIGN_IN}>Sign In</Link>
    </Menu.Item>
  </Menu>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Navigation);

//   value={displayName}
//   onChange={event =>
//     this.setState(
//       updateByPropertyName("displayName", event.target.value)
//     )
//   }
//   type="text"
//   placeholder="Full Name"
// />

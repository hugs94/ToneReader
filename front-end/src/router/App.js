import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import Navigation from "../components/Navigation";
import LandingPage from "../components/LandingPage";
import SignUpPage from "../components/SignUpPage";
import SignInPage from "../components/SignInPage";
import PasswordForgetPage from "../components/PassForget";
import HomePage from "../components/HomePage";
import AccountPage from "../components/Account";
import Authentication from "../session/Authentication";
import ChatRoute from "../components/ChatRoute.js";
import MainRoom from "../components/MainRoom";
import * as routes from "../const/routes";
import EnterRoom from "../components/EnterRoom";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import "../styles/styles.css";
import "antd/dist/antd.css";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

export const history = createHistory();

const App = () => (
  <Router history={history}>
    <Layout>
      <div className="app">
        <Header className="header" style={{ height: "70px" }}>
          <Menu theme="dark" mode="horizontal" style={{ lineHeight: "60px" }}>
            <Navigation />
          </Menu>
        </Header>

        <Switch>
          <Content style={{ padding: "0 50px" }}>
            <Route
              exact
              path={routes.LANDING}
              component={() => <LandingPage />}
            />
            <Route
              exact
              path={routes.SIGN_UP}
              component={() => <SignUpPage />}
            />
            <Route
              exact
              path={routes.SIGN_IN}
              component={() => <SignInPage />}
            />
            <Route
              exact
              path={routes.PASSWORD_FORGET}
              component={() => <PasswordForgetPage />}
            />
            <Route exact path={routes.HOME} component={() => <HomePage />} />
            <Route
              exact
              path={routes.ACCOUNT}
              component={() => <AccountPage />}
            />
            {/* <Route exact path={routes.CREATE_ROOM} component={() => <EnterRoom />} /> */}
            <Switch>
              <ChatRoute path={routes.CREATE_ROOM} component={EnterRoom} />
              <ChatRoute path={routes.ROOM_PAGE} component={MainRoom} />
            </Switch>
          </Content>
        </Switch>
      </div>
    </Layout>
  </Router>
);

export default Authentication(App);

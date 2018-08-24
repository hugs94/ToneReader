import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
//import UserList from "./UserList";
import RoomList from "./RoomList";
import Authorization from "../session/Authorization";
import { db } from "../firebase";
import { Layout, Menu, Icon, List } from "antd";
import * as routes from "../const/routes";
import { onceGetRooms } from "../actions/rooms";
class HomePage extends Component {
  componentDidMount() {
    const { onSetUsers } = this.props;

    db.onceGetUsers().then(snapshot => onSetUsers(snapshot.val()));
  }
  // roomLister = users => {
  //   let array = Object.keys(users).map(key => users[key]);
  //   console.log(array);
  // };

  render() {
    const { users } = this.props;
    const { rooms } = this.props;
    const { SubMenu } = Menu;
    const { Header, Content, Sider } = Layout;
    return (
      <Layout>
        <Header className="header" style={{ background: "#fff" }}>
          <div className="logo" />
          <h3>ToneHome </h3>
          {/* {this.roomLister(rooms)} */}
        </Header>
        <Layout>
          <Sider width={200} style={{ background: "#fff" }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              theme="dark"
              style={{ height: "100%", borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    Users
                  </span>
                }
              >
                {Object.keys(users).map(key => (
                  <Menu.Item key={key}>{users[key].displayName}</Menu.Item>
                ))}
              </SubMenu>

              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="laptop" />
                    Rooms
                  </span>
                }
              >
                {!!rooms &&
                  Object.keys(rooms).map(key => (
                    <Menu.Item key={key}>{rooms[key].roomName}</Menu.Item>
                  ))}
              </SubMenu>
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="plus" />
                    Create/Join Room
                  </span>
                }
              >
                <Menu.Item key="9">
                  <Link to={routes.CREATE_ROOM}>
                    <div> Create/Join Room </div>
                  </Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  users: state.usersState.users,
  sessionState: state.sessionState,
  rooms: state.usersRoom.rooms,
  moodState: state.moodState
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: "USERS_SET", users })
});

const authCondition = authUser => !!authUser;

export default compose(
  Authorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(HomePage);

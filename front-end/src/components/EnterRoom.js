import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { startCreateRoom, startJoinRoom } from "../actions/rooms";
//import { db } from "../firebase";
import Authorization from "../session/Authorization";

const INITIAL_STATE = {
  error: "",
  joinError: ""
};

class EnterRoom extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onCreateRoom = e => {
    e.preventDefault();
    const user = this.props.sessionState.authUser;
    const value = e.target.rname.value.trim();
    if (user) {
      const name = user.displayName;
      if (value) {
        this.setState({ error: "" });
        const room = {
          name: value,
          people: {
            id: user.uid,
            name,
            unread: 0,
            lastRead: 0
          }
        };
        //db.createRoom(room, this.showCreateError);
        this.props.startCreateRoom(room, this.showCreateError);
      } else {
        this.setState({ error: "Please enter a valid room name!" });
      }
    }
  };
  showCreateError = error => {
    this.setState({
      error
    });
  };

  showJoinError = joinError => {
    this.setState({
      joinError
    });
  };

  onJoinRoom = e => {
    const user = this.props.sessionState.authUser;
    let name = user.displayName ? user.displayName : user.email;
    const data = {
      roomName: e.target.rname.value,
      id: user.uid,
      name: name,
      unread: 0
    };
    this.props.startJoinRoom(data, this.showJoinError);
    e.preventDefault();
  };

  render() {
    return (
      <div className="box-layout--join">
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Create a room</h1>
          <form onSubmit={this.onCreateRoom} autoComplete="off">
            <input
              className="text-input--join"
              placeholder="Enter Room name"
              name="rname"
            />
            <button className="button--join">Create</button>
            {this.state.error && (
              <p className="message__time" style={{ color: "black" }}>
                {this.state.error}
              </p>
            )}
          </form>
        </div>
        <div className="box-layout__box--join">
          <h1 className="box-layout__title">Join a room</h1>
          <form onSubmit={this.onJoinRoom} autoComplete="off">
            <input
              className="text-input--join"
              placeholder="Enter Room name"
              name="rname"
            />
            <button className="button--join">Join</button>
            {this.state.joinError && (
              <p className="message__time" style={{ color: "black" }}>
                {this.state.joinError}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  startCreateRoom: (room, showCreateError) =>
    dispatch(startCreateRoom(room, showCreateError)),
  startJoinRoom: (data, showJoinError) =>
    dispatch(startJoinRoom(data, showJoinError))
});

const mapStateToProps = state => ({
  sessionState: state.sessionState
});

const authCondition = authUser => !!authUser;

export default compose(
  Authorization(authCondition),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EnterRoom);

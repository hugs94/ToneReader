import React from "react";
import { connect } from "react-redux";
import {
  startSendMessage,
  startLeaveRoom,
  startClearUnread
} from "../actions/rooms";
import Messages from "./Messages";

export class MainRoom extends React.Component {
  state = {
    showModal: false
  };
  roomName = this.props.location.pathname.split("/").slice(-1)[0];

  onSubmit = e => {
    const message = e.target.message.value;

    if (!message.trim()) {
      e.target.submit.diabled = true;
      return;
    }

    this.props.startSendMessage(message, this.roomName);
    e.target.reset();
    e.preventDefault();
  };

  handleLeaveRoom = () => {
    this.props.startLeaveRoom(this.roomName);
  };

  showPeople = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  // componentDidMount() {
  //   const rooms = this.props.rooms;
  //   if (rooms.length > 0) {
  //     const a = rooms.find((room) => {
  //       return room.name === this.roomName;
  //     });
  //     const roomPath = a.id;
  //     this.props.startClearUnread(roomPath, this.roomName);
  //   }
  // }

  componentDidUpdate() {
    const rooms = this.props.rooms;
    if (rooms.length > 0) {
      const a = rooms.find(room => {
        return room.name === this.roomName;
        // const roomPath = a.id;
        // this.props.startClearUnread(this.roomName);
      });
    }
  }

  render() {
    return (
      <div className="box-layout--messages">
        <div className="room-header">
          <div className="room-header__title">
            {this.props.location.pathname.split("/").slice(-1)[0]}
          </div>
          <button onClick={this.handleLeaveRoom} className="button--leave-room">
            Leave room
          </button>
        </div>
        <Messages roomName={this.roomName} />
        <form onSubmit={this.onSubmit} autoComplete="off" id="message-form">
          <input
            type="text"
            name="message"
            className="text-input"
            placeholder="Send message"
            autoFocus
          />
          <button name="submit" className="login-button">
            Send
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  rooms: state.roomState
});

const mapDispatchToProps = dispatch => ({
  startSendMessage: (message, roomName) =>
    dispatch(startSendMessage(message, roomName)),
  startLeaveRoom: roomName => dispatch(startLeaveRoom(roomName)),
  startClearUnread: roomName => dispatch(startClearUnread(roomName))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainRoom);

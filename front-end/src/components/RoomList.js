import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { startClearUnread } from "../actions/rooms";

class RoomList extends React.Component {
  showUnread = room => {
    const user = this.props.sessionState;
    if (user) {
      const { uid } = user;
      const person = room.people.find(p => {
        return uid === p.id;
      });
      return person.unread;
    }
  };

  returnRooms = () => {
    const rooms = this.props.roomState;
    // console.log(rooms);
    if (rooms.length > 0) {
      const a = rooms.map(room => {
        // console.log(room);
        return (
          <div key={room.id} className="room-name-wrapper">
            <button
              className="button--unread-messages"
              onClick={() => this.props.startClearUnread(room.name)}
            >
              {this.showUnread(room)}
            </button>
            <NavLink to={`/room/${room.name}`} activeClassName="room-selected">
              <div className="room-name">{room.name}</div>
            </NavLink>
          </div>
        );
      });
      return a;
    }
  };

  render() {
    return (
      <div className="container__left">
        <div className="container__left__text">{this.returnRooms()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roomState: state.roomState,
  sessionState: state.sessionState
});

const mapDispatchToProps = dispatch => ({
  startClearUnread: roomName => dispatch(startClearUnread(roomName))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomList);

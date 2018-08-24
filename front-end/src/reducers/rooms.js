import moment from "moment";

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CREATE_ROOM":
      return [...state, action.room];
    case "JOIN_ROOM":
      return state.map(room => {
        if (room.name === action.roomName) {
          return {
            ...room,
            people: [...room.people, action.person]
          };
        } else {
          return room;
        }
      });

    case "ON_LEFT":
      // console.log('onleft');
      return state.map(room => {
        // console.log(room);
        if (room.name === action.roomName) {
          const p = room.people.filter(pe => {
            return pe.id !== action.personID;
          });
          // console.log(p);
          return {
            ...room,
            people: p
          };
        } else {
          return room;
        }
      });

    case "ON_JOINED":
      return state.map(room => {
        if (room.name === action.roomName) {
          room.people.push(action.person);
          return room;
        } else {
          return room;
        }
      });

    case "SEND_MESSAGE":
      return state.map(room => {
        if (room.name === action.roomName) {
          return {
            ...room,
            messages: [...room.messages, action.message]
          };
        } else {
          return room;
        }
      });

    case "ORDER_ROOMS_START_STATE":
      state.sort((a, b) => {
        return (
          moment(a.messages[a.messages.length - 1].createdAt) <
          moment(b.messages[b.messages.length - 1].createdAt)
        );
      });
      // console.log(state);
      return state.map(room => room);

    case "CLEAR_UNREAD":
      return state.map(room => {
        if (room.name === action.roomName) {
          const people = room.people.map(p => {
            if (p.id === action.uid) {
              return {
                ...p,
                unread: action.unread,
                lastRead: action.time
              };
            } else {
              return p;
            }
          });
          return { ...room, people };
        } else {
          return room;
        }
      });

    case "LEAVE_ROOM":
      return state.filter(room => {
        return room.name !== action.roomName;
      });
    case "CLEAR_STATE":
      return [];
    default:
      return state;
  }
};

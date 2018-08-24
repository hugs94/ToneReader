import { db } from "../firebase/firebase";
import { history } from "../router/App";
import moment from "moment";

/* ~~~set state within roomState, see rooms.js in reducers~~~
* createRoom, creates room for client. 'generated' 
* is called for each room user is part of
*/
export const createRoom = ({ name, people, messages = [] }) => ({
  type: "CREATE_ROOM",
  room: {
    name,
    people,
    messages
  }
});

//Get initial rooms
export const setUsersRooms = rooms => ({
  type: "USERS_ROOM",
  rooms
});

export const sendMessage = (message, roomName) => ({
  type: "SEND_MESSAGE",
  message,
  roomName
});

export const orderRoomsStartState = () => ({
  type: "ORDER_ROOMS_START_STATE"
});
//Clears state
export const clearState = {
  type: "CLEAR_STATE"
};

export const leaveRoom = (roomName, userId) => ({
  type: "LEAVE_ROOM",
  roomName,
  userId
});

export const onLeft = (roomName, personID) => ({
  type: "ON_LEFT",
  roomName,
  personID
});

export const onJoined = (roomName, person) => ({
  type: "ON_JOINED",
  roomName,
  person
});
//Clears unread messages
export const clearUnread = (roomName, uid, time, unread) => ({
  type: "CLEAR_UNREAD",
  roomName,
  uid,
  time,
  unread
});

// ~~~database (firebase) interactions below~~~

/* startCreateRoom starts the process of creating rooms and calling
 the database to create a room. */
export const startCreateRoom = (roomObject = {}, showCreateError) => {
  return (dispatch, getState) => {
    const room = {
      name: roomObject.name
    };
    // the following return 'fetches' existing rooms using snapshot,
    return db.ref("rooms").once("value", snapshot => {
      const rooms = [];
      snapshot.forEach(childSnapshot => {
        rooms.push({
          ...childSnapshot.val()
        });
      });
      /*  check if room name already exists, 
       if room name is unique, create room else return msg */
      if (!rooms.find(r => r.name === room.name)) {
        return db
          .ref(`rooms/${room.name}`)
          .set(room)
          .then(ref => {
            // people = all users within room
            return db
              .ref(`rooms/${room.name}/people/${roomObject.people.id}`)
              .set(roomObject.people)
              .then(() => {
                db.ref(`users/${roomObject.people.id}/rooms/${room.name}`).set({
                  roomName: room.name
                });

                dispatch(
                  // update state roomState with new room data
                  createRoom({
                    ...roomObject,
                    //id: roomObject.people.id,
                    //name: roomObject.name,
                    people: [roomObject.people]
                    //messages: []
                  })
                );
                const perName = roomObject.people.name;
                //send initial message, using 'first'/creater of room
                dispatch(
                  startSendMessage(
                    `${perName} created this room`,
                    room.name,
                    true
                  )
                ).then(() => {
                  dispatch(startListening(room.name));
                  history.push(`/room/${room.name}`);
                });
              });
          });
      } else {
        return showCreateError("Room name not available!");
      }
    });
  };
};

/* listen to room by roomName or key */
export const startListening = roomName => {
  return (dispatch, getState) => {
    return db
      .ref(`rooms/${roomName}/messages`)
      .on("child_added", msgSnapshot => {
        // find room in database (room exist check is done in earlier promise chain)
        if (getState().roomState.find(r => r.name === roomName)) {
          db.ref(`rooms/${roomName}/people`).once("value", personSnapshot => {
            const message = msgSnapshot.val();
            // update message state
            dispatch(
              sendMessage({ ...message, id: msgSnapshot.key }, roomName)
            );
            // update roomState
            dispatch(orderRoomsStartState());
            if (
              message.sender.displayName !==
              getState().sessionState.authUser.displayName
            ) {
              const audio = new Audio("/sounds/notif.mp3");
              audio.play();
            }
            // check message state to initiate room leaving//room join
            const keyword =
              message.status && message.text.split(" ").splice(-1, 1)[0];
            if (keyword === "left") {
              dispatch(onLeft(roomName, message.sender.uid));
            } else if (keyword === "joined") {
              dispatch(
                onJoined(roomName, personSnapshot.val()[message.sender.uid])
              );
            }
            const personID = getState().sessionState.authUser.uid;
            /* check message state to initiate firebase fetch of rooms/people
             else create a snapshot of last 'state' that user 'sees' */
            if (personID === message.sender.uid && keyword !== "left") {
              db.ref(`rooms/${roomName}/people/${personID}`)
                .update({ unread: 0, lastRead: message.createdAt })
                .then(() => {
                  dispatch(setUnread(roomName, personID, message.createdAt, 0));
                });
            } else if (
              personID !== message.sender.uid &&
              moment(message.createdAt) >
                moment(personSnapshot.val()[personID].lastRead)
            ) {
              db.ref(`rooms/${roomName}/people/${personID}`)
                .update({
                  unread: personSnapshot.val()[personID].unread + 1,
                  lastRead: message.createdAt
                })
                .then(() => {
                  dispatch(
                    setUnread(
                      roomName,
                      personID,
                      message.createdAt,
                      personSnapshot.val()[personID].unread + 1
                    )
                  );
                });
            }
          });
        }
      });
  };
};
/* Initiate creation of room, requires state to 'exist' ...maybe */

export const startJoinRoom = (data = {}, showJoinError) => {
  return (dispatch, getState) => {
    const state = getState();
    return db.ref(`rooms/${data.roomName}`).once("value", snapshot => {
      /* value is not a 'real' value. simiply exist as "" non null value
        used for targeting rooms in general within db */
      const value = snapshot.val();
      const id = data.id;
      /* check room existance, startListening which performs promise chains 
      with db for room functionality */
      if (value === null) {
        return showJoinError("Room not found!");
      } else if (value.people && value.people[id]) {
        history.push(`room/${data.roomName}`);
      } else {
        dispatch(startListening(data.roomName));
        const person = {
          name: data.name,
          id: data.id,
          unread: data.unread,
          lastRead: 0
        };

        let people = [];
        let messages = [];
        for (let key in value.people) {
          people.push({
            id: value.people[key].id,
            name: value.people[key].name,
            unread: value.people[key].unread,
            lastRead: value.people[key].lastRead
          });
        }
        for (let key in value.messages) {
          messages.push({
            ...value.messages[key]
          });
        }
        return db
          .ref(`rooms/${data.roomName}/people/${person.id}`)
          .set(person)
          .then(ref => {
            db.ref(`users/${person.id}/rooms/${data.roomName}`).set({
              roomName: data.roomName
            });
            /* fill values from db then update roomState with returned data */
            dispatch(
              createRoom({
                people: [...people, person],
                name: data.roomName,
                messages
              })
            );
            const perName = person.name;

            dispatch(
              startSendMessage(`${perName} joined`, data.roomName, true)
            );

            history.push(`room/${data.roomName}`);
          });
      }
    });
  };
};
/* send message to database */
export const startSendMessage = (text, roomName, status = false) => {
  return (dispatch, getState) => {
    const user = getState().sessionState.authUser;
    if (user) {
      const uid = user.uid;
      const displayName = user.displayName;
      const message = {
        sender: { uid, displayName },
        text,
        createdAt: moment().format(),
        status
      };
      return db.ref(`rooms/${roomName}/messages`).push(message);
    }
  };
};
/* initiates a 'empty' state, used to listen when page is initially loaded
required for state updates to properly function. It then grabs all the existing rooms
(if user is auth'd) and messages */
export const setStartState = () => {
  return (dispatch, getState) => {
    //console.log("setting start state");
    const uid = getState().sessionState.uid;
    if (uid) {
      //console.log("user found");
      return db.ref(`users/${uid}`).once("value", snapshot => {
        if (snapshot.val()) {
          //console.log("snapshot", snapshot.val());
          const rooms = snapshot.val().rooms;
          dispatch(setUsersRooms(rooms));
          //console.log(rooms);
          for (var key in rooms) {
            /* key used to have if/else, removed.
              Do NOT delete 'rooms' in firebase without also removing 
              the 'rooms' listed under users. 
              Otherwise error will occur. 
              This shouldnt happen under normal usage so if/else ommited*/
            //if (key){
            dispatch(startListening(key));
            db.ref(`rooms/${key}`).once("value", snapshot => {
              const room = snapshot.val();
              const { name, people, messages } = room;
              let peopleArray = [],
                messagesArray = [];
              for (var peopleKey in people) {
                peopleArray.push(people[peopleKey]);
              }
              for (var messagesKey in messages) {
                messagesArray.push({
                  ...messages[messagesKey],
                  id: messagesKey
                });
              }
              //console.log("creating room");
              dispatch(
                createRoom({
                  name,
                  people: peopleArray,
                  messages: messagesArray
                })
              );
            });
          }
          dispatch(orderRoomsStartState());
        }
      });
    }
  };
};
/* leaves room */
export const startLeaveRoom = roomName => {
  return (dispatch, getState) => {
    const user = getState().sessionState.authUser;
    if (user) {
      const userId = user.uid;
      const displayName = user.displayName;
      db.ref(`rooms/${roomName}/people/${userId}`).remove();
      db.ref(`users/${userId}/rooms/${roomName}`).remove(() => {
        dispatch(leaveRoom(roomName, userId));
        dispatch(startSendMessage(`${displayName} left`, roomName, true));
        history.push("/join");
      });
    }
  };
};

export const setUnread = (roomName, uid, time, unread) => {
  return dispatch => {
    dispatch(clearUnread(roomName, uid, time, unread));
  };
};

export const startClearUnread = roomName => {
  return (dispatch, getState) => {
    let time = moment().endOf("month");
    const uid = getState().sessionState.authUser.uid;
    if (uid) {
      time = moment().format();
      return db
        .ref(`rooms/${roomName}/people/${uid}`)
        .update({
          unread: 0,
          lastRead: time
        })
        .then(() => {
          dispatch(clearUnread(roomName, uid, time, 0));
        });
    }
  };
};

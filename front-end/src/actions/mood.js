import { db } from "../firebase/firebase";
import { history } from "../router/App";
import moment from "moment";
import { convertText } from "../constructor/moodConfig";
import { USER_TONE_DEFAULT } from "../const/emotes";

/* createMood is called inside constructor/moodConfig
listed here for consistancy with ./rooms.js */
export const createMood = ({ name, people, messages = [] }) => ({
  type: "CREATE_WAIT_MOOD",
  room: {
    name,
    people,
    messages
  }
});
export const preSetMood = ({ updateDefaultTone }) => {
  if (updateDefaultTone) {
    setMood(updateDefaultTone);
  } else {
    setMood(USER_TONE_DEFAULT);
  }
};
export const setMood = moodResult => ({
  type: "MOOD_USER_SET",
  moodResult
});
export const setMoodWaitFB = rooms => ({
  type: "USERS_ROOM_WAIT",
  rooms
});

export const setMoodWaitFB2 = () => ({
  type: "USERS_ROOM_MOOD_WAIT"
});

export const getMoodData = () => {
  return (dispatch, getState) => {
    //console.log("setting start state");
    const uid = getState().sessionState.uid;
    if (uid) {
      //console.log("user found");
      return db.ref(`users/${uid}/rooms/`).once("value", snapshot => {
        if (snapshot.val()) {
          //console.log("snapshot", snapshot.val());
          const rooms = snapshot.val();
          //.rooms;
          //console.log(rooms);
          dispatch(setMoodWaitFB(rooms));
          for (var key in rooms) {
            /* key used to have if/else, removed.
                Do NOT delete 'rooms' in firebase without also removing 
                the 'rooms' listed under users. 
                Otherwise error will occur. 
                This shouldnt happen under normal usage so if/else ommited*/
            //if (key){
            //dispatch(startListening(key));
            db.ref(`rooms/${key}`).once("value", snapshot => {
              const room = snapshot.val();
              const messages = room.messages,
                people = room.people,
                roomName = room.name;

              let messagesArray = [],
                peopleArray = [];
              for (var messagesKey in messages) {
                messagesArray.push({
                  ...messages[messagesKey]
                });
              }
              for (var peopleKey in people) {
                peopleArray.push(people[peopleKey]);
              }
              dispatch(
                setMoodWaitFB2({
                  name: roomName,
                  people: peopleArray,
                  messages: messagesArray
                })
              );

              /* convert array into object take req data only */
              messagesArray.reverse();
              const msgById = messagesArray.reduce(function(obj, item) {
                obj[item.sender.uid] = obj[item.sender.uid] || [];
                let msgData = {
                  text: item.text
                };
                obj[item.sender.uid].push(msgData);
                return obj;
              }, {});
              /* convert back to array containing objects */
              const setSendMsgArr = Object.keys(msgById).map(function(key) {
                return { senderId: key, msgData: msgById[key] };
              });

              let userPresent = peopleArray.map(p => p.id);
              /* remove msgs from users not in room db */
              setSendMsgArr.forEach(i => {
                if (userPresent.includes(i.senderId) == false) {
                  return setSendMsgArr.splice(i, 1);
                }
              });
              /* use 'opposite' of above to 'isolate' array of messages per user */
              userPresent.forEach(i => {
                let obj = setSendMsgArr.find(o => o.senderId === i);
                convertText(obj, roomName);
                dispatch(setMood(convertText));
              });
            });
          }
        }
      });
    }
  };
};

// "{"tone_input":
// {"text":"but you know how it is.
// its pretty stressfull, still needs lots of styling.
// Its your boy, tone boy. coming at you with a medium app.
// . ToneBoi created this room"},
// "content_type":"application/json",
// "senderId":"1M2qofg75iX7aI0pBMPjVvAbeL33",
// "room":"RoomOne"}"

//;

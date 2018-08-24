import { db } from "./firebase";

// Update user with displayName and room value
export const doCreateUser = (id, displayName, email) =>
  db.ref(`users/${id}`).set({
    displayName,
    uid: id,
    email,
    rooms: []
  });
// Find all users
export const onceGetUsers = () => db.ref("users").once("value");

// Room API
// export const onceGetRooms = id => {
//   return db.ref(`/users/${id}`).once("value", snapshot => {
//     if (snapshot.val()) {
//       const rooms = snapshot.val().rooms;
//       return rooms;
//     }
//   });
// };

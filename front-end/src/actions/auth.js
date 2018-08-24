//import { firebase, auth, db as database } from "../firebase/firebase";
//import { doCreateUserWithEmailAndPassword } from "../firebase/auth";

// export const startLogin = () => {
//   return () => {
//     return (firebase.auth().doCreateUserWithEmailAndPassword = (
//       email,
//       password
//     ) => auth.createUserWithEmailAndPassword(email, password));

//     firebase
//       .auth()
//       .then(function(result) {
//         var user = result.user;
//         const displayName = user.displayName ? user.displayName : user.email;
//         database.ref(`users/${user.uid}`).once(snapshot => {
//           if (!snapshot.val()) {
//             database.ref(`users/${user.uid}`).set({
//               displayName,
//               uid: user.uid,
//               email: user.email,
//               rooms: []
//             });
//           }
//         });

//         // ...
//       })
//       .catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;
//         // ...
//       });
//   };
// };

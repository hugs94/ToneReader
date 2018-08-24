import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// const prodConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.FIREBASE_DATABASE_URL,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
// };

const devConfig = {
  apiKey: "AIzaSyDyxqdHPtQk7pA-0tDjIEKcl2_cuBPY4KY",
  authDomain: "tonechat-cd7c5.firebaseapp.com",
  databaseURL: "https://tonechat-cd7c5.firebaseio.com",
  projectId: "tonechat-cd7c5",
  storageBucket: "tonechat-cd7c5.appspot.com",
  messagingSenderId: "819707481462"
};
//require("dotenv").config();

const config = devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export { db, auth };

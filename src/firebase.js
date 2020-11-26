import firebase from 'firebase'
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAiQcHBl-WbUMlf7OtUhFpgGG6elcVwq0Y",
    authDomain: "essential-supplies-s.firebaseapp.com",
    databaseURL: "https://essential-supplies-s.firebaseio.com",
    projectId: "essential-supplies-s",
    storageBucket: "essential-supplies-s.appspot.com",
    messagingSenderId: "910417048349",
    appId: "1:910417048349:web:aa6707e7d94f53893127f4",
    measurementId: "G-60WZZKZK1T"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;

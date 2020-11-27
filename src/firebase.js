import firebase from 'firebase'
import 'firebase/storage'
<script src="https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js"></script>

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAUw6CV5-3w8J_qvHPaJz-P5NXazThc8MU",
    authDomain: "essential-supplies-stock.firebaseapp.com",
    databaseURL: "https://essential-supplies-stock.firebaseio.com",
    projectId: "essential-supplies-stock",
    storageBucket: "essential-supplies-stock.appspot.com",
    messagingSenderId: "335873225600",
    appId: "1:335873225600:web:ebd20b1392e4e1a48cc765",
    measurementId: "G-EH5ER8YD2X"
  };
  <script src="https://www.gstatic.com/firebasejs/8.1.1/firebase-analytics.js"></script>
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const provider = new firebase.auth.GoogleAuthProvider();
  const auth = firebase.auth();
  const storage = firebase.storage();
  export {
    storage, provider, auth, firebase as default
  }

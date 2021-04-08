import firebase from "firebase/app"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-b8TlU44SKBlbX6L2OcJgqv-M4zHYIhQ",
    authDomain: "fir-basic-e8561.firebaseapp.com",
    databaseURL: "https://fir-basic-e8561.firebaseio.com",
    projectId: "fir-basic-e8561",
    storageBucket: "fir-basic-e8561.appspot.com",
    messagingSenderId: "316121235034",
    appId: "1:316121235034:web:5fab6f8dbc5c12c597a263",
    measurementId: "G-EQWQN4PMVJ"
  };

  firebase.initializeApp(firebaseConfig);
  export default firebase;
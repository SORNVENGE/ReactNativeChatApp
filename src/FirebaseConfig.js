
import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyA7gzNvjhCksAXL3mmqe2R1cvjWiL_MFlw",
    authDomain: "reactnativefirebase-f8705.firebaseapp.com",
    databaseURL: "https://reactnativefirebase-f8705.firebaseio.com",
    projectId: "reactnativefirebase-f8705",
    storageBucket: "reactnativefirebase-f8705.appspot.com",
    messagingSenderId: "884490684926"
  };
 export const firebaseApp= firebase.initializeApp(config);
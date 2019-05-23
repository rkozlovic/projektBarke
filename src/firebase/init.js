import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDsHH9bm39DtvI5QrPNVMlvJ-lwfNEqdq8",
  authDomain: "brojektbarke.firebaseapp.com",
  databaseURL: "https://brojektbarke.firebaseio.com",
  projectId: "brojektbarke",
  storageBucket: "brojektbarke.appspot.com",
  messagingSenderId: "1034469636951",
  appId: "1:1034469636951:web:f896bd7f7650030b"
};
const firebaseApp = firebase.initializeApp(config);
//firebaseApp.firestore().settings({ timestampsInSnapshots: true })

// export firestore database
export default firebaseApp.firestore()

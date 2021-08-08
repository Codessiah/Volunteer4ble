import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyArOg-1i-PG9WubSwN40-F_7qsyuhy28U4",
    authDomain: "volunteer4ble.firebaseapp.com",
    projectId: "volunteer4ble",
    storageBucket: "volunteer4ble.appspot.com",
    messagingSenderId: "891663652656",
    appId: "1:891663652656:web:bb7f1981cbf198dc7c9af5"
};

let fapp = firebase.initializeApp(firebaseConfig);
let storageRef = firebase.storage().ref();

export { fapp, firebase, storageRef };

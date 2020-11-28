import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
    apiKey: "AIzaSyBTwETxJ0aAFxZOew78lx_tm6-rSs4iEzE",
    authDomain: "majoramassage.firebaseapp.com",
    databaseURL: "https://majoramassage.firebaseio.com",
    projectId: "majoramassage",
    storageBucket: "majoramassage.appspot.com",
    messagingSenderId: "621986008320",
    appId: "1:621986008320:web:581cdb431ea34b4ec177e5"
});

export default app;

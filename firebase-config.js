// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD39GHSdPfjLzkt0l7X6Oz2rJ2U4awcNdc",
    authDomain: "formfluen1.firebaseapp.com",
    projectId: "formfluen1",
    storageBucket: "formfluen1.firebasestorage.app",
    messagingSenderId: "582966937119",
    appId: "1:582966937119:web:abbfeb14749c421f46b72a",
    measurementId: "G-0M59B8V00N",
    databaseURL: "https://formfluen1-default-rtdb.firebaseio.com/"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Firebase Realtime Database
const database = firebase.database(); 
// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAmI5jJHkYJhFIco84vlwKIVIdDxwI_7Ak",
    authDomain: "testing-e6ee0.firebaseapp.com",
    projectId: "testing-e6ee0",
    storageBucket: "testing-e6ee0.appspot.com",
    messagingSenderId: "792157577045",
    appId: "1:792157577045:web:d9436f217c44cf9db0d9dc",
    measurementId: "G-BQ54Y1292N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
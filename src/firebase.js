import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getDatabase,ref} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFa1LYZFuoHS3ZMdvsWcVyDdzsoFAT9x4",
    authDomain: "trainingappdemo-a0272.firebaseapp.com",
    databaseURL: "https://trainingappdemo-a0272-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "trainingappdemo-a0272",
    storageBucket: "trainingappdemo-a0272.appspot.com",
    messagingSenderId: "737206302037",
    appId: "1:737206302037:web:37f6bff5a014504c0f2bdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export default app;
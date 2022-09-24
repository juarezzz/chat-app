import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyALMrqE00NhYjwifS4xcDuVf7xP0YiMuv4",
    authDomain: "superchat-1de7d.firebaseapp.com",
    projectId: "superchat-1de7d",
    storageBucket: "superchat-1de7d.appspot.com",
    messagingSenderId: "886426079204",
    appId: "1:886426079204:web:19ffa8750ee0de777441f1",
    measurementId: "G-XDFQ8ER6SN"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
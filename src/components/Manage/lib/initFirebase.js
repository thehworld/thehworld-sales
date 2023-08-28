// Modular Firebase v.9 Initialization.
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "@firebase/database";

const clientCredentials = {
    apiKey: "AIzaSyBX-PPNROU__FGeSYXKhLVscCKA7AitDBE",
    authDomain: "thehworld-static-image.firebaseapp.com",
    projectId: "thehworld-static-image",
    storageBucket: "thehworld-static-image.appspot.com",
    messagingSenderId: "720429275308",
    appId: "1:720429275308:web:0c5b486196ee4f40eee709",
    measurementId: "G-VFW99WBNFL"
};

function initFirebase() {
    if (typeof window !== undefined) {
        initializeApp(clientCredentials);
        console.log("Firebase has been init successfully");
    }
}

const app = initializeApp(clientCredentials);

const db = getFirestore(app);

const realDB = getDatabase(app);

export { initFirebase, db, realDB };
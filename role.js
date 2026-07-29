import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR API KEY",
    authDomain: "YOUR AUTH DOMAIN",
    projectId: "YOUR PROJECT ID",
    storageBucket: "YOUR STORAGE",
    messagingSenderId: "YOUR SENDER ID",
    appId: "YOUR APP ID"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export async function getCurrentRole(){

    const user = auth.currentUser;

    if(!user){

        return null;

    }

    const snap = await getDoc(doc(db,"users",user.uid));

    if(!snap.exists()){

        return null;

    }

    return snap.data().role;

}

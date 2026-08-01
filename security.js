import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQZREq5abr_oLzt6ksMGb-1jhlnKc92pU",
    authDomain: "priyanshu-roadlines-pod.firebaseapp.com",
    projectId: "priyanshu-roadlines-pod",
    storageBucket: "priyanshu-roadlines-pod.firebasestorage.app",
    messagingSenderId: "735411516260",
    appId: "1:735411516260:web:397d6a80141f032c0a0071"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

function getDeviceId() {

    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {

        deviceId =
        "device_" +
        Math.random().toString(36).substring(2,15);

        localStorage.setItem("deviceId", deviceId);
    }

    return deviceId;
}

export function checkSecurity(callback){

    onAuthStateChanged(auth, async(user)=>{

        if(!user){

            alert("Please login first.");

            window.location.replace("pod.html");

            return;
        }

        const deviceId = getDeviceId();

        const q = query(

            collection(db,"trustedDevices"),

            where("deviceId","==",deviceId),

            where("approved","==",true)

        );

        const snap = await getDocs(q);

        if(snap.empty){

            alert("Device not approved.");

            window.location.replace("pod.html");

            return;
        }

        callback();

    });

}

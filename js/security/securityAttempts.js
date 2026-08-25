import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


// ============================================
// FIREBASE CONFIG
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyBQZREq5abr_oLzt6ksMGb-1jhlnKc92pU",
    authDomain: "priyanshu-roadlines-pod.firebaseapp.com",
    projectId: "priyanshu-roadlines-pod",
    storageBucket: "priyanshu-roadlines-pod.firebasestorage.app",
    messagingSenderId: "735411516260",
    appId: "1:735411516260:web:397d6a80141f032c0a0071"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ============================================
// DEVICE ID
// ============================================

function getDeviceId() {

    let deviceId =
        localStorage.getItem("securityDeviceId");

    if (!deviceId) {

        deviceId =
            "DEV-" +
            crypto.randomUUID();

        localStorage.setItem(
            "securityDeviceId",
            deviceId
        );
    }

    return deviceId;
}


// ============================================
// RECORD FAILED LOGIN
// ============================================

export async function recordFailedLoginAttempt({
    loginType,
    email,
    mobile,
    fullname
}) {

    const deviceId = getDeviceId();

    await addDoc(
        collection(db, "securityAttempts"),
        {

            type: "Failed Login Attempt",

            loginType: loginType,

            deviceId: deviceId,

            email: email || "",

            mobile: mobile || "",

            fullname: fullname || "",

            timestamp: serverTimestamp()

        }
    );

}

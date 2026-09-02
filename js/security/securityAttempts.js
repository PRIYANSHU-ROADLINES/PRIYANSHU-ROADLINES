import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import {
    createSecurityAlert
}
from "./securityAlerts.js";

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

    // ============================================
    // RECORD FAILED ATTEMPT
    // ============================================

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


    // ============================================
    // COUNT FAILED ATTEMPTS FOR THIS DEVICE
    // ============================================

    const counterRef = doc(
        db,
        "securityAttempts",
        deviceId
    );

    const currentCounter = localStorage.getItem(
        "securityAttemptCount"
    );

    let attempts =
        Number(currentCounter || 0) + 1;


    localStorage.setItem(
        "securityAttemptCount",
        attempts.toString()
    );


    console.log(
        "Security attempt count:",
        attempts
    );


    // ============================================
    // 5 FAILED ATTEMPTS
    // ============================================

    if (attempts >= 5) {

    try {

        await createSecurityAlert({

            loginType: "operator",

            email: email || "",

            mobile: mobile || "",

            fullname: fullname || "",

            attempts: attempts,

            deviceId: deviceId

        });

        console.log(
            "SECURITY ALERT CREATED"
        );

        // ============================================
        // RESET COUNTER AFTER SUCCESSFUL ALERT
        // ============================================

        localStorage.setItem(
            "securityAttemptCount",
            "0"
        );

        console.log(
            "Security attempt counter reset to 0"
        );

    } catch (error) {

        console.error(
            "SECURITY ALERT CREATION FAILED:",
            error
        );

    }

}

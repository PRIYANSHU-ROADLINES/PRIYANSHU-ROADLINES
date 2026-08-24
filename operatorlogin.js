import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
doc,
setDoc,
getDoc,
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
// FAILED OPERATOR ATTEMPT TRACKER
// ============================================

async function recordFailedAttempt(email, mobile, fullname) {

    const attemptRef = doc(
        db,
        "securityAttempts",
        "operatorVerification"
    );

    const attemptSnap = await getDoc(attemptRef);

    let attempts = 0;

    if (attemptSnap.exists()) {
        attempts = attemptSnap.data().attempts || 0;
    }

    attempts++;

    await setDoc(attemptRef, {

        attempts: attempts,

        email: email,

        mobile: mobile,

        fullname: fullname,

        lastAttemptTime: serverTimestamp(),

        type: "Failed Operator Verification"

    });

    // ========================================
    // 5 FAILED ATTEMPTS = CREATE ADMIN ALERT
    // ========================================

    if (attempts === 5) {

        await setDoc(
            doc(
                db,
                "securityAlerts",
                "operatorVerificationAlert"
            ),
            {

                type:
                    "5 Failed Operator Login Attempts",

                attempts: attempts,

                email: email,

                mobile: mobile,

                fullname: fullname,

                timestamp:
                    serverTimestamp(),

                status: "New",

                blocked: false

            }
        );

    }

}
// ============================================
// OPERATOR LOGIN
// ============================================

document
    .getElementById("verifyBtn")
    .addEventListener("click", verifyOperator);


async function verifyOperator() {

    const mobile =
        document.getElementById("mobile").value.trim();

    const fullname =
        document.getElementById("fullname").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const uniqueCode =
        document.getElementById("uniqueCode").value.trim();


    const snap =
        await getDocs(
            collection(db, "operators")
        );


    let found = false;

    let operatorRole = "";

    let operatorName = "";

    let operatorDesignation = "";


    snap.forEach((docItem) => {

        const data = docItem.data();


        if (
            data.mobile === mobile &&
            data.fullName === fullname &&
            data.email === email &&
            data.uniqueCode === uniqueCode &&
            data.active === true
        ) {

            found = true;

            operatorRole = data.role;

            operatorName = data.fullName;

            operatorDesignation = data.designation;

        }

    });


    // ============================================
    // SUCCESSFUL OPERATOR LOGIN
    // ============================================

    if (found) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        localStorage.setItem(
            "role",
            operatorRole
        );

        localStorage.setItem(
            "name",
            operatorName
        );

        localStorage.setItem(
            "designation",
            operatorDesignation
        );

        console.log("Operator role received:", operatorRole);
console.log("Operator role type:", typeof operatorRole);
        if (operatorRole === "staff") {

            alert(
                "Staff Verified Successfully"
            );

        }
        
        else if (
            operatorRole === "admin"
        ) {

            alert(
                "Administrator Login Successfully"
            );

        }

        else {

            alert(
                "Operator Not Identified"
            );

        }


        window.location.href =
            "index.html";

        return;
    }


    // ============================================
    // FAILED OPERATOR LOGIN
    // ============================================

    await recordFailedAttempt(
    email,
    mobile,
    fullname
);

alert(
    "Operator Not Identified"
);

window.location.href =
    "index.html";

}


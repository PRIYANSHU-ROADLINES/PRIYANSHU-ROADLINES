import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    recordFailedLoginAttempt
}
from "./js/security/securityAttempts.js";
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
    try {

    await recordFailedLoginAttempt({

        loginType: "operator",

        email: email,

        mobile: mobile,

        fullname: fullname

    });

}
catch (error) {

    console.error(
        "Security attempt recording failed:",
        error
    );

}
    
    alert(
        "Operator Not Identified"
    );

    window.location.href =
        "index.html";

}


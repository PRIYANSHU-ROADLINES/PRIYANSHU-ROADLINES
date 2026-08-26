import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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

const auth = getAuth(app);

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

    const password =
    document.getElementById("operatorPassword").value;
    
    const snap =
        await getDocs(
            collection(db, "operators")
        );


    let found = false;

    let operatorRole = "";

    let operatorName = "";

    let operatorDesignation = "";

    let operatorAuthUid = "";

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
            operatorAuthUid = data.authUid;
            
        }

    });


    // ============================================
    // SUCCESSFUL OPERATOR LOGIN
    // ============================================

// ============================================
// OPERATOR NOT FOUND
// ============================================

if (!found) {

    try {

        await recordFailedLoginAttempt({
            loginType: "operator",
            email: email,
            mobile: mobile,
            fullname: fullname
        });

    } catch (error) {

        // Keep technical security-module errors out of console
    }

    alert(
        "Operator Not Identified"
    );

    return;
}


// ============================================
// FIREBASE AUTHENTICATION
// ============================================

try {

    const credential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

    const firebaseUser =
        credential.user;


    // ============================================
    // VERIFY AUTH UID
    // ============================================

    if (
        !operatorAuthUid ||
        firebaseUser.uid !== operatorAuthUid
    ) {

        await auth.signOut();

        alert(
            "Authentication failed.\n\nThe operator account is not correctly linked."
        );

        return;
    }


} catch (authError) {

    alert(
        "Authentication failed.\n\nPlease check your password."
    );

    return;
}


// ============================================
// CREATE LOCAL SESSION
// ============================================

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

localStorage.setItem(
    "email",
    email
);


// ============================================
// SUCCESS MESSAGE
// ============================================

if (operatorRole === "staff") {

    alert(
        "Staff Verified Successfully"
    );

}

else if (operatorRole === "admin") {

    alert(
        "Administrator Login Successfully"
    );

}

else {

    await auth.signOut();

    localStorage.clear();

    alert(
        "Operator role is not authorized."
    );

    return;
}


// ============================================
// RETURN TO MAIN PAGE
// ============================================

window.location.href =
    "index.html";

return;

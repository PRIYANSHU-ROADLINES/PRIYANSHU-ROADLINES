import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


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


// ============================================
// FIREBASE INITIALIZATION
// ============================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ============================================
// ADMIN DASHBOARD ACCESS CHECK
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    checkAdminAccess
);


async function checkAdminAccess() {

    // ============================================
    // GET CURRENT OPERATOR LOGIN SESSION
    // ============================================

    const loggedIn =
        localStorage.getItem("loggedIn");

    const role =
        localStorage.getItem("role");

    const email =
        localStorage.getItem("email");


    console.log(
        "Dashboard loggedIn:",
        loggedIn
    );

    console.log(
        "Dashboard role:",
        role
    );

    console.log(
        "Dashboard email:",
        email
    );


    // ============================================
    // NO LOGIN
    // ============================================

    if (loggedIn !== "true") {

        console.warn(
            "Admin Dashboard: No login session."
        );

        window.location.replace(
            "index.html"
        );

        return;
    }


    // ============================================
    // MUST BE ADMIN
    // ============================================

    if (role !== "admin") {

        console.warn(
            "Admin Dashboard: User is not an admin."
        );

        window.location.replace(
            "index.html"
        );

        return;
    }


    // ============================================
    // VERIFY ADMIN IN OPERATORS COLLECTION
    // ============================================

    try {

        const operatorsSnapshot =
            await getDocs(
                collection(
                    db,
                    "operators"
                )
            );


        let adminFound = false;

        let adminData = null;


        operatorsSnapshot.forEach(
            (operatorDoc) => {

                const data =
                    operatorDoc.data();


                if (
                    data.role === "admin" &&
                    data.active === true &&
                    data.email === email
                ) {

                    adminFound = true;

                    adminData = data;

                }

            }
        );


        // ============================================
        // ADMIN NOT FOUND
        // ============================================

        if (!adminFound) {

            console.warn(
                "Admin Dashboard: Admin verification failed."
            );

            localStorage.removeItem(
                "loggedIn"
            );

            localStorage.removeItem(
                "role"
            );

            localStorage.removeItem(
                "name"
            );

            localStorage.removeItem(
                "designation"
            );

            localStorage.removeItem(
                "email"
            );


            window.location.replace(
                "index.html"
            );

            return;
        }


        // ============================================
        // ADMIN VERIFIED
        // ============================================

        console.log(
            "================================"
        );

        console.log(
            "ADMIN DASHBOARD ACCESS GRANTED"
        );

        console.log(
            "Admin:",
            adminData.fullName
        );

        console.log(
            "Email:",
            adminData.email
        );

        console.log(
            "Designation:",
            adminData.designation
        );

        console.log(
            "================================"
        );


        // ============================================
        // DISPLAY ADMIN INFORMATION
        // ============================================

        const adminName =
            document.getElementById(
                "adminName"
            );

        if (adminName) {

            adminName.textContent =
                adminData.fullName;

        }


        const adminDesignation =
            document.getElementById(
                "adminDesignation"
            );

        if (adminDesignation) {

            adminDesignation.textContent =
                adminData.designation ||
                "Administrator";

        }

    }
    catch (error) {

        console.error(
            "Admin Dashboard verification error:",
            error
        );

        window.location.replace(
            "index.html"
        );

    }

}

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

    const loggedIn = localStorage.getItem("loggedIn");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");


    // ============================================
    // NO LOGIN
    // ============================================

    if (loggedIn !== "true") {

        alert("Access Denied!\n\nAdmin login is required to access this page.");

        window.location.replace("index.html");

        return;
    }


    // ============================================
    // MUST BE ADMIN
    // ============================================

    if (role !== "admin") {

        alert("Access Denied!\n\nYou do not have permission to access the Admin Dashboard.");

        window.location.replace("index.html");

        return;
    }


    // ============================================
    // VERIFY ADMIN IN FIRESTORE
    // ============================================

    try {

        const operatorsSnapshot = await getDocs(
            collection(db, "operators")
        );


        let adminFound = false;
        let adminData = null;


        operatorsSnapshot.forEach((operatorDoc) => {

            const data = operatorDoc.data();

            if (
                data.role === "admin" &&
                data.active === true &&
                data.email === email
            ) {

                adminFound = true;
                adminData = data;

            }

        });


        // ============================================
        // ADMIN NOT FOUND
        // ============================================

        if (!adminFound) {

            alert(
                "Access Denied!\n\nYour administrator account could not be verified."
            );

            window.location.replace("index.html");

            return;
        }


        // ============================================
        // ACCESS GRANTED
        // ============================================

        const adminName =
            document.getElementById("adminName");

        if (adminName) {

            adminName.textContent =
                adminData.fullName || "Administrator";

        }


        const adminDesignation =
            document.getElementById("adminDesignation");

        if (adminDesignation) {

            adminDesignation.textContent =
                adminData.designation || "Administrator";

        }

    }
    catch (error) {

        // Do not expose technical Firebase information
        // to the browser console.

        alert(
            "Unable to verify administrator access.\n\nPlease try again."
        );

        window.location.replace("index.html");

        return;
    }

}

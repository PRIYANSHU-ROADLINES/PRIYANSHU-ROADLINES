import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
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

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================
// ADMIN ACCESS CHECK
// ============================================

onAuthStateChanged(auth, async (user) => {

    // ----------------------------------------
    // NO FIREBASE LOGIN
    // ----------------------------------------

    if (!user) {

        console.warn(
            "Admin dashboard access denied: User not logged in."
        );

        window.location.href =
            "index.html";

        return;
    }


    // ----------------------------------------
    // GET USER ROLE
    // ----------------------------------------

    try {

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const userSnap =
            await getDoc(userRef);


        if (!userSnap.exists()) {

            console.warn(
                "Admin dashboard access denied: User record not found."
            );

            await auth.signOut();

            window.location.href =
                "index.html";

            return;
        }


        const userData =
            userSnap.data();

        const role =
            userData.role;


        console.log(
            "Admin dashboard user:",
            user.email
        );

        console.log(
            "Admin dashboard role:",
            role
        );


        // ----------------------------------------
        // OWNER CHECK
        // ----------------------------------------

        if (role !== "owner") {

            console.warn(
                "Admin dashboard access denied: Not an owner."
            );

            await auth.signOut();

            window.location.href =
                "index.html";

            return;
        }


        // ----------------------------------------
        // ACCESS GRANTED
        // ----------------------------------------

        console.log(
            "Admin dashboard access granted."
        );


    }
    catch (error) {

        console.error(
            "Admin dashboard authentication error:",
            error
        );

        window.location.href =
            "index.html";

    }

});

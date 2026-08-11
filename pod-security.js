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


// --------------------------------------------------
// POD PAGE SECURITY
// --------------------------------------------------

onAuthStateChanged(auth, async (user) => {

    // ----------------------------------------------
    // NO FIREBASE USER
    // ----------------------------------------------

    if (!user) {

        alert("Please sign in first.");

        window.location.replace("signin.html");

        return;
    }


    // ----------------------------------------------
    // GET USER PROFILE
    // ----------------------------------------------

    try {

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const userSnap = await getDoc(userRef);


        // ------------------------------------------
        // PROFILE DOES NOT EXIST
        // ------------------------------------------

        if (!userSnap.exists()) {

            alert("User profile not found.");

            window.location.replace("index.html");

            return;
        }


        const userData = userSnap.data();

        const role = userData.role;


        // ------------------------------------------
        // CHECK STAFF / ADMIN
        // ------------------------------------------

        if (
            role !== "staff" &&
            role !== "admin"
        ) {

            alert(
                "You are not authorized to access POD."
            );

            window.location.replace("index.html");

            return;
        }


        // ------------------------------------------
        // AUTHORIZED
        // ------------------------------------------

        console.log(
            "POD access granted:",
            role
        );

    }

    catch (error) {

        console.error(
            "POD security check failed:",
            error
        );

        alert(
            "Unable to verify your access."
        );

        window.location.replace("index.html");

    }

});

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
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


// Current website role
let currentRole = "guest";


// --------------------------------------------------
// BASIC UI ELEMENTS
// --------------------------------------------------

const signinBtn = document.getElementById("signinBtn");
const userInfo = document.getElementById("userInfo");
const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");
const podMenu = document.getElementById("podMenu");


// --------------------------------------------------
// INITIAL UI
// --------------------------------------------------

function showGuest() {

    currentRole = "guest";

    if (signinBtn) {
        signinBtn.style.display = "block";
    }

    if (userInfo) {
        userInfo.style.display = "none";
    }

    if (podMenu) {
        podMenu.style.display = "none";
    }

    console.log("Guest User");
}


function showLoggedInUser(name, role) {

    currentRole = role;

    if (signinBtn) {
        signinBtn.style.display = "none";
    }

    if (userInfo) {
        userInfo.style.display = "block";
    }

    if (welcomeUser) {
        welcomeUser.innerHTML = "Hello, " + name;
    }

    // POD is ONLY visible to Staff and Admin
    if (podMenu) {

        if (role === "staff" || role === "admin") {

            podMenu.style.display = "block";

        } else {

            podMenu.style.display = "none";

        }
    }

    console.log("Logged in as:", role);
}


// --------------------------------------------------
// CHECK OPERATOR
// --------------------------------------------------

function checkOperatorLogin() {

    const loggedIn =
        localStorage.getItem("loggedIn") === "true";

    const role =
        localStorage.getItem("role");

    const name =
        localStorage.getItem("name");

    if (
        loggedIn &&
        (role === "staff" || role === "admin") &&
        name
    ) {

        return {
            loggedIn: true,
            role: role,
            name: name
        };

    }

    return {
        loggedIn: false
    };
}


// --------------------------------------------------
// CUSTOMER / OPERATOR INITIALIZATION
// --------------------------------------------------

let firebaseCheckFinished = false;


onAuthStateChanged(auth, async (user) => {

    firebaseCheckFinished = true;


    // ----------------------------------------------
    // CUSTOMER LOGGED IN
    // ----------------------------------------------

    if (user) {

        try {

            const snap =
                await getDoc(
                    doc(db, "users", user.uid)
                );


            if (snap.exists()) {

                const data = snap.data();

                showLoggedInUser(
                    data.name,
                    data.role || "customer"
                );

                return;

            }


            // Firebase user exists but profile
            // doesn't exist

            console.log(
                "Firebase user found but customer profile not found."
            );

            showGuest();

            return;

        }

        catch (error) {

            console.error(
                "Error loading customer profile:",
                error
            );

            showGuest();

            return;
        }
    }


    // ----------------------------------------------
    // NO FIREBASE CUSTOMER
    // CHECK OPERATOR
    // ----------------------------------------------

    const operator = checkOperatorLogin();


    if (operator.loggedIn) {

        showLoggedInUser(
            operator.name,
            operator.role
        );

        return;

    }


    // ----------------------------------------------
    // NO CUSTOMER + NO OPERATOR
    // ----------------------------------------------

    showGuest();

});


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

logoutBtn?.addEventListener("click", async () => {

    try {

        // Customer logout
        if (auth.currentUser) {

            await signOut(auth);

        }


        // Operator logout
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("designation");


        alert("Logged Out Successfully");

        window.location.href = "index.html";

    }

    catch (error) {

        console.error(
            "Logout Error:",
            error
        );

        alert(
            "Logout failed. Please try again."
        );

    }

});


// --------------------------------------------------
// PROTECTED BUTTONS
// --------------------------------------------------

document.getElementById("trackBtn")
?.addEventListener("click", function(e) {

    if (currentRole === "guest") {

        e.preventDefault();

        window.location.href = "signin.html";

    }

});


document.getElementById("quoteBtn")
?.addEventListener("click", function(e) {

    if (currentRole === "guest") {

        e.preventDefault();

        window.location.href = "signin.html";

    }

});


document.getElementById("enquiryBtn")
?.addEventListener("click", function(e) {

    if (currentRole === "guest") {

        e.preventDefault();

        window.location.href = "signin.html";

    }

});

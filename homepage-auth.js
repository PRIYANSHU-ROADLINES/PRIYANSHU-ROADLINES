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


// --------------------------------------------------
// CURRENT WEBSITE ROLE
// --------------------------------------------------

let currentRole = "guest";


// --------------------------------------------------
// BASIC UI ELEMENTS
// --------------------------------------------------

const signinBtn = document.getElementById("signinBtn");
const userInfo = document.getElementById("userInfo");
const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");
const podMenu = document.getElementById("podMenu");
const loader = document.getElementById("loader");


// --------------------------------------------------
// LOADER
// --------------------------------------------------

function showLoader() {

    if (loader) {
        loader.style.display = "flex";
    }

}

function hideLoader() {

    if (loader) {
        loader.style.display = "none";
    }

}


// IMPORTANT:
// Keep loader visible while Firebase checks the login.
showLoader();


// --------------------------------------------------
// GUEST UI
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


// --------------------------------------------------
// LOGGED-IN USER UI
// --------------------------------------------------

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
// CHECK OPERATOR / STAFF LOGIN
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
// FIREBASE AUTH STATE
// --------------------------------------------------

onAuthStateChanged(auth, async (user) => {

    // ----------------------------------------------
    // CUSTOMER / FIREBASE USER
    // ----------------------------------------------

    if (user) {

        try {

            const snap = await getDoc(
                doc(db, "users", user.uid)
            );


            // ------------------------------------------
            // PROFILE FOUND
            // ------------------------------------------

            if (snap.exists()) {

                const data = snap.data();

                showLoggedInUser(
                    data.name,
                    data.role || "customer"
                );


                // PROFILE IS FULLY LOADED
                hideLoader();

                return;

            }


            // ------------------------------------------
            // FIREBASE USER BUT NO PROFILE
            // ------------------------------------------

            console.log(
                "Firebase user found but profile not found."
            );

            showGuest();

            hideLoader();

            return;

        }

        catch (error) {

            console.error(
                "Error loading customer profile:",
                error
            );

            showGuest();

            hideLoader();

            return;

        }

    }


    // ----------------------------------------------
    // NO FIREBASE USER
    // CHECK STAFF / ADMIN LOGIN
    // ----------------------------------------------

    const operator = checkOperatorLogin();


    if (operator.loggedIn) {

        showLoggedInUser(
            operator.name,
            operator.role
        );


        // STAFF / ADMIN PROFILE IS READY
        hideLoader();

        return;

    }


    // ----------------------------------------------
    // NO CUSTOMER + NO STAFF + NO ADMIN
    // ----------------------------------------------

    showGuest();

    hideLoader();

});


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

logoutBtn?.addEventListener("click", async () => {

    try {

        // Show loader during logout
        showLoader();


        if (userInfo) {
            userInfo.style.display = "none";
        }

        if (signinBtn) {
            signinBtn.style.display = "none";
        }


        // ------------------------------------------
        // CUSTOMER LOGOUT
        // ------------------------------------------

        if (auth.currentUser) {

            await signOut(auth);

        }


        // ------------------------------------------
        // STAFF / ADMIN LOGOUT
        // ------------------------------------------

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("designation");


        currentRole = "guest";


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

        hideLoader();

    }

});


// --------------------------------------------------
// PROTECTED TRACK BUTTON
// --------------------------------------------------

document.getElementById("trackBtn")
?.addEventListener("click", function(e) {

    if (currentRole === "guest") {

        e.preventDefault();

        window.location.href = "signin.html";

    }

});


// --------------------------------------------------
// PROTECTED QUOTE BUTTON
// --------------------------------------------------

document.getElementById("quoteBtn")
?.addEventListener("click", function(e) {

    if (currentRole === "guest") {

        e.preventDefault();

        window.location.href = "signin.html";

    }

});


// --------------------------------------------------
// PROTECTED ENQUIRY BUTTON
// --------------------------------------------------

document.getElementById("enquiryBtn")
?.addEventListener("click", function(e) {

    if (currentRole === "guest") {

        e.preventDefault();

        window.location.href = "signin.html";

    }

});

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

    authDomain:
        "priyanshu-roadlines-pod.firebaseapp.com",

    projectId:
        "priyanshu-roadlines-pod",

    storageBucket:
        "priyanshu-roadlines-pod.firebasestorage.app",

    messagingSenderId:
        "735411516260",

    appId:
        "1:735411516260:web:397d6a80141f032c0a0071"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* =========================================
   ELEMENTS
========================================= */

const signinBtn =
    document.getElementById("signinBtn");

const profileContainer =
    document.getElementById("profileContainer");

const profileCircle =
    document.getElementById("profileCircle");

const profileDropdown =
    document.getElementById("profileDropdown");

const profileBigCircle =
    document.querySelector(".profile-big-circle");

const profileImage =
    document.getElementById("profileImage");

const profileBigImage =
    document.getElementById("profileBigImage");

const profileInitial =
    document.getElementById("profileInitial");

const profileBigInitial =
    document.getElementById("profileBigInitial");

const profileEmail =
    document.getElementById("profileEmail");

const profileName =
    document.getElementById("profileName");

const profileRole =
    document.getElementById("profileRole");

const logoutBtn =
    document.getElementById("logoutBtn");


const podMenu =
    document.getElementById("podMenu");

const loader =
    document.getElementById("loader");
const menuBtn =
    document.getElementById("menuBtn");

const menuDropdown =
    document.getElementById("menuDropdown");
const welcomeSection =
    document.getElementById("welcomeSection");

const welcomeTitle =
    document.getElementById("welcomeTitle");

const welcomeDesignation =
    document.getElementById("welcomeDesignation");

const welcomeMessage =
    document.getElementById("welcomeMessage");

const customerMenuItems =
    document.querySelectorAll(".customer-menu");

const staffMenuItems =
    document.querySelectorAll(".staff-menu");

const adminMenuItems =
    document.querySelectorAll(".admin-menu");

const staffDashboardMenu =
    document.getElementById("staffDashboardMenu");

const adminDashboardMenu =
    document.getElementById("adminDashboardMenu");


let currentRole = "guest";


/* =========================================
   LOADER
========================================= */

const MIN_LOADER_TIME = 1500;

const loaderStartTime = Date.now();


function showLoader() {

    if (loader) {

        loader.style.display = "flex";

    }

}


function hideLoader() {

    if (!loader) return;

    const elapsed =
        Date.now() - loaderStartTime;

    const remaining =
        Math.max(
            0,
            MIN_LOADER_TIME - elapsed
        );

    setTimeout(() => {

        loader.style.display = "none";

    }, remaining);

}


showLoader();


/* =========================================
   GET FIRST LETTER
========================================= */

function getInitial(name) {

    if (!name) return "U";

    return name
        .trim()
        .charAt(0)
        .toUpperCase();

}
function getDefaultDesignation(role) {

    if (role === "admin") {
        return "Administrator";
    }

    if (role === "staff") {
        return "Staff Member";
    }

    return "Customer";
}


/* =========================================
   GUEST
========================================= */

function showGuest() {

    currentRole = "guest";


    if (signinBtn) {

        signinBtn.style.display = "block";

    }


    if (profileContainer) {

        profileContainer.style.display = "none";

    }


    if (profileDropdown) {

        profileDropdown.style.display = "none";

    }


    


    if (podMenu) {

        podMenu.style.display = "none";

    }


    console.log("Guest User");

}
if (welcomeSection) {
    welcomeSection.style.display = "none";
}

hideAllRoleMenus();

/* =========================================
   LOGGED-IN USER
========================================= */

function showLoggedInUser(
    name,
    role,
    email,
    photoURL,
    designation
) {

    currentRole = role;

    const userName = name || "User";
    const userEmail = email || "";
    const userDesignation =
        designation || getDefaultDesignation(role);

    const initial = getInitial(userName);
    /* Hide Sign In */

    if (signinBtn) {
        signinBtn.style.display = "none";
    }

    /* Show Profile */

    if (profileContainer) {
        profileContainer.style.display = "block";
    }

    /* Profile Initial */

    if (profileInitial) {
        profileInitial.innerText = initial;
    }

    if (profileBigInitial) {
        profileBigInitial.innerText = initial;
    }

    /* Profile Image */

    if (photoURL) {

        if (profileImage) {
            profileImage.src = photoURL;
            profileImage.style.display = "block";
        }

        if (profileBigImage) {
            profileBigImage.src = photoURL;
            profileBigImage.style.display = "block";
        }

        if (profileInitial) {
            profileInitial.style.display = "none";
        }

        if (profileBigInitial) {
            profileBigInitial.style.display = "none";
        }

    } else {

        if (profileImage) {
            profileImage.style.display = "none";
        }

        if (profileBigImage) {
            profileBigImage.style.display = "none";
        }

        if (profileInitial) {
            profileInitial.style.display = "block";
        }

        if (profileBigInitial) {
            profileBigInitial.style.display = "block";
        }

    }

    /* Profile Name */

    if (profileName) {
        profileName.innerText = userName;
    }

    /* Profile Email */

    if (profileEmail) {
        profileEmail.innerText = userEmail;
    }

    /* Profile Role */

   if (profileRole) {

    profileRole.innerText =
        userDesignation;

}

    /* POD */

    if (podMenu) {

        if (
            role === "staff" ||
            role === "admin"
        ) {

            podMenu.style.display = "block";

        } else {

            podMenu.style.display = "none";

        }

    }
if (role === "admin") {

    showAdminInterface(
        userName,
        userDesignation
    );

}

else if (role === "staff") {

    showStaffInterface(
        userName,
        userDesignation
    );

}

else {

    showCustomerInterface(
        userName,
        userDesignation
    );

}
    console.log(
        "Logged in:",
        userName,
        role,
        userEmail
    );
    
}

/* =========================================
   STAFF / ADMIN LOCAL LOGIN
========================================= */

function checkOperatorLogin() {

    const loggedIn =
        localStorage.getItem("loggedIn") === "true";

    const role =
        localStorage.getItem("role");

    const name =
        localStorage.getItem("name");

    const email =
        localStorage.getItem("email");

    const designation =
        localStorage.getItem("designation");

    const photoURL =
        localStorage.getItem("photoURL");


    if (
        loggedIn &&
        (role === "staff" ||
         role === "admin") &&
        name
    ) {

        return {

            loggedIn: true,

            role: role,

            name: name,

            email: email || "",

            designation:
                designation ||
                getDefaultDesignation(role),

            photoURL:
                photoURL || ""

        };

    }


    return {

        loggedIn: false

    };

}

/* =========================================
   FIREBASE AUTH
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /* -------------------------------
           CUSTOMER
        ------------------------------- */

        if (user) {

            try {

                const snap =
                    await getDoc(
                        doc(
                            db,
                            "users",
                            user.uid
                        )
                    );


                if (snap.exists()) {

                    const data =
                        snap.data();


                    showLoggedInUser(

    data.name ||
    user.displayName ||
    "User",

    data.role ||
    "customer",

    data.email ||
    user.email ||
    "",

    data.photoURL ||
    user.photoURL ||
    "",

    data.designation ||
    getDefaultDesignation(data.role || "customer")

);


                    hideLoader();

                    return;

                }


                showGuest();

                hideLoader();

                return;

            }

            catch (error) {

                console.error(
                    "Profile error:",
                    error
                );

                showGuest();

                hideLoader();

                return;

            }

        }


        /* -------------------------------
           STAFF / ADMIN
        ------------------------------- */

        const operator =
            checkOperatorLogin();


        if (operator.loggedIn) {

           showLoggedInUser(

    operator.name,

    operator.role,

    operator.email || "",

    operator.photoURL || "",

    operator.designation ||
    getDefaultDesignation(operator.role)

);

            hideLoader();

            return;

        }


        /* -------------------------------
           GUEST
        ------------------------------- */

        showGuest();

        hideLoader();

    }
);


/* =========================================
   PROFILE CLICK
========================================= */

profileCircle?.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();


        if (
            profileDropdown.style.display
            === "block"
        ) {

            profileDropdown.style.display =
                "none";

        }

        else {

            profileDropdown.style.display =
                "block";

        }

    }
);


/* =========================================
   CLOSE PROFILE WHEN CLICK OUTSIDE
========================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            profileContainer &&
            !profileContainer.contains(event.target)
        ) {

            profileDropdown.style.display =
                "none";

        }

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutBtn?.addEventListener(
    "click",
    async () => {

        try {

            showLoader();


            /* Firebase customer */

            if (auth.currentUser) {

                await signOut(auth);

            }


            /* Staff / Admin */

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


            currentRole = "guest";


            alert(
                "Logged Out Successfully"
            );


            window.location.href =
                "index.html";

        }

        catch (error) {

            console.error(
                "Logout Error:",
                error
            );

            alert(
                "Logout failed."
            );

            hideLoader();

        }

    }
);


/* =========================================
   TRACK LR
========================================= */

document
    .getElementById("trackBtn")
    ?.addEventListener(
        "click",
        function(e) {

            if (
                currentRole === "guest"
            ) {

                e.preventDefault();

                window.location.href =
                    "signin.html";

            }

        }
    );


/* =========================================
   GET QUOTE
========================================= */

document
    .getElementById("quoteBtn")
    ?.addEventListener(
        "click",
        function(e) {

            if (
                currentRole === "guest"
            ) {

                e.preventDefault();

                window.location.href =
                    "signin.html";

            }

        }
    );


/* =========================================
   ENQUIRY
========================================= */

document
    .getElementById("enquiryBtn")
    ?.addEventListener(
        "click",
        function(e) {

            if (
                currentRole === "guest"
            ) {

                e.preventDefault();

                window.location.href =
                    "signin.html";

            }

        }
    );

/* =========================================
   MENU
========================================= */

menuBtn?.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        menuDropdown?.classList.toggle("show");

    }
);


/* CLOSE MENU WHEN CLICKING OUTSIDE */

document.addEventListener(
    "click",
    function(event) {

        if (
            menuDropdown &&
            menuBtn &&
            !menuDropdown.contains(event.target) &&
            !menuBtn.contains(event.target)
        ) {

            menuDropdown.classList.remove("show");

        }

    }
);
function hideAllRoleMenus() {

    customerMenuItems.forEach(item => {
        item.style.display = "none";
    });

    staffMenuItems.forEach(item => {
        item.style.display = "none";
    });

    adminMenuItems.forEach(item => {
        item.style.display = "none";
    });

}
showLoggedInUser(

    operator.name,

    operator.role,

    operator.email || "",

    operator.photoURL || "",

    operator.designation ||
    getDefaultDesignation(operator.role)

);

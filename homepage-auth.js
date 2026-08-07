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
let currentRole = "guest";

onAuthStateChanged(auth, async(user)=>{

    if(!user){

    // Check Operator Login
    if(localStorage.getItem("loggedIn") === "true"){

        currentRole = localStorage.getItem("role");

        document.getElementById("signinBtn").style.display = "none";

        document.getElementById("userInfo").style.display = "block";

        document.getElementById("welcomeUser").innerHTML =
        "Hello, " + localStorage.getItem("name");

        // Show POD only for Staff/Admin
        if(currentRole === "staff" || currentRole === "admin"){

            document.getElementById("podMenu").style.display = "block";

        }

        return;

    }

    console.log("Guest User");

    return;

}

    const snap = await getDoc(doc(db,"users",user.uid));

    if(!snap.exists()){

        console.log("Operator Login");

        return;

    }

    const data = snap.data();
    currentRole = data.role;

    document.getElementById("signinBtn").style.display = "none";

document.getElementById("userInfo").style.display = "block";

document.getElementById("welcomeUser").innerHTML =
"Hello, " + data.name;
});
document.getElementById("logoutBtn")
?.addEventListener("click", async () => {

    // Customer Logout
    if(auth.currentUser){

        const { signOut } = await import(
            "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js"
        );

        await signOut(auth);

    }

    // Operator Logout
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("designation");

    alert("Logged Out Successfully");

    window.location.href = "index.html";

});

document.getElementById("trackBtn")
?.addEventListener("click", function(e){

    if(currentRole === "guest"){

        e.preventDefault();

        window.location.href="signin.html";

    }

});

document.getElementById("quoteBtn")
?.addEventListener("click", function(e){

    if(currentRole === "guest"){

        e.preventDefault();

        window.location.href="signin.html";

    }

});

document.getElementById("enquiryBtn")
?.addEventListener("click", function(e){

    if(currentRole === "guest"){

        e.preventDefault();

        window.location.href="signin.html";

    }

});

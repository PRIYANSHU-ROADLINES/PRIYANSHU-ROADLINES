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

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        console.log("Guest User");

        return;

    }

    const snap = await getDoc(doc(db,"users",user.uid));

    if(!snap.exists()){

        console.log("Operator Login");

        return;

    }

    const data = snap.data();

    document.getElementById("signinBtn").style.display = "none";

document.getElementById("userInfo").style.display = "block";

document.getElementById("welcomeUser").innerHTML =
"Hello, " + data.name;
});
document.getElementById("logoutBtn")
?.addEventListener("click", async () => {

    const { signOut } = await import(
        "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js"
    );

    await signOut(auth);

    alert("Logged Out Successfully");

    window.location.href = "index.html";

});

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
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

document
.getElementById("loginBtn")
.addEventListener("click", loginCustomer);

async function loginCustomer(){

    const email =
    document.getElementById("email").value.trim();

    const password =
    document.getElementById("password").value;

    if(email==="" || password===""){

        alert("Please enter Email and Password.");

        return;

    }

    try{

        const userCredential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        const snap =
        await getDoc(doc(db,"users",user.uid));

        if(!snap.exists()){

            alert("User Record Not Found.");

            return;

        }

        const data = snap.data();

        if(data.role !== "customer"){

            alert("Please use Operator Login.");

            return;

        }

        alert("Login Successful");

        window.location.href="customerdashboard.html";

    }catch(error){

        alert(error.message);

    }

}

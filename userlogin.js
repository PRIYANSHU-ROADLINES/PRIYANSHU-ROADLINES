import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
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

document.getElementById("signupBtn").addEventListener("click", signupCustomer);

async function signupCustomer(){

const mobile =
document.getElementById("mobile").value.trim();

const fullname =
document.getElementById("fullname").value.trim();

const email =
document.getElementById("email").value.trim();

const password =
document.getElementById("password").value;

if(!/^[6-9]\d{9}$/.test(mobile)){

alert("Enter a valid 10 digit Mobile Number.");

return;

}

if(fullname.length < 3){

alert("Enter Full Name.");

return;

}

if(password.length < 8){

alert("Password must be at least 8 characters.");

return;

}

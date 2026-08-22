import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyBQZREq5abr_oLzt6ksMGb-1jhlnKc92pU",
authDomain: "priyanshu-roadlines-pod.firebaseapp.com",
projectId: "priyanshu-roadlines-pod",
storageBucket: "priyanshu-roadlines-pod.firebasestorage.app",
messagingSenderId: "735411516260",
appId: "1:735411516260:web:397d6a80141f032c0a0071"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

document
.getElementById("verifyBtn")
.addEventListener("click",verifyOperator);

async function verifyOperator(){

const mobile =
document.getElementById("mobile").value.trim();

const fullname =
document.getElementById("fullname").value.trim();

const email =
document.getElementById("email").value.trim();

const uniqueCode =
document.getElementById("uniqueCode").value.trim();

const snap =
await getDocs(collection(db,"operators"));

let found = false;

snap.forEach((doc)=>{

const data = doc.data();

if(

data.mobile===mobile &&
data.fullName===fullname &&
data.email===email &&
data.uniqueCode===uniqueCode &&
data.active===true

){

found=true;

localStorage.setItem("loggedIn","true");

localStorage.setItem("role",data.role);

localStorage.setItem("name",data.fullName);

localStorage.setItem("designation",data.designation);

}

});

if (found) {

    const role = localStorage.getItem("role");

    if (role === "staff") {

        alert("Staff Verified Successfully");

    }

    else if (role === "administrator") {

        alert("Administrator Login Successfully");

    }

    else {

        alert("Operator Not Identified");

    }

    window.location.href = "index.html";

}

else {

    alert("Operator Not Identified");

    window.location.href = "index.html";

}

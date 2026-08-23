import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
doc,
setDoc,
getDoc,
updateDoc,
serverTimestamp
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
async function recordFailedAttempt(email, mobile) {

    const attemptRef =
        doc(db, "securityAttempts", "operatorVerification");

    const attemptSnap =
        await getDoc(attemptRef);

    let attempts = 0;

    if (attemptSnap.exists()) {
        attempts = attemptSnap.data().attempts || 0;
    }

    attempts++;

    await setDoc(attemptRef, {

        attempts: attempts,

        lastAttemptEmail: email,

        lastAttemptMobile: mobile,

        lastAttemptTime: serverTimestamp()

    });

    // 10th failed attempt
    if (attempts >= 10) {

        await setDoc(
            doc(db, "securityAlerts", "operatorVerificationAlert"),
            {

                type:
                    "Repeated Failed Operator Verification",

                attempts: attempts,

                email: email,

                mobile: mobile,

                timestamp:
                    serverTimestamp(),

                status: "New"

            }
        );

    }

}

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
    await setDoc(
    doc(db, "securityAttempts", "operatorVerification"),
    {
        attempts: 0,
        lastSuccessfulLogin: serverTimestamp()
    }
);

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

    await recordFailedAttempt(
        email,
        mobile
    );

    alert("Operator Not Identified");

    window.location.href = "index.html";

}
}

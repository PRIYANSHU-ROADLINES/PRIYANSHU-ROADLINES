import {
    getFirestore,
    doc,
    setDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


// ============================================
// SECURITY ALERT
// ============================================

export async function createSecurityAlert({
    email,
    mobile,
    fullname,
    attempts
}) {

    const db = getFirestore();

    const alertRef = doc(
        db,
        "securityAlerts",
        "operatorVerificationAlert"
    );

    await setDoc(alertRef, {

        type: "5 Failed Operator Login Attempts",

        loginType: "operator",

        attempts: attempts,

        email: email || "",

        mobile: mobile || "",

        fullname: fullname || "",

        timestamp: serverTimestamp(),

        status: "New",

        blocked: false

    });

}

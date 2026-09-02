import {
    getFirestore,
    collection,
    addDoc,
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
    attempts,
    deviceId
}) {

    const db = getFirestore();

    await addDoc(
        collection(db, "securityAlerts"),
        {

            type: "5 Failed Operator Login Attempts",

            loginType: "operator",

            attempts: attempts,

            email: email || "",

            mobile: mobile || "",

            fullname: fullname || "",

            deviceId: deviceId || "",

            timestamp: serverTimestamp(),

            status: "New",

            blocked: false

        }
    );

}

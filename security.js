import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBQZREq5abr_oLzt6ksMGb-1jhlnKc92pU",
    authDomain: "priyanshu-roadlines-pod.firebaseapp.com",
    projectId: "priyanshu-roadlines-pod",
    storageBucket: "priyanshu-roadlines-pod.firebasestorage.app",
    messagingSenderId: "735411516260",
    appId: "1:735411516260:web:397d6a80141f032c0a0071"
};


// ============================================
// GET OR CREATE POD AUTH APP
// ============================================

const podAuthApp = getApps().some(
    app => app.name === "POD_AUTH_APP"
)
    ? getApp("POD_AUTH_APP")
    : initializeApp(firebaseConfig, "POD_AUTH_APP");


const auth = getAuth(podAuthApp);
const db = getFirestore(podAuthApp);


// ============================================
// DEVICE ID
// ============================================

function getDeviceId() {

    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {

        deviceId =
            "device_" +
            Math.random()
                .toString(36)
                .substring(2, 15);

        localStorage.setItem(
            "deviceId",
            deviceId
        );
    }

    return deviceId;
}


// ============================================
// SECURITY CHECK
// ============================================

export function checkSecurity(callback, requiredRole = null) {

    onAuthStateChanged(auth, async (user) => {

        if (!user) {

            alert("Please login first.");

            window.location.replace("pod.html");

            return;
        }


        try {

            // ====================================
            // CHECK USER PROFILE
            // ====================================

            const userSnap = await getDoc(
                doc(db, "users", user.uid)
            );


            if (!userSnap.exists()) {

                alert("User profile not found.");

                await auth.signOut();

                window.location.replace("pod.html");

                return;
            }


           const userData = userSnap.data();

const podRole = userData.podRole;
window.podRole = role;

console.log(
    "Authenticated POD User:",
    user.email,
    "POD Role:",
    podRole
);


            // ====================================
            // ROLE CHECK
            // ====================================

           
if (
    requiredRole &&
    role !== requiredRole
) {

    console.log(
        "ROLE CHECK FAILED",
        "Required:",
        requiredRole,
        "Actual:",
        role
    );

    alert(
        "You are not authorized to access this page."
    );

    window.location.replace("pod.html");

    return;
}


            // ====================================
            // TRUSTED DEVICE CHECK
            // ====================================

            const deviceId = getDeviceId();


            const trustedQuery = query(
                collection(db, "trustedDevices"),

                where(
                    "deviceId",
                    "==",
                    deviceId
                ),

                where(
                    "approved",
                    "==",
                    true
                )
            );


            const trustedSnapshot =
                await getDocs(trustedQuery);


            if (trustedSnapshot.empty) {

                alert(
                    "This device is not approved."
                );

                await auth.signOut();

                window.location.replace("pod.html");

                return;
            }


            // ====================================
            // CHECK BLOCKED DEVICE
            // ====================================

            const trustedData =
                trustedSnapshot.docs[0].data();


            if (
                trustedData.status === "Blocked"
            ) {

                alert(
                    "This device has been blocked by Admin."
                );

                await auth.signOut();

                window.location.replace("pod.html");

                return;
            }


            // ====================================
            // SECURITY PASSED
            // ====================================

            console.log(
                "Security Passed"
            );

            callback();

        }

        catch (error) {

            console.error(
                "Security Check Error:",
                error
            );

            alert(
                "Security verification failed."
            );

            window.location.replace("pod.html");
        }

    });

}

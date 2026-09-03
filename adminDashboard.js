import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
// ============================================
// FIREBASE CONFIG
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyBQZREq5abr_oLzt6ksMGb-1jhlnKc92pU",
    authDomain: "priyanshu-roadlines-pod.firebaseapp.com",
    projectId: "priyanshu-roadlines-pod",
    storageBucket: "priyanshu-roadlines-pod.firebasestorage.app",
    messagingSenderId: "735411516260",
    appId: "1:735411516260:web:397d6a80141f032c0a0071"
};


// ============================================
// FIREBASE INITIALIZATION
// ============================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


// ============================================
// ADMIN DASHBOARD ACCESS CHECK
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        onAuthStateChanged(auth, async (user) => {

            if (!user) {

                alert(
                    "Access Denied!\n\nPlease login first."
                );

                window.location.replace("index.html");

                return;
            }

            await checkAdminAccess(user);

        });

    }
);


async function checkAdminAccess(user) {

    const loggedIn =
        localStorage.getItem("loggedIn");

    const role =
        localStorage.getItem("role");

    const email =
        localStorage.getItem("email");


    // ============================================
    // NO LOGIN
    // ============================================

    if (loggedIn !== "true") {

        alert(
            "Access Denied!\n\nAdmin login is required to access this page."
        );

        window.location.replace("index.html");

        return;
    }


    // ============================================
    // MUST BE MAIN WEBSITE ADMIN
    // ============================================

    if (role !== "admin") {

        alert(
            "Access Denied!\n\nYou do not have permission to access the Admin Dashboard."
        );

        window.location.replace("index.html");

        return;
    }

// ============================================
// LOAD SECURITY ALERTS
// ============================================

async function loadSecurityAlerts() {

    try {

        const alertsQuery = query(
            collection(db, "securityAlerts"),
            orderBy("timestamp", "desc")
        );

        const snapshot =
            await getDocs(alertsQuery);

        const alertsContainer =
            document.getElementById("alertsContainer");

        const newAlertsCount =
            document.getElementById("newAlertsCount");

        const reviewedAlertsCount =
            document.getElementById("reviewedAlertsCount");

        const blockedDevicesCount =
            document.getElementById("blockedDevicesCount");

        const totalAlertsCount =
            document.getElementById("totalAlertsCount");

        const alertStatus =
            document.getElementById("alertStatus");


        let newCount = 0;
        let reviewedCount = 0;
        let blockedCount = 0;
        let totalCount = 0;


        if (alertsContainer) {

            alertsContainer.innerHTML = "";

        }


        snapshot.forEach((alertDoc) => {

            const alert =
                alertDoc.data();

            totalCount++;


            if (alert.status === "New") {

                newCount++;

            }


            if (alert.status === "Reviewed") {

                reviewedCount++;

            }


            if (alert.blocked === true) {

                blockedCount++;

            }


            const alertCard =
                document.createElement("div");

            alertCard.className =
                "security-alert-card";


            const timestamp =
                alert.timestamp &&
                alert.timestamp.toDate
                    ? alert.timestamp.toDate().toLocaleString()
                    : "Unknown";


            alertCard.innerHTML = `

                <div class="alert-card-header">

                    <strong>
                        🔴 Security Alert
                    </strong>

                    <span>
                        ${alert.status || "New"}
                    </span>

                </div>


                <div class="alert-card-body">

                    <p>
                        <strong>Operator:</strong>
                        ${alert.fullname || "Unknown"}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${alert.email || "Not available"}
                    </p>

                    <p>
                        <strong>Mobile:</strong>
                        ${alert.mobile || "Not available"}
                    </p>

                    <p>
                        <strong>Failed Attempts:</strong>
                        ${alert.attempts || 0}
                    </p>

                    <p>
                        <strong>Device ID:</strong>
                        ${alert.deviceId || "Not available"}
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${timestamp}
                    </p>

                </div>

            `;


            if (alertsContainer) {

                alertsContainer.appendChild(
                    alertCard
                );

            }

        });


        if (newAlertsCount) {

            newAlertsCount.textContent =
                newCount;

        }


        if (reviewedAlertsCount) {

            reviewedAlertsCount.textContent =
                reviewedCount;

        }


        if (blockedDevicesCount) {

            blockedDevicesCount.textContent =
                blockedCount;

        }


        if (totalAlertsCount) {

            totalAlertsCount.textContent =
                totalCount;

        }


        if (alertStatus) {

            if (newCount > 0) {

                alertStatus.textContent =
                    `${newCount} NEW ALERT${newCount > 1 ? "S" : ""}`;

            } else {

                alertStatus.textContent =
                    "NO NEW ALERTS";

            }

        }


        if (
            alertsContainer &&
            totalCount === 0
        ) {

            alertsContainer.innerHTML = `

                <div class="no-alerts">

                    <div class="icon">
                        🛡️
                    </div>

                    <p>
                        No security alerts found.
                    </p>

                </div>

            `;

        }

    }

    catch (error) {

    console.error(
        "Unable to load security alerts:",
        error
    );

}
}
    // ============================================
    // VERIFY ADMIN IN FIRESTORE
    // ============================================

    try {

        const operatorsSnapshot = await getDocs(
            collection(db, "operators")
        );


        let adminFound = false;
        let adminData = null;


        operatorsSnapshot.forEach((operatorDoc) => {

            const data = operatorDoc.data();

            if (
    data.role === "admin" &&
    data.active === true &&
    data.email === email &&
    data.authUid === user.uid
) {

    adminFound = true;
    adminData = data;

}
        });


        // ============================================
        // ADMIN NOT FOUND
        // ============================================

        if (!adminFound) {

            alert(
                "Access Denied!\n\nYour administrator account could not be verified."
            );

            window.location.replace("index.html");

            return;
        }


        // ============================================
        // ACCESS GRANTED
        // ============================================

        const adminName =
            document.getElementById("adminName");

        if (adminName) {

            adminName.textContent =
                adminData.fullName || "Administrator";

        }


        const adminDesignation =
            document.getElementById("adminDesignation");

        if (adminDesignation) {

            adminDesignation.textContent =
                adminData.designation || "Administrator";

        }
        await loadSecurityAlerts();

    }
    catch (error) {

        // Do not expose technical Firebase information
        // to the browser console.

        alert(
            "Unable to verify administrator access.\n\nPlease try again."
        );

        window.location.replace("index.html");

        return;
    }

}

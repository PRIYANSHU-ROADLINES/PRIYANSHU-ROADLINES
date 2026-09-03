import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    setDoc,
    deleteDoc,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    deleteUser
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

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
// SECONDARY AUTH FOR CREATING OPERATORS
// ============================================

const operatorCreationApp =
    initializeApp(
        firebaseConfig,
        "OPERATOR_CREATION_APP"
    );

const operatorCreationAuth =
    getAuth(operatorCreationApp);


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
// OPERATORS MANAGEMENT
// ============================================

async function loadOperators() {

    const operatorsContainer =
        document.getElementById("operatorsContainer");

    if (!operatorsContainer) {
        return;
    }

    operatorsContainer.innerHTML = `
        <div class="no-alerts">
            <div class="icon">👤</div>
            <p>Loading operators...</p>
        </div>
    `;


    try {

        const operatorsSnapshot =
            await getDocs(
                collection(db, "operators")
            );


        if (operatorsSnapshot.empty) {

            operatorsContainer.innerHTML = `
                <div class="no-alerts">

                    <div class="icon">
                        👤
                    </div>

                    <p>
                        No operators found.
                    </p>

                </div>
            `;

            return;
        }


        operatorsContainer.innerHTML = "";


        operatorsSnapshot.forEach((operatorDoc) => {

            const operator =
                operatorDoc.data();


            const status =
                operator.active === true
                    ? "Active"
                    : "Inactive";


            const statusClass =
                operator.active === true
                    ? "reviewed"
                    : "new";


            const card =
                document.createElement("div");


            card.className =
                "security-alert-card";


            card.style.borderLeft =
                operator.active === true
                    ? "5px solid #168a16"
                    : "5px solid #777";


            card.innerHTML = `

                <div class="alert-card-header">

                    <strong>
                        👤 ${operator.fullName || "Unknown Operator"}
                    </strong>

                    <span class="alert-status ${statusClass}">
                        ${status}
                    </span>

                </div>


                <div class="alert-card-body">

                    <p>
                        <strong>Email:</strong>
                        ${operator.email || "Not available"}
                    </p>

                    <p>
                        <strong>Mobile:</strong>
                        ${operator.mobile || "Not available"}
                    </p>

                    <p>
                        <strong>Designation:</strong>
                        ${operator.designation || "Not specified"}
                    </p>

                    <p>
                        <strong>Role:</strong>
                        ${operator.role || "Not specified"}
                    </p>

                    <p>
                        <strong>Unique Code:</strong>
                        ${operator.uniqueCode || operatorDoc.id}
                    </p>

                    <p>
                        <strong>Authentication UID:</strong>
                        ${operator.authUid || "Not available"}
                    </p>

                </div>

            `;


            operatorsContainer.appendChild(card);

        });

    }
    catch (error) {

        console.error(
            "Unable to load operators:",
            error
        );


        operatorsContainer.innerHTML = `

            <div class="no-alerts">

                <div class="icon">
                    ⚠️
                </div>

                <p>
                    Unable to load operators.
                </p>

            </div>

        `;

    }

}
// ============================================
// OPERATORS MENU
// ============================================

// ============================================
// OPERATORS MENU
// ============================================

const operatorsMenuBtn =
    document.getElementById(
        "operatorsMenuBtn"
    );

const operatorsPanel =
    document.getElementById(
        "operatorsPanel"
    );

const securityPanel =
    document.querySelector(
        ".main .panel"
    );


// ============================================
// CHECK REQUIRED ELEMENTS
// ============================================

if (!operatorsMenuBtn) {

    console.error(
        "Operators button not found."
    );

}

if (!operatorsPanel) {

    console.error(
        "Operators panel not found."
    );

}


// ============================================
// OPERATORS BUTTON
// ============================================

if (
    operatorsMenuBtn &&
    operatorsPanel
) {

    operatorsMenuBtn.addEventListener(
        "click",
        async () => {

            console.log(
                "Operators button clicked."
            );


            // ====================================
            // HIDE SECURITY ALERT PANEL
            // ====================================

            if (securityPanel) {

                securityPanel.style.display =
                    "none";

            }


            // ====================================
            // SHOW OPERATORS PANEL
            // ====================================

            operatorsPanel.style.display =
                "block";


            // ====================================
            // UPDATE ACTIVE BUTTON
            // ====================================

            document
                .querySelectorAll(
                    ".sidebar button"
                )
                .forEach((button) => {

                    button.classList.remove(
                        "active"
                    );

                });


            operatorsMenuBtn.classList.add(
                "active"
            );


            // ====================================
            // LOAD OPERATORS
            // ====================================

            await loadOperators();

        }
    );

}


// ============================================
// REFRESH OPERATORS
// ============================================

const refreshOperatorsBtn =
    document.getElementById(
        "refreshOperatorsBtn"
    );

if (refreshOperatorsBtn) {

    refreshOperatorsBtn.addEventListener(
        "click",
        async () => {

            console.log(
                "Refreshing operators..."
            );

            await loadOperators();

        }
    );

}
// ============================================
// ADD OPERATOR MODAL
// ============================================

const addOperatorBtn =
    document.getElementById("addOperatorBtn");

const addOperatorModal =
    document.getElementById("addOperatorModal");

const closeAddOperatorBtn =
    document.getElementById("closeAddOperatorBtn");

const cancelAddOperatorBtn =
    document.getElementById("cancelAddOperatorBtn");


// ============================================
// OPEN MODAL
// ============================================

if (addOperatorBtn && addOperatorModal) {

    addOperatorBtn.addEventListener(
        "click",
        () => {

            console.log(
                "Add New Operator button clicked."
            );

            addOperatorModal.style.display =
                "flex";

        }
    );

}


// ============================================
// CLOSE MODAL — X BUTTON
// ============================================

if (
    closeAddOperatorBtn &&
    addOperatorModal
) {

    closeAddOperatorBtn.addEventListener(
        "click",
        () => {

            addOperatorModal.style.display =
                "none";

        }
    );

}


// ============================================
// CLOSE MODAL — CANCEL BUTTON
// ============================================

if (
    cancelAddOperatorBtn &&
    addOperatorModal
) {

    cancelAddOperatorBtn.addEventListener(
        "click",
        () => {

            addOperatorModal.style.display =
                "none";

        }
    );

}


// ============================================
// CLOSE MODAL — OUTSIDE CLICK
// ============================================

if (addOperatorModal) {

    addOperatorModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                addOperatorModal
            ) {

                addOperatorModal.style.display =
                    "none";

            }

        }
    );

}

    // ============================================
// CREATE NEW OPERATOR
// ============================================

const addOperatorForm =
    document.getElementById("addOperatorForm");

if (addOperatorForm) {

    addOperatorForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            // ========================================
            // GET FORM VALUES
            // ========================================

            const fullName =
                document
                    .getElementById(
                        "operatorFullName"
                    )
                    .value
                    .trim();

            const email =
                document
                    .getElementById(
                        "operatorEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();

            const mobile =
                document
                    .getElementById(
                        "operatorMobile"
                    )
                    .value
                    .trim();

            const designation =
                document
                    .getElementById(
                        "operatorDesignation"
                    )
                    .value
                    .trim();

            const role =
                document
                    .getElementById(
                        "operatorRole"
                    )
                    .value
                    .trim();

            const uniqueCode =
                document
                    .getElementById(
                        "operatorUniqueCode"
                    )
                    .value
                    .trim();


            // ========================================
            // BASIC VALIDATION
            // ========================================

            if (
                !fullName ||
                !email ||
                !mobile ||
                !designation ||
                !role ||
                !uniqueCode
            ) {

                alert(
                    "Please fill all operator details."
                );

                return;

            }


            // ========================================
            // PASSWORD LENGTH VALIDATION
            // ========================================

            if (uniqueCode.length < 6) {

                alert(
                    "Unique Code must contain at least 6 characters."
                );

                return;

            }


            // ========================================
            // DISABLE BUTTON
            // ========================================

            const saveOperatorBtn =
                document.getElementById(
                    "saveOperatorBtn"
                );

            if (saveOperatorBtn) {

                saveOperatorBtn.disabled =
                    true;

                saveOperatorBtn.textContent =
                    "Creating...";

            }


            try {

                // ====================================
                // CHECK EXISTING OPERATORS
                // ====================================

                const operatorsSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "operators"
                        )
                    );


                let emailExists = false;
                let mobileExists = false;
                let codeExists = false;


                let highestId = 0;


                operatorsSnapshot.forEach(
                    (operatorDoc) => {

                        const operator =
                            operatorDoc.data();


                        // CHECK DUPLICATES

                        if (
                            operator.email
                                ?.toLowerCase() ===
                            email
                        ) {

                            emailExists = true;

                        }


                        if (
                            operator.mobile ===
                            mobile
                        ) {

                            mobileExists = true;

                        }


                        if (
                            operator.uniqueCode ===
                            uniqueCode
                        ) {

                            codeExists = true;

                        }


                        // =================================
                        // FIND HIGHEST OP/ST NUMBER
                        // =================================

                        const docId =
                            operatorDoc.id;

                        const match =
                            docId.match(
                                /^(OP|ST)(\d+)$/
                            );

                        if (match) {

                            const number =
                                parseInt(
                                    match[2],
                                    10
                                );

                            if (
                                number >
                                highestId
                            ) {

                                highestId =
                                    number;

                            }

                        }

                    }
                );


                // ====================================
                // DUPLICATE CHECK
                // ====================================

                if (emailExists) {

                    alert(
                        "An operator with this email already exists."
                    );

                    return;

                }


                if (mobileExists) {

                    alert(
                        "An operator with this mobile number already exists."
                    );

                    return;

                }


                if (codeExists) {

                    alert(
                        "This Unique Code is already in use."
                    );

                    return;

                }


                // ====================================
                // GENERATE OPERATOR DOCUMENT ID
                // ====================================

                const nextNumber =
                    highestId + 1;

                const prefix =
                    role === "admin"
                        ? "OP"
                        : "ST";

                const operatorId =
                    prefix +
                    String(nextNumber)
                        .padStart(
                            3,
                            "0"
                        );


                // ====================================
                // CREATE FIREBASE AUTH ACCOUNT
                // ====================================

                const credential =
                    await createUserWithEmailAndPassword(
                        operatorCreationAuth,
                        email,
                        uniqueCode
                    );


                const newAuthUid =
                    credential.user.uid;


                // ====================================
                // CREATE FIRESTORE DOCUMENT
                // ====================================

                try {

                    await setDoc(
                        doc(
                            db,
                            "operators",
                            operatorId
                        ),
                        {
                            role: role,
                            active: true,
                            authUid: newAuthUid,
                            designation: designation,
                            email: email,
                            fullName: fullName,
                            mobile: mobile,
                            uniqueCode: uniqueCode
                        }
                    );

                } catch (firestoreError) {

                    // =================================
                    // CLEAN UP AUTH ACCOUNT
                    // IF FIRESTORE CREATION FAILS
                    // =================================

                    try {

                        await deleteUser(
                            credential.user
                        );

                    } catch (cleanupError) {

                        console.error(
                            "Unable to clean up Auth account:",
                            cleanupError
                        );

                    }

                    throw firestoreError;

                }


                // ====================================
                // SUCCESS
                // ====================================

                alert(
                    "Operator created successfully.\n\n" +
                    "Operator ID: " +
                    operatorId
                );


                // ====================================
                // RESET FORM
                // ====================================

                addOperatorForm.reset();


                // ====================================
                // CLOSE MODAL
                // ====================================

                const addOperatorModal =
                    document.getElementById(
                        "addOperatorModal"
                    );

                if (addOperatorModal) {

                    addOperatorModal.style.display =
                        "none";

                }


                // ====================================
                // RELOAD OPERATORS
                // ====================================

                await loadOperators();


            } catch (error) {

                console.error(
                    "Unable to create operator:",
                    error
                );


                alert(
                    "Unable to create operator.\n\n" +
                    error.message
                );


            } finally {

                // ====================================
                // ENABLE BUTTON AGAIN
                // ====================================

                if (saveOperatorBtn) {

                    saveOperatorBtn.disabled =
                        false;

                    saveOperatorBtn.textContent =
                        "💾 Create Operator";

                }

            }

        }
    );

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
// MARK ALERT AS REVIEWED
// ============================================

async function markAlertReviewed(alertId) {

    try {

        await updateDoc(
            doc(db, "securityAlerts", alertId),
            {
                status: "Reviewed",
                reviewedAt: new Date()
            }
        );

        console.log(
            "Security alert marked as reviewed."
        );

        await loadSecurityAlerts();

    }
    catch (error) {

        console.error(
            "Unable to review security alert:",
            error
        );

        alert(
            "Unable to update the security alert.\n\nPlease try again."
        );

    }

}


// ============================================
// BLOCK DEVICE
// ============================================

async function blockAlertDevice(alertId) {

    const confirmation = confirm(
        "BLOCK THIS DEVICE?\n\n" +
        "This device will be denied access when it next opens the website.\n\n" +
        "Do you want to continue?"
    );

    if (!confirmation) {
        return;
    }


    try {

        // ============================================
        // GET THE SECURITY ALERT
        // ============================================

        const alertSnapshot = await getDocs(
            query(
                collection(db, "securityAlerts")
            )
        );


        let alertData = null;


        alertSnapshot.forEach((alertDoc) => {

            if (alertDoc.id === alertId) {

                alertData = alertDoc.data();

            }

        });


        if (!alertData) {

            alert(
                "Security alert could not be found."
            );

            return;

        }


        const deviceId = alertData.deviceId;


        if (!deviceId) {

            alert(
                "This alert does not contain a valid Device ID."
            );

            return;

        }


        // ============================================
        // UPDATE SECURITY ALERT
        // ============================================

        await updateDoc(
            doc(
                db,
                "securityAlerts",
                alertId
            ),
            {
                blocked: true,
                blockedAt: serverTimestamp(),
                status: "Reviewed"
            }
        );


        // ============================================
        // CREATE BLOCKED DEVICE RECORD
        // ============================================

        await setDoc(
            doc(
                db,
                "blockedDevices",
                deviceId
            ),
            {

                deviceId: deviceId,

                blocked: true,

                blockedAt: serverTimestamp(),

                sourceAlertId: alertId,

                reason:
                    "Security policy violation"

            }
        );


        console.log(
            "DEVICE BLOCKED:",
            deviceId
        );


        alert(
            "Device blocked successfully.\n\n" +
            "Device ID: " + deviceId
        );


        await loadSecurityAlerts();

    }
    catch (error) {

        console.error(
            "Unable to block device:",
            error
        );

        alert(
            "Unable to block this device.\n\n" +
            "Please try again."
        );

    }

}
    
// ============================================
// UNBLOCK DEVICE
// ============================================

async function unblockAlertDevice(alertId) {

    const confirmation = confirm(
        "UNBLOCK THIS DEVICE?\n\n" +
        "The device will be allowed to access the website again.\n\n" +
        "Do you want to continue?"
    );

    if (!confirmation) {
        return;
    }


    try {

        // ============================================
        // GET SECURITY ALERT
        // ============================================

        const alertSnapshot = await getDocs(
            query(
                collection(db, "securityAlerts")
            )
        );


        let alertData = null;


        alertSnapshot.forEach((alertDoc) => {

            if (alertDoc.id === alertId) {

                alertData = alertDoc.data();

            }

        });


        if (!alertData) {

            alert(
                "Security alert could not be found."
            );

            return;

        }


        const deviceId = alertData.deviceId;


        if (!deviceId) {

            alert(
                "Device ID not found."
            );

            return;

        }


        // ============================================
        // UPDATE SECURITY ALERT
        // ============================================

        await updateDoc(
            doc(
                db,
                "securityAlerts",
                alertId
            ),
            {
                blocked: false,
                unblockedAt: serverTimestamp()
            }
        );


        // ============================================
        // REMOVE BLOCKED DEVICE RECORD
        // ============================================

        await deleteDoc(
            doc(
                db,
                "blockedDevices",
                deviceId
            )
        );


        console.log(
            "DEVICE UNBLOCKED:",
            deviceId
        );


        alert(
            "Device unblocked successfully.\n\n" +
            "Device ID: " + deviceId
        );


        await loadSecurityAlerts();

    }
    catch (error) {

        console.error(
            "Unable to unblock device:",
            error
        );

        alert(
            "Unable to unblock this device.\n\n" +
            "Please try again."
        );

    }

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

        <span class="alert-status ${

            alert.status === "Reviewed"
                ? "reviewed"
                : "new"

        }">

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


        <p>
            <strong>Device Status:</strong>

            ${
                alert.blocked === true
                    ? "🚫 BLOCKED"
                    : "🟢 Not Blocked"
            }

        </p>


        <div class="alert-actions">

            ${
                alert.status !== "Reviewed"

                ? `
                    <button
                        class="review-btn"
                        data-alert-id="${alertDoc.id}">
                        ✓ Mark Reviewed
                    </button>
                `

                : `
                    <span class="reviewed-label">
                        ✓ Reviewed
                    </span>
                `
            }


            ${
                alert.blocked === true

                ? `
                    <button
                        class="unblock-btn"
                        data-alert-id="${alertDoc.id}">
                        🔓 Unblock Device
                    </button>
                `

                : `
                    <button
                        class="block-btn"
                        data-alert-id="${alertDoc.id}">
                        🚫 Block Device
                    </button>
                `
            }

        </div>

    </div>

`;


            if (alertsContainer) {

                alertsContainer.appendChild(
                    alertCard
                );

            }
            // ============================================
// REVIEW BUTTON
// ============================================

const reviewButton =
    alertCard.querySelector(".review-btn");

if (reviewButton) {

    reviewButton.addEventListener(
        "click",
        () => {

            markAlertReviewed(
                reviewButton.dataset.alertId
            );

        }
    );

}


// ============================================
// BLOCK BUTTON
// ============================================

const blockButton =
    alertCard.querySelector(".block-btn");

if (blockButton) {

    blockButton.addEventListener(
        "click",
        () => {

            blockAlertDevice(
                blockButton.dataset.alertId
            );

        }
    );

}


// ============================================
// UNBLOCK BUTTON
// ============================================

const unblockButton =
    alertCard.querySelector(".unblock-btn");

if (unblockButton) {

    unblockButton.addEventListener(
        "click",
        () => {

            unblockAlertDevice(
                unblockButton.dataset.alertId
            );

        }
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

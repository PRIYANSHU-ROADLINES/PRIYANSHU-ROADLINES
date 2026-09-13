import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
collection,
getDocs,
getDoc,
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

// ============================================
// LOAD OPERATORS
// ============================================

async function loadOperators() {

    const operatorsContainer =
        document.getElementById(
            "operatorsContainer"
        );

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
                collection(
                    db,
                    "operators"
                )
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


        operatorsSnapshot.forEach(
            (operatorDoc) => {

                const operator =
                    operatorDoc.data();


                // ====================================
                // OPERATOR STATUS
                // ====================================

                const isActive =
                    operator.active === true;


                const status =
                    isActive
                        ? "Active"
                        : "Inactive";


                const statusClass =
                    isActive
                        ? "reviewed"
                        : "new";


                // ====================================
                // CREATE CARD
                // ====================================

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "security-alert-card";


                card.style.borderLeft =
                    isActive
                        ? "5px solid #168a16"
                        : "5px solid #777";


                // ====================================
                // CARD CONTENT
                // ====================================

                card.innerHTML = `

                    <div class="alert-card-header">

                        <strong>
                            👤 ${
                                operator.fullName ||
                                "Unknown Operator"
                            }
                        </strong>

                        <span
                            class="alert-status ${statusClass}"
                        >
                            ${status}
                        </span>

                    </div>


                    <div class="alert-card-body">

                        <p>
                            <strong>
                                Operator ID:
                            </strong>

                            ${operatorDoc.id}
                        </p>


                        <p>
                            <strong>
                                Email:
                            </strong>

                            ${
                                operator.email ||
                                "Not available"
                            }
                        </p>


                        <p>
                            <strong>
                                Mobile:
                            </strong>

                            ${
                                operator.mobile ||
                                "Not available"
                            }
                        </p>


                        <p>
                            <strong>
                                Designation:
                            </strong>

                            ${
                                operator.designation ||
                                "Not specified"
                            }
                        </p>


                        <p>
                            <strong>
                                Role:
                            </strong>

                            ${
                                operator.role ||
                                "Not specified"
                            }
                        </p>


                        <p>
                            <strong>
                                Unique Code:
                            </strong>

                            ${
                                operator.uniqueCode ||
                                "Not available"
                            }
                        </p>


                        <p>
                            <strong>
                                Authentication UID:
                            </strong>

                            ${
                                operator.authUid ||
                                "Not available"
                            }
                        </p>


                        <!-- =================================
                             OPERATOR ACTIONS
                        ================================== -->

                        <div
                            class="alert-actions"
                            style="
                                margin-top:15px;
                                display:flex;
                                gap:10px;
                                flex-wrap:wrap;
                            "
                        >

                            ${
                                isActive

                                ? `

                                    <button
                                        class="deactivate-operator-btn"
                                        data-operator-id="${operatorDoc.id}"
                                        style="
                                            background:#b42318;
                                            color:white;
                                            border:none;
                                            padding:9px 14px;
                                            border-radius:6px;
                                            cursor:pointer;
                                        "
                                    >
                                        🔴 Deactivate
                                    </button>

                                `

                                : `

                                    <button
                                        class="activate-operator-btn"
                                        data-operator-id="${operatorDoc.id}"
                                        style="
                                            background:#168a16;
                                            color:white;
                                            border:none;
                                            padding:9px 14px;
                                            border-radius:6px;
                                            cursor:pointer;
                                        "
                                    >
                                        🟢 Activate
                                    </button>

                                `
                            }
   
                            <button
  class="edit-operator-btn"
  data-id="${operatorDoc.id}"
  style="
    background:#2563eb;
    color:white;
    border:none;
    padding:8px 14px;
    border-radius:6px;
    cursor:pointer;
    margin-left:8px;
  "
>
  ✏️ Edit
</button>



                        </div>

                    </div>

                `;


                operatorsContainer.appendChild(
                    card
                );


                // ====================================
                // DEACTIVATE BUTTON
                // ====================================

                const deactivateButton =
                    card.querySelector(
                        ".deactivate-operator-btn"
                    );


                if (deactivateButton) {

                    deactivateButton.addEventListener(
                        "click",
                        async () => {

                            const confirmDeactivate =
                                confirm(
                                    "DEACTIVATE OPERATOR?\n\n" +
                                    "This operator will no longer be able to log in.\n\n" +
                                    "Do you want to continue?"
                                );


                            if (
                                !confirmDeactivate
                            ) {

                                return;

                            }


                            try {

                                await updateDoc(
                                    doc(
                                        db,
                                        "operators",
                                        operatorDoc.id
                                    ),
                                    {
                                        active:
                                            false
                                    }
                                );


                                alert(
                                    "Operator deactivated successfully."
                                );


                                await loadOperators();

                            }
                            catch (error) {

                                console.error(
                                    "Unable to deactivate operator:",
                                    error
                                );


                                alert(
                                    "Unable to deactivate operator.\n\nPlease try again."
                                );

                            }

                        }
                    );

                }


                // ====================================
                // ACTIVATE BUTTON
                // ====================================

                const activateButton =
                    card.querySelector(
                        ".activate-operator-btn"
                    );


                if (activateButton) {

                    activateButton.addEventListener(
                        "click",
                        async () => {

                            const confirmActivate =
                                confirm(
                                    "ACTIVATE OPERATOR?\n\n" +
                                    "This operator will be allowed to log in again.\n\n" +
                                    "Do you want to continue?"
                                );


                            if (
                                !confirmActivate
                            ) {

                                return;

                            }


                            try {

                                await updateDoc(
                                    doc(
                                        db,
                                        "operators",
                                        operatorDoc.id
                                    ),
                                    {
                                        active:
                                            true
                                    }
                                );


                                alert(
                                    "Operator activated successfully."
                                );


                                await loadOperators();

                            }
                            catch (error) {

                                console.error(
                                    "Unable to activate operator:",
                                    error
                                );


                                alert(
                                    "Unable to activate operator.\n\nPlease try again."
                                );

                            }

                        }
                    );

                }
                 document.querySelectorAll(".edit-operator-btn").forEach(button => {
  button.addEventListener("click", async () => {

    const operatorId = button.dataset.id;

    try {
      const operatorDoc = await getDocs(
        query(collection(db, "operators"))
      );

      let operator = null;

      operatorDoc.forEach(docSnap => {
        if (docSnap.id === operatorId) {
          operator = {
            id: docSnap.id,
            ...docSnap.data()
          };
        }
      });

      if (!operator) {
        alert("Operator not found.");
        return;
      }

      document.getElementById("editOperatorId").value =
        operator.id;

      document.getElementById("editOperatorFullName").value =
        operator.fullName || "";

      document.getElementById("editOperatorEmail").value =
        operator.email || "";

      document.getElementById("editOperatorMobile").value =
        operator.mobile || "";

      document.getElementById("editOperatorDesignation").value =
        operator.designation || "";

      document.getElementById("editOperatorRole").value =
        operator.role || "";

      document.getElementById("editOperatorUniqueCode").value =
        operator.uniqueCode || "";

      document.getElementById("editOperatorModal").style.display =
        "flex";

    } catch (error) {
      console.error("Error loading operator:", error);
      alert("Unable to load operator details.");
    }
  });
});

            }
        );


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
// EDIT OPERATOR MODAL
// ============================================

const editOperatorModal =
    document.getElementById(
        "editOperatorModal"
    );

const closeEditOperatorBtn =
    document.getElementById(
        "closeEditOperatorBtn"
    );

const cancelEditOperatorBtn =
    document.getElementById(
        "cancelEditOperatorBtn"
    );
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
// CLOSE EDIT MODAL - X BUTTON
// ============================================

if (
    closeEditOperatorBtn &&
    editOperatorModal
) {

    closeEditOperatorBtn.addEventListener(
        "click",
        () => {

            editOperatorModal.style.display =
                "none";

        }
    );

}



// ============================================
// CLOSE EDIT MODAL - CANCEL BUTTON
// ============================================

// ============================================
// CLOSE EDIT MODAL - CANCEL BUTTON
// ============================================

if (cancelEditOperatorBtn) {

    cancelEditOperatorBtn.onclick = function () {

        editOperatorModal.style.display = "none";

    };

}



// ============================================
// CLOSE EDIT MODAL - OUTSIDE CLICK
// ============================================

if (editOperatorModal) {

    editOperatorModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                editOperatorModal
            ) {

                editOperatorModal.style.display =
                    "none";

            }

        }
    );

}
// ============================================
// UPDATE OPERATOR — SAVE CHANGES
// ============================================

const editOperatorForm =
    document.getElementById("editOperatorForm");

if (editOperatorForm) {

    editOperatorForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            // ========================================
            // GET OPERATOR ID
            // ========================================

            const operatorId =
                document.getElementById(
                    "editOperatorId"
                ).value.trim();

            if (!operatorId) {

                alert(
                    "Operator ID is missing."
                );

                return;

            }

            // ========================================
            // GET UPDATED VALUES
            // ========================================

            const fullName =
                document.getElementById(
                    "editOperatorFullName"
                ).value.trim();

            const mobile =
                document.getElementById(
                    "editOperatorMobile"
                ).value.trim();

            const designation =
                document.getElementById(
                    "editOperatorDesignation"
                ).value.trim();

            const role =
                document.getElementById(
                    "editOperatorRole"
                ).value.trim();

            const uniqueCode =
                document.getElementById(
                    "editOperatorUniqueCode"
                ).value.trim();

            // ========================================
            // BASIC VALIDATION
            // ========================================

            if (
                !fullName ||
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
            // UNIQUE CODE VALIDATION
            // ========================================

            if (uniqueCode.length < 6) {

                alert(
                    "Unique Code must contain at least 6 characters."
                );

                return;

            }

            // ========================================
            // DISABLE SAVE BUTTON
            // ========================================

            const updateOperatorBtn =
                document.getElementById(
                    "updateOperatorBtn"
                );

            if (updateOperatorBtn) {

                updateOperatorBtn.disabled = true;

                updateOperatorBtn.textContent =
                    "Saving...";

            }

            try {

                // ====================================
                // CHECK FOR DUPLICATE MOBILE / CODE
                // ====================================

                const operatorsSnapshot =
                    await getDocs(
                        collection(
                            db,
                            "operators"
                        )
                    );

                let mobileExists = false;
                let codeExists = false;

                operatorsSnapshot.forEach(
                    (operatorDoc) => {

                        // Skip the operator currently being edited

                        if (
                            operatorDoc.id ===
                            operatorId
                        ) {

                            return;

                        }

                        const operator =
                            operatorDoc.data();

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

                    }
                );

                // ====================================
                // DUPLICATE MOBILE
                // ====================================

                if (mobileExists) {

                    alert(
                        "Another operator already uses this mobile number."
                    );

                    return;

                }

                // ====================================
                // DUPLICATE UNIQUE CODE
                // ====================================

                if (codeExists) {

                    alert(
                        "This Unique Code is already in use by another operator."
                    );

                    return;

                }

                // ====================================
                // UPDATE FIRESTORE
                // ====================================

                await updateDoc(
                    doc(
                        db,
                        "operators",
                        operatorId
                    ),
                    {
                        fullName: fullName,
                        mobile: mobile,
                        designation: designation,
                        role: role,
                        uniqueCode: uniqueCode
                    }
                );

                // ====================================
                // SUCCESS
                // ====================================

                alert(
                    "Operator details updated successfully."
                );

                // ====================================
                // CLOSE EDIT MODAL
                // ====================================

                editOperatorModal.style.display =
                    "none";

                // ====================================
                // RELOAD OPERATORS
                // ====================================

                await loadOperators();

            }
            catch (error) {

                console.error(
                    "Unable to update operator:",
                    error
                );

                alert(
                    "Unable to update operator.\n\nPlease try again."
                );

            }
            finally {

                // ====================================
                // ENABLE SAVE BUTTON
                // ====================================

                if (updateOperatorBtn) {

                    updateOperatorBtn.disabled =
                        false;

                    updateOperatorBtn.textContent =
                        "💾 Save Changes";

                }

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
// ============================================================
// POD REQUESTS MANAGEMENT
// ============================================================


// ------------------------------------------------------------
// ELEMENTS
// ------------------------------------------------------------

const podRequestsMenuBtn =
    document.getElementById(
        "podRequestsMenuBtn"
    );


const podRequestsPanel =
    document.getElementById(
        "podRequestsPanel"
    );


const podRequestsContainer =
    document.getElementById(
        "podRequestsContainer"
    );


const podRequestsCount =
    document.getElementById(
        "podRequestsCount"
    );


const refreshPodRequestsBtn =
    document.getElementById(
        "refreshPodRequestsBtn"
    );


// ------------------------------------------------------------
// LOAD POD REQUESTS
// ------------------------------------------------------------

async function loadPodRequests() {

    if (!podRequestsContainer) {
        return;
    }


    podRequestsContainer.innerHTML = `

        <div class="no-alerts">

            <div class="icon">
                ⏳
            </div>

            <p>
                Loading POD requests...
            </p>

        </div>

    `;


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "podUploadRequests"
                )
            );


        const requests = [];


        snapshot.forEach(
            (requestDoc) => {

                const data =
                    requestDoc.data();


                // ONLY SHOW PENDING REQUESTS

                if (
                    data.status ===
                    "Pending"
                ) {

                    requests.push({

                        id:
                            requestDoc.id,

                        ...data

                    });

                }

            }
        );


        // ----------------------------------------------------
        // SORT NEWEST FIRST
        // ----------------------------------------------------

        requests.sort(
            (a, b) => {

                const timeA =
                    a.submittedAt
                        ? a.submittedAt.toMillis()
                        : 0;


                const timeB =
                    b.submittedAt
                        ? b.submittedAt.toMillis()
                        : 0;


                return timeB - timeA;

            }
        );


        podRequestsCount.textContent =
            requests.length;


        // ----------------------------------------------------
        // NO REQUESTS
        // ----------------------------------------------------

        if (requests.length === 0) {

            podRequestsContainer.innerHTML = `

                <div class="no-alerts">

                    <div class="icon">
                        📭
                    </div>

                    <p>
                        No pending POD requests.
                    </p>

                </div>

            `;

            return;

        }


        podRequestsContainer.innerHTML =
            "";


        // ----------------------------------------------------
        // CREATE REQUEST CARDS
        // ----------------------------------------------------

        requests.forEach(
            (request) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.style.cssText = `

                    border:1px solid #ddd;

                    border-left:
                        5px solid #e00000;

                    border-radius:8px;

                    margin-bottom:15px;

                    padding:18px;

                    background:white;

                    box-shadow:
                        0 2px 8px
                        rgba(0,0,0,0.06);

                `;


                const submittedTime =
                    request.submittedAt
                        ? request.submittedAt
                            .toDate()
                            .toLocaleString(
                                "en-IN"
                            )
                        : "-";


                card.innerHTML = `

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:10px;
                            flex-wrap:wrap;
                            margin-bottom:15px;
                        "
                    >

                        <strong
                            style="
                                font-size:18px;
                            "
                        >
                            📦 GR / LR:
                            ${request.grNo || request.id}
                        </strong>


                        <span
                            style="
                                background:#fff1d6;
                                color:#b56700;
                                padding:6px 12px;
                                border-radius:20px;
                                font-size:12px;
                                font-weight:bold;
                            "
                        >
                            PENDING
                        </span>

                    </div>


                    <div
                        style="
                            line-height:1.8;
                            font-size:14px;
                        "
                    >

                        <p>
                            <b>Vehicle:</b>
                            ${request.vehicleNo || "-"}
                        </p>


                        <p>
                            <b>Driver:</b>
                            ${request.driverName || "-"}
                        </p>


                        <p>
                            <b>Device ID:</b>
                            ${request.deviceId || "-"}
                        </p>


                        <p>
                            <b>Submitted:</b>
                            ${submittedTime}
                        </p>


                        <p>

                            <b>Source:</b>

                            <span
                                style="
                                    display:inline-block;
                                    margin-left:5px;
                                    padding:4px 8px;
                                    border-radius:4px;
                                    background:#eeeeee;
                                    color:#555;
                                    font-size:11px;
                                    font-weight:bold;
                                "
                            >
                                DRIVER PORTAL UPLOAD
                            </span>

                        </p>

                    </div>


                    ${
                        request.imageUrl

                        ?

                        `

                        <div
                            style="
                                margin-top:15px;
                                text-align:center;
                            "
                        >

                            <img
                                src="${request.imageUrl}"
                                alt="POD - ${request.grNo || request.id}"
                                style="
                                    max-width:100%;
                                    max-height:500px;
                                    border:1px solid #ddd;
                                    border-radius:7px;
                                    object-fit:contain;
                                "
                            >

                            <br>


                            <a
                                href="${request.imageUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="
                                    display:inline-block;
                                    margin-top:10px;
                                    padding:8px 14px;
                                    background:#333;
                                    color:white;
                                    text-decoration:none;
                                    border-radius:5px;
                                    font-size:12px;
                                    font-weight:bold;
                                "
                            >
                                🔍 View Full POD
                            </a>

                        </div>

                        `

                        :

                        `

                        <div
                            style="
                                margin-top:15px;
                                padding:12px;
                                background:#fff0f0;
                                color:#b00000;
                                border-radius:6px;
                                text-align:center;
                            "
                        >
                            ⚠️ POD image not available.
                        </div>

                        `

                    }


                    <div
                        style="
                            margin-top:18px;
                            display:flex;
                            gap:10px;
                            flex-wrap:wrap;
                        "
                    >

                        <button
    onclick="approvePodRequest('${request.id}')"
    style="
        border:none;
        padding:10px 18px;
        border-radius:6px;
        background:#008000;
        color:white;
        font-weight:bold;
        cursor:pointer;
    "
>
    ✅ UPLOAD
</button>


                        <button
                            disabled
                            style="
                                border:none;
                                padding:10px 18px;
                                border-radius:6px;
                                background:#999;
                                color:white;
                                font-weight:bold;
                                cursor:not-allowed;
                            "
                        >
                            ❌ Reject
                        </button>

                    </div>

                `;


                podRequestsContainer.appendChild(
                    card
                );

            }
        );


    }
    catch (error) {

        console.error(
            "Unable to load POD requests:",
            error
        );


        podRequestsContainer.innerHTML = `

            <div class="no-alerts">

                <div class="icon">
                    ⚠️
                </div>

                <p>
                    Unable to load POD requests.
                </p>

            </div>

        `;

    }

}

// ------------------------------------------------------------
// APPROVE / UPLOAD DRIVER POD REQUEST
// ------------------------------------------------------------

// ------------------------------------------------------------
// APPROVE / UPLOAD DRIVER POD REQUEST
// ------------------------------------------------------------

window.approvePodRequest = async function (requestId) {

    try {

        if (!requestId) {
            alert("Invalid POD request.");
            return;
        }

        // Get pending request
        const requestRef =
            doc(db, "podUploadRequests", requestId);

        const requestSnap =
            await getDoc(requestRef);

        if (!requestSnap.exists()) {

            alert("POD request no longer exists.");

            await loadPodRequests();

            return;
        }

        const request =
            requestSnap.data();

        const grNo =
            String(request.grNo || "").trim();

        if (!grNo) {
            alert("GR Number is missing.");
            return;
        }

        if (!request.imageUrl) {
            alert("POD image is missing.");
            return;
        }


        // ----------------------------------------------------
        // CURRENT ADMIN
        // ----------------------------------------------------

        const adminEmail =
            auth.currentUser
                ? auth.currentUser.email
                : "";


        // ----------------------------------------------------
        // DATE + TIME
        // ----------------------------------------------------

        const now = new Date();

        const uploadDate =
            String(now.getDate()).padStart(2, "0") +
            "-" +
            String(now.getMonth() + 1).padStart(2, "0") +
            "-" +
            now.getFullYear();

        const uploadTime =
            now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });


        // ----------------------------------------------------
        // CREATE OFFICIAL POD
        // ----------------------------------------------------

        const podRef =
            doc(db, "pods", grNo);


        await setDoc(podRef, {

            grNo: grNo,

            vehicleNo:
                request.vehicleNo || "",

            driverName:
                request.driverName || "",

            driverMobile:
                request.driverMobile || "",

            partyName:
                request.partyName || "",

            deliveryDate:
                request.deliveryDate || "",

            remarks:
                request.remarks || "",

            status:
                request.status || "Delivered",

            imageUrl:
                request.imageUrl,

            createdAt:
                serverTimestamp(),

            uploadDate:
                uploadDate,

            uploadTime:
                uploadTime,

            uploadedBy:
                adminEmail || "Main Website Admin"

        });


        // ----------------------------------------------------
        // REMOVE PENDING REQUEST
        // ----------------------------------------------------

        await deleteDoc(requestRef);


        alert(
            "POD uploaded successfully."
        );


        // ----------------------------------------------------
        // REFRESH POD REQUESTS
        // ----------------------------------------------------

        await loadPodRequests();


    }
    catch (error) {

        console.error(
            "Unable to approve POD request:",
            error
        );

        alert(
            "Unable to upload POD: " +
            error.message
        );

    }

};

// ------------------------------------------------------------
// OPEN POD REQUESTS PANEL
// ------------------------------------------------------------

if (
    podRequestsMenuBtn &&
    podRequestsPanel
) {

    podRequestsMenuBtn.addEventListener(
        "click",
        async () => {

            console.log(
                "POD Requests button clicked."
            );


            // HIDE ALL CURRENT PANELS

            document
                .querySelectorAll(
                    ".main .panel"
                )
                .forEach(
                    (panel) => {

                        panel.style.display =
                            "none";

                    }
                );


            // SHOW POD REQUESTS

            podRequestsPanel.style.display =
                "block";


            // UPDATE SIDEBAR ACTIVE STATE

            document
                .querySelectorAll(
                    ".sidebar button"
                )
                .forEach(
                    (button) => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


            podRequestsMenuBtn.classList.add(
                "active"
            );


            // LOAD REQUESTS

            await loadPodRequests();

        }
    );

}


// ------------------------------------------------------------
// REFRESH POD REQUESTS
// ------------------------------------------------------------

if (refreshPodRequestsBtn) {

    refreshPodRequestsBtn.addEventListener(
        "click",
        async () => {

            await loadPodRequests();

        }
    );

}

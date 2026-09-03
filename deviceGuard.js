import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";


// =========================================================
// FIREBASE CONFIG
// =========================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBQZREq5abr_oLzt6ksMGb-1jhlnKc92pU",

    authDomain:
        "priyanshu-roadlines-pod.firebaseapp.com",

    projectId:
        "priyanshu-roadlines-pod",

    storageBucket:
        "priyanshu-roadlines-pod.firebasestorage.app",

    messagingSenderId:
        "735411516260",

    appId:
        "1:735411516260:web:397d6a80141f032c0a0071"

};


const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// =========================================================
// GET DEVICE ID
// =========================================================

function getDeviceId() {

    let deviceId =
        localStorage.getItem(
            "securityDeviceId"
        );


    if (!deviceId) {

        deviceId =
            "DEV-" +
            crypto.randomUUID();


        localStorage.setItem(
            "securityDeviceId",
            deviceId
        );

    }


    return deviceId;

}


// =========================================================
// CHECK WHETHER DEVICE IS BLOCKED
// =========================================================

async function checkDeviceBlocked() {

    const deviceId =
        getDeviceId();


    console.log(
        "Checking device security..."
    );


    try {

        const blockedDeviceRef =
            doc(
                db,
                "blockedDevices",
                deviceId
            );


        const blockedDeviceSnapshot =
            await getDoc(
                blockedDeviceRef
            );


        // ================================================
        // DEVICE IS BLOCKED
        // ================================================

        if (
            blockedDeviceSnapshot.exists()
            &&
            blockedDeviceSnapshot.data().blocked === true
        ) {

            console.warn(
                "DEVICE ACCESS BLOCKED"
            );


            showBlockedScreen(
                deviceId
            );


            return false;

        }


        // ================================================
        // DEVICE IS NOT BLOCKED
        // ================================================

        console.log(
            "DEVICE ACCESS ALLOWED"
        );


        return true;

    }
    catch (error) {

        console.error(
            "Device security check failed:",
            error
        );


        // IMPORTANT:
        // Do not automatically block a legitimate
        // user just because Firebase temporarily
        // failed.

        return true;

    }

}


// =========================================================
// BLOCKED SCREEN
// =========================================================

function showBlockedScreen(deviceId) {

    document.documentElement.innerHTML = `

        <html>

        <head>

            <title>
                Access Restricted | PRIYANSHU ROADLINES
            </title>

            <style>

                * {

                    box-sizing: border-box;

                    margin: 0;

                    padding: 0;

                    font-family: Arial, sans-serif;

                }


                body {

                    min-height: 100vh;

                    display: flex;

                    justify-content: center;

                    align-items: center;

                    background: #f4f6f8;

                    padding: 20px;

                }


                .blocked-box {

                    width: 100%;

                    max-width: 550px;

                    background: white;

                    padding: 45px 35px;

                    border-radius: 12px;

                    text-align: center;

                    box-shadow:
                        0 5px 25px
                        rgba(0,0,0,0.12);

                    border-top:
                        6px solid #e60000;

                }


                .blocked-icon {

                    font-size: 65px;

                    margin-bottom: 20px;

                }


                h1 {

                    color: #d00000;

                    margin-bottom: 15px;

                }


                p {

                    color: #555;

                    line-height: 1.6;

                    margin-bottom: 15px;

                }


                .device-id {

                    background: #f1f1f1;

                    padding: 12px;

                    border-radius: 6px;

                    font-size: 12px;

                    word-break: break-all;

                    margin-top: 20px;

                }


                .warning {

                    color: #d00000;

                    font-weight: bold;

                }

            </style>

        </head>


        <body>

            <div class="blocked-box">

                <div class="blocked-icon">
                    🚫
                </div>


                <h1>
                    Access Restricted
                </h1>


                <p>
                    This device has been
                    restricted from accessing
                    PRIYANSHU ROADLINES.
                </p>


                <p class="warning">
                    Please contact the
                    administrator if you believe
                    this is an error.
                </p>


                <div class="device-id">

                    Device ID:<br>

                    ${deviceId}

                </div>

            </div>

        </body>

        </html>

    `;

}


// =========================================================
// RUN SECURITY CHECK
// =========================================================

checkDeviceBlocked();

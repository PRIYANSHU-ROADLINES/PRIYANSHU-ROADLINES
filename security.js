import {
    getApp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";


// ============================================
// USE THE SAME POD AUTH APP
// ============================================

const podAuthApp =
    getApp("POD_AUTH_APP");

const auth =
    getAuth(podAuthApp);

const db =
    getFirestore(podAuthApp);


// ============================================
// DEVICE ID
// ============================================

function getDeviceId() {

    let deviceId =
        localStorage.getItem("deviceId");

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

export function checkSecurity(callback) {

    onAuthStateChanged(
        auth,
        async (user) => {

            // --------------------------------
            // NOT LOGGED IN
            // --------------------------------

            if (!user) {

                alert(
                    "Please login first."
                );

                window.location.replace(
                    "pod.html"
                );

                return;
            }


            // --------------------------------
            // CHECK TRUSTED DEVICE
            // --------------------------------

            const deviceId =
                getDeviceId();

            const q = query(

                collection(
                    db,
                    "trustedDevices"
                ),

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


            const snap =
                await getDocs(q);


            // --------------------------------
            // DEVICE NOT APPROVED
            // --------------------------------

            if (snap.empty) {

                alert(
                    "Device not approved."
                );

                window.location.replace(
                    "pod.html"
                );

                return;
            }


            // --------------------------------
            // EVERYTHING OK
            // --------------------------------

            callback();

        }
    );

}

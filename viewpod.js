import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Firebase Config
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

// Read GR Number from URL
const params = new URLSearchParams(window.location.search);
const grNo = params.get("gr");

if (!grNo) {

    document.getElementById("result").innerHTML =
    "<h2>No GR Number Found.</h2>";

} else {

    loadPOD(grNo);

}

async function loadPOD(grNo){

    const snap = await getDoc(doc(db,"pods",grNo));

    if(!snap.exists()){

        document.getElementById("result").innerHTML =
        "<h2>POD Not Found</h2>";

        return;

    }

    const data = snap.data();

    document.getElementById("result").innerHTML = `

<h2>GR Number : ${data.grNo}</h2>

<p><b>Party :</b> ${data.partyName || "-"}</p>

<p><b>Vehicle :</b> ${data.vehicleNo || "-"}</p>

<p><b>Driver :</b> ${data.driverName || "-"}</p>

<p><b>Mobile :</b> ${data.driverMobile || "-"}</p>

<p><b>Delivery Date :</b> ${data.deliveryDate || "-"}</p>

<p><b>Upload Date :</b> ${data.uploadDate || "-"}</p>

<p><b>Upload Time :</b> ${data.uploadTime || "-"}</p>

<p><b>Uploaded By :</b> ${data.uploadedBy || "-"}</p>

<p><b>Status :</b> ${data.status || "-"}</p>

<p><b>Remarks :</b> ${data.remarks || "-"}</p>

<img src="${data.imageUrl}" alt="POD">

<br><br>

<a href="${data.imageUrl}" target="_blank">
Download POD
</a>
<br><br>

<button onclick="editPOD()">
✏ Edit POD
</button>

<button onclick="deletePOD()">
🗑 Delete POD
</button>

`;

}
window.editPOD = function () {

    window.location.href =
        "pod.html?gr=" + grNo;

};

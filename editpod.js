import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
getFirestore,
doc,
getDoc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

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

const params = new URLSearchParams(window.location.search);

const grNo = params.get("gr");

if(!grNo){

alert("GR Number Missing");

history.back();

}

loadPOD();

async function loadPOD(){

const snap = await getDoc(doc(db,"pods",grNo));

if(!snap.exists()){

alert("POD Not Found");

history.back();

return;

}

const data = snap.data();

document.getElementById("grNo").value =
data.grNo || "";

document.getElementById("vehicleNo").value =
data.vehicleNo || "";

document.getElementById("driverName").value =
data.driverName || "";

document.getElementById("driverMobile").value =
data.driverMobile || "";

document.getElementById("partyName").value =
data.partyName || "";

document.getElementById("deliveryDate").value =
data.deliveryDate || "";

document.getElementById("remarks").value =
data.remarks || "";

document.getElementById("status").value =
data.status || "Pending";

document.getElementById("uploadDate").innerText =
data.uploadDate || "-";

document.getElementById("uploadTime").innerText =
data.uploadTime || "-";

document.getElementById("uploadedBy").innerText =
data.uploadedBy || "-";

}

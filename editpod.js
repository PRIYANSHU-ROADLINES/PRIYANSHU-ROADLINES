import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyBQZREq5abr_oLzt6ksMGb-1jhlnKc92pU",
authDomain: "priyanshu-roadlines-pod.firebaseapp.com",
projectId: "priyanshu-roadlines-pod",
storageBucket: "priyanshu-roadlines-pod.firebasestorage.app",
messagingSenderId: "735411516260",
appId: "1:735411516260:web:397d6a80141f032c0a0071"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);

const grNo = params.get("gr");

if(!grNo){

alert("GR Number Missing");

history.back();

}
onAuthStateChanged(auth, (user) => {

    console.log("Auth callback fired");
    console.log("User =", user);

    if (!user) {

        console.log("No user found");

        alert("Please login first.");

        window.location.replace("pod.html");

        return;
    }

    console.log("Logged in as:", user.email);

    loadPOD(grNo);

});

async function loadPOD(grNo){

const snap = await getDoc(doc(db,"pods",grNo));

if(!snap.exists()){

alert("POD Not Found");

history.back();

return;

}

const data = snap.data();
    
<label><b>GR Number</b></label>
<input type="text" id="grNo" readonly>
document.getElementById("grNo").value =
data.grNo || "";
    
<label><b>Vehicle Number</b></label>
<input type="text" id="vehicleNo">
document.getElementById("vehicleNo").value =
data.vehicleNo || "";

<label><b>Driver Name</b></label>
<input type="text" id="driverName">
document.getElementById("driverName").value =
data.driverName || "";

<label><b>Driver Mobile</b></label>
<input type="text" id="driverMobile">
document.getElementById("driverMobile").value =
data.driverMobile || "";
    
<label><b>Party Name</b></label>
<input type="text" id="partyName">
document.getElementById("partyName").value =
data.partyName || "";

<label><b>Delivery Date</b></label>
<input type="date" id="deliveryDate">
document.getElementById("deliveryDate").value =
data.deliveryDate || "";

<label><b>Remarks</b></label>
<textarea id="remarks"></textarea>
document.getElementById("remarks").value =
data.remarks || "";

<label><b>Status</b></label>
<select id="status">
    <option value="Pending">Pending</option>
    <option value="Delivered">Delivered</option>
    <option value="Completed">Completed</option>
</select>
document.getElementById("status").value =
data.status || "Pending";

document.getElementById("uploadDate").innerText =
data.uploadDate || "-";

document.getElementById("uploadTime").innerText =
data.uploadTime || "-";

document.getElementById("uploadedBy").innerText =
data.uploadedBy || "-";

}
window.updatePOD = async function(){

await updateDoc(doc(db,"pods",grNo),{

vehicleNo:
document.getElementById("vehicleNo").value,

driverName:
document.getElementById("driverName").value,

driverMobile:
document.getElementById("driverMobile").value,

partyName:
document.getElementById("partyName").value,

deliveryDate:
document.getElementById("deliveryDate").value,

remarks:
document.getElementById("remarks").value,

status:
document.getElementById("status").value

});

alert("POD Updated Successfully");

window.location.href =
"viewpod.html?gr=" + grNo;

};
window.deletePOD = async function(){

const confirmDelete =
confirm("Delete this POD?");

if(!confirmDelete) return;

await deleteDoc(doc(db,"pods",grNo));

alert("POD Deleted Successfully");

window.location.href =
"pod.html";

};

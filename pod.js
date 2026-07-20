// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  orderBy,
  query,
  limit,
  where,
  serverTimestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.2/package/xlsx.mjs";
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

const auth = getAuth(app);
signOut(auth);
const db = getFirestore(app);

let isAdminLoggedIn = false;
window.getDeviceId = function() {

  let deviceId =
    localStorage.getItem("deviceId");

  if (!deviceId) {

    deviceId =
      "device_" +
      Math.random()
      .toString(36)
      .substring(2,15);

    localStorage.setItem(
      "deviceId",
      deviceId
    );

  }

  return deviceId;

}

// Cloudinary
const CLOUD_NAME = "de3ipfolr";
const UPLOAD_PRESET = "pod_upload";

// Login
window.login = async function () {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

   const userCredential =
  await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

const user = userCredential.user;
    const deviceId = getDeviceId();

const trustedQuery = query(
  collection(db, "trustedDevices"),
  where("deviceId", "==", deviceId),
  where("approved", "==", true)
);

const trustedSnapshot =
  await getDocs(trustedQuery);

if (trustedSnapshot.empty) {

  await addDoc(
    collection(db, "pendingDevices"),
    {
      email: user.email,
      deviceId: deviceId,
      device: navigator.userAgent,
      createdAt: serverTimestamp()
    }
  );

  await signOut(auth);

  alert(
    "Device Approval Required. Contact Administrator."
  );

  return;
}
const trustedDoc =
trustedSnapshot.docs[0];

const trustedData =
trustedDoc.data();

if(trustedData.status === "Blocked"){

  await signOut(auth);

  alert(
    "This device has been blocked by Admin."
  );

  return;
}
alert("Login Successful");

await updateDoc(
  doc(
    db,
    "trustedDevices",
    trustedDoc.id
  ),
  {
    loginCount:
      (trustedData.loginCount || 0) + 1,

    lastLogin:
      new Date().toLocaleString()
  }
);

addDoc(
  collection(db, "loginHistory"),
  {
    email: user.email,
    loginTime: serverTimestamp(),
    device: navigator.userAgent
  }
);
      

  } catch (err) {

    alert(err.message);

  }

};
// Logout
window.logout = async function () {
  await signOut(auth);
  alert("Logged Out");
};

// Auth State
onAuthStateChanged(auth, (user) => {

  const adminPanel = document.getElementById("adminPanel");
  const loginBox = document.getElementById("loginBox");
  const searchPanel = document.getElementById("searchPanel");
  const loginHistorySection =
  document.getElementById("loginHistorySection");
  const deviceApprovalSection =
document.getElementById("deviceApprovalSection");
  const trustedDevicesSection =
document.getElementById("trustedDevicesSection");
  
  if (user) {

    isAdminLoggedIn = true;

    adminPanel.style.display = "block";
    if(loginHistorySection){
  loginHistorySection.style.display = "block";
}

if(deviceApprovalSection){
  deviceApprovalSection.style.display = "block";
}
    if(trustedDevicesSection){
  trustedDevicesSection.style.display = "block";
}

    if (searchPanel) {
      searchPanel.style.display = "block";
    }
    

    if (loginBox) {
      loginBox.style.display = "none";
    }

    loadRecentPods();
    loadDashboard();
    loadSystemStats();
    

    
  } else {

    isAdminLoggedIn = false;

    adminPanel.style.display = "none";
    if(loginHistorySection){
  loginHistorySection.style.display = "none";
}

    if (searchPanel) {
      searchPanel.style.display = "none";
    }

    if (loginBox) {
      loginBox.style.display = "block";
    }
  }
});
  
// Upload POD
async function compressImage(file) {

  return new Promise((resolve) => {

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function(event) {

      const img = new Image();

      img.src = event.target.result;

      img.onload = function() {

        const canvas =
        document.createElement("canvas");

        const MAX_WIDTH = 1200;

        let width = img.width;
        let height = img.height;

        if(width > MAX_WIDTH){

          height =
          height * (MAX_WIDTH / width);

          width = MAX_WIDTH;

        }

        canvas.width = width;
        canvas.height = height;

        const ctx =
        canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(

          (blob) => {

            resolve(blob);

          },

          "image/jpeg",

          0.7

        );

      };

    };

  });

}
window.uploadPOD = async function () {
  const saveButton =
document.querySelector(
'button[onclick="uploadPOD()"]'
);

saveButton.disabled = true;
saveButton.innerText =
"Uploading...";

  const grNo = document.getElementById("grNo").value.trim();

  if (!grNo) {
    alert("GR Number is required");
    return;
  }

  const file = document.getElementById("podImage").files[0];

if (!file) {
  alert("Please select POD image");
  return;
}

const compressedFile = await compressImage(file);
    

  // Duplicate Check
  const existing = await getDoc(doc(db, "pods", grNo));

  if (existing.exists()) {
    const confirmReplace = confirm(
      "GR Number already exists. Replace existing POD?"
    );

    if (!confirmReplace) return;
  }

  try {
    const saveButton =
document.querySelector(
'button[onclick="uploadPOD()"]'
);

saveButton.disabled = true;
saveButton.innerText = "Uploading...";
    // Upload Image to Cloudinary
    const formData = new FormData();

    formData.append(
  "file",
  compressedFile,
  "pod.jpg"
);
    formData.append("upload_preset", UPLOAD_PRESET);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    const uploadData = await uploadResponse.json();

    const imageUrl = uploadData.secure_url;

    // Save Firestore
const now = new Date();

const uploadDate =
String(now.getDate()).padStart(2, "0") + "-" +
String(now.getMonth() + 1).padStart(2, "0") + "-" +
now.getFullYear();

const uploadTime =
now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
});

await setDoc(doc(db, "pods", grNo), {

    grNo,

    vehicleNo:
      document.getElementById("vehicleNo").value || "",

    driverName:
      document.getElementById("driverName").value || "",

    driverMobile:
      document.getElementById("driverMobile").value || "",

    partyName:
      document.getElementById("partyName").value || "",

    deliveryDate:
      document.getElementById("deliveryDate").value || "",

    remarks:
      document.getElementById("remarks").value || "",

    status:
      document.getElementById("status").value,

    imageUrl,

    createdAt: serverTimestamp(),

    uploadDate: uploadDate,

    uploadTime: uploadTime,

    uploadedBy: auth.currentUser.email

});
    saveButton.disabled = false;

saveButton.innerText =
"Save POD";
    alert("POD Saved Successfully");
    

    document.getElementById("grNo").value = "";
    document.getElementById("vehicleNo").value = "";
    document.getElementById("driverName").value = "";
    document.getElementById("driverMobile").value = "";
    document.getElementById("partyName").value = "";
    document.getElementById("deliveryDate").value = "";
    document.getElementById("remarks").value = "";
    document.getElementById("podImage").value = "";

    loadRecentPods();

  } catch (error) {
    saveButton.disabled = false;

saveButton.innerText =
"Save POD";
    alert(error.message);
  }
};

// Search POD

window.searchPOD = async function () {

  const grNo = document.getElementById("searchGR").value.trim();

  if (!grNo) {
    alert("Enter GR Number");
    return;
  }

  const snap = await getDoc(doc(db, "pods", grNo));

  const result = document.getElementById("result");

  if (!snap.exists()) {
    result.innerHTML = "<h3>POD Not Found</h3>";
    return;
  }

  const data = snap.data();

  let deleteButton = "";

  if (isAdminLoggedIn) {
    deleteButton = `
      <br><br>
      <button onclick="deletePOD('${data.grNo}')">
        Delete POD
      </button>
    `;
  }

  result.innerHTML = `
    <h3>GR Number: ${data.grNo}</h3>

    <p><b>Status:</b> ${data.status === "Blocked"
 ? "🔴 Blocked"
 : "🟢 Active"}</p>

    <p><b>Vehicle:</b> ${data.vehicleNo || "-"}</p>

    <p><b>Driver:</b> ${data.driverName || "-"}</p>

    <p><b>Mobile:</b> ${data.driverMobile || "-"}</p>

    <p><b>Party:</b> ${data.partyName || "-"}</p>

    <p><b>Delivery Date:</b> ${data.deliveryDate || "-"}</p>

    <p><b>Remarks:</b> ${data.remarks || "-"}</p>

    <img src="${data.imageUrl}" width="400">

    <br><br>

    <a href="${data.imageUrl}" target="_blank">
      Download POD
    </a>

    ${deleteButton}
   
  `;
};
async function loadDashboard() {

  const snapshot = await getDocs(collection(db,"pods"));

  let total = 0;
  let completed = 0;
  let pending = 0;
  let delivered = 0;

  snapshot.forEach((docItem)=>{

    total++;

    const pod = docItem.data();

    if(pod.status === "Completed"){
      completed++;
    }

    if(pod.status === "Pending"){
      pending++;
    }

    if(pod.status === "Delivered"){
      delivered++;
    }

  });

  document.getElementById("totalPods").innerText = total;
  document.getElementById("completedPods").innerText = completed;
  document.getElementById("pendingPods").innerText = pending;
  document.getElementById("deliveredPods").innerText = delivered;

}
// Recent POD List
async function loadRecentPods() {

  const snapshot = await getDocs(collection(db, "pods"));

  const container =
    document.getElementById("recentPods");

  container.innerHTML = "";

  snapshot.forEach((docItem) => {

    const pod = docItem.data();

    container.innerHTML += `
      <div style="
      padding:10px;
      margin:8px 0;
      border:1px solid #ddd;
      border-radius:6px;">
      
      <b>${pod.grNo}</b>
      -
      ${pod.status}
      </div>
    `;
  });
}
window.deletePOD = async function(grNo){

  const confirmDelete = confirm(
    "Are you sure you want to delete this POD?"
  );

  if(!confirmDelete) return;

  try{

    await deleteDoc(doc(db,"pods",grNo));

    alert("POD Deleted Successfully");

    document.getElementById("result").innerHTML = "";

    loadRecentPods();

  }catch(error){

    alert(error.message);

  }
  };
window.downloadExcel = async function(){

  const snapshot =
  await getDocs(collection(db,"pods"));

  let data = [];

  snapshot.forEach((docItem)=>{

    data.push(docItem.data());

  });

  const worksheet =
  XLSX.utils.json_to_sheet(data);

  const workbook =
  XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "POD Report"
  );

  XLSX.writeFile(
    workbook,
    "POD_Report.xlsx"
  );

}


window.toggleRecentPods = function(){

  const box =
  document.getElementById("recentPods");

  box.style.display =
  box.style.display === "none"
  ? "block"
  : "none";

}
window.loadLoginHistory = async function () {

  const q = query(
    collection(db, "loginHistory"),
    orderBy("loginTime", "desc"),
    limit(20)
  );

  const snapshot = await getDocs(q);

  const box =
    document.getElementById("loginHistoryBox");

  box.innerHTML = "";

  snapshot.forEach((docItem) => {

    const data = docItem.data();

   box.innerHTML += `
  <div style="
    border:1px solid #ddd;
    padding:10px;
    margin:5px;
    border-radius:5px;
  ">
    <b>Email:</b> ${data.email}<br>
    <b>Device:</b> ${data.device}<br><br>

    <button onclick="deleteLoginHistory('${docItem.id}')">
      Delete
    </button>

  </div>
`;
  });

};
window.toggleLoginHistory =
async function(){

  const box =
  document.getElementById(
    "loginHistoryBox"
  );

  if(box.style.display === "none"){

    box.style.display = "block";

    await loadLoginHistory();

  }else{

    box.style.display = "none";

  }

}
let logoutTimer;

function resetLogoutTimer() {

    clearTimeout(logoutTimer);

    logoutTimer = setTimeout(async () => {

        alert("Session expired. Please login again.");

        await signOut(auth);

        window.location.href = "index.html";

    }, 5 * 60 * 1000);

}

document.addEventListener("mousemove", resetLogoutTimer);
document.addEventListener("keydown", resetLogoutTimer);
document.addEventListener("click", resetLogoutTimer);

resetLogoutTimer();
window.loadPendingDevices = async function () {

  const snapshot =
  await getDocs(collection(db,"pendingDevices"));

  const box =
  document.getElementById("pendingDevicesBox");

  box.innerHTML = "";

  snapshot.forEach((docItem)=>{

    const data = docItem.data();

    box.innerHTML += `

      <div style="
        border:1px solid #ddd;
        padding:10px;
        margin:10px;
        border-radius:5px;
      ">

        <b>Email:</b>
        ${data.email}<br>

        <b>Device ID:</b>
        ${data.deviceId}<br><br>

        <button
        onclick="approveDevice('${docItem.id}')">
        Approve
        </button>
        <button
onclick="rejectDevice('${docItem.id}')">
Reject
</button>

      </div>

    `;

  });

};

window.approveDevice = async function(docId){

  const pendingRef =
  doc(db,"pendingDevices",docId);

  const snap =
  await getDoc(pendingRef);

  if(!snap.exists()) return;

  const data = snap.data();

  await addDoc(
  collection(db,"trustedDevices"),
  {
    approved:true,
    deviceId:data.deviceId,
    deviceName:data.device,
    status:"Active",
    loginCount:0,
    lastLogin:"Never"
  }
);
  await deleteDoc(pendingRef);

  alert("Device Approved Successfully");

  loadPendingDevices();

};
window.rejectDevice = async function(docId){

  const confirmReject =
  confirm("Reject this device request?");

  if(!confirmReject) return;

  await deleteDoc(
    doc(db,"pendingDevices",docId)
  );

  alert("Device Request Rejected");

  loadPendingDevices();

};
window.togglePendingDevices =
async function(){

  const box =
  document.getElementById(
    "pendingDevicesBox"
  );

  if(box.style.display === "none"){

    box.style.display = "block";

    await loadPendingDevices();

  }else{

    box.style.display = "none";

  }

}
window.loadTrustedDevices = async function () {

  const snapshot =
  await getDocs(
    collection(db,"trustedDevices")
  );

  const box =
  document.getElementById(
    "trustedDevicesBox"
  );

  box.innerHTML = "";

  snapshot.forEach((docItem)=>{

    const data = docItem.data();

    box.innerHTML += `

      <div style="
        border:1px solid #ddd;
        padding:10px;
        margin:10px;
        border-radius:5px;
      ">

        <b>Device:</b>
        ${data.deviceName}<br>

        <b>Status:</b>
        ${data.status === "Blocked"
 ? "🔴 Blocked"
 : "🟢 Active"}</p>

        <b>Login Count:</b>
        ${data.loginCount || 0}<br>

        <b>Last Login:</b>
        ${data.lastLogin || "Never"}<br><br>

        <button
onclick="renameDevice('${docItem.id}')">
Rename Device
</button>
<button
onclick="${data.status === 'Blocked'
  ? `unblockDevice('${docItem.id}')`
  : `blockDevice('${docItem.id}')`}">

${data.status === 'Blocked'
  ? 'Unblock Device'
  : 'Block Device'}

</button>

        <button
        onclick="removeDevice('${docItem.id}')">
        Remove Access
        </button>

      </div>

    `;

  });

};
window.toggleTrustedDevices =
async function(){

  const box =
  document.getElementById(
    "trustedDevicesBox"
  );

  if(box.style.display === "none"){

    box.style.display = "block";

    await loadTrustedDevices();

  }else{

    box.style.display = "none";

  }

}

window.removeDevice = async function(docId){

  const confirmDelete =
  confirm(
    "Remove this device access?"
  );

  if(!confirmDelete) return;

  await deleteDoc(
    doc(
      db,
      "trustedDevices",
      docId
    )
  );

  alert(
    "Device Removed Successfully"
  );

  loadTrustedDevices();

};
window.renameDevice = async function(docId){

  const newName =
  prompt("Enter new device name");

  if(!newName) return;

  await updateDoc(
    doc(db,"trustedDevices",docId),
    {
      deviceName:newName
    }
  );

  alert("Device Renamed");

  loadTrustedDevices();

};
window.blockDevice = async function(docId){

  const confirmBlock =
  confirm("Block this device?");

  if(!confirmBlock) return;

  await updateDoc(
    doc(db,"trustedDevices",docId),
    {
      status:"Blocked"
    }
  );

  alert("Device Blocked");

  loadTrustedDevices();

};
window.unblockDevice = async function(docId){

  const confirmUnblock =
  confirm("Unblock this device?");

  if(!confirmUnblock) return;

  await updateDoc(
    doc(db,"trustedDevices",docId),
    {
      status:"Active"
    }
  );

  alert("Device Unblocked");

  loadTrustedDevices();

};
window.deleteLoginHistory = async function(docId){

  const confirmDelete =
  confirm("Delete this login history?");

  if(!confirmDelete) return;

  await deleteDoc(
    doc(db,"loginHistory",docId)
  );

  alert("History Deleted");

  loadLoginHistory();

};
window.deleteAllLoginHistory = async function(){

  const confirmDelete =
  confirm(
    "Delete ALL login history?"
  );

  if(!confirmDelete) return;

  const snapshot =
  await getDocs(
    collection(db,"loginHistory")
  );

  const batch =
  writeBatch(db);

  snapshot.forEach((docItem)=>{

    batch.delete(docItem.ref);

  });

  await batch.commit();

  alert("All Login History Deleted");

  loadLoginHistory();

};
window.handleSearchEnter = function(event){

  if(event.key === "Enter"){

    searchPOD();

  }

};
window.searchByDate = async function(){

const fromDate =
document.getElementById("fromDate").value;

const toDate =
document.getElementById("toDate").value;

if(!fromDate || !toDate){

alert("Select both dates");

return;

}

const snapshot =
await getDocs(collection(db,"pods"));

const resultBox =
document.getElementById("result");

resultBox.innerHTML = "";

let found = false;

snapshot.forEach((docItem)=>{

const pod = docItem.data();

if(
pod.deliveryDate >= fromDate &&
pod.deliveryDate <= toDate
){

found = true;

resultBox.innerHTML += `

<div style="
border:1px solid #ddd;
padding:10px;
margin:10px 0;
border-radius:5px;
">

<b>GR No:</b> ${pod.grNo}<br>

<b>Party:</b> ${pod.partyName || "-"}<br>

<b>Vehicle:</b> ${pod.vehicleNo || "-"}<br>

<b>Delivery Date:</b> ${pod.deliveryDate || "-"}<br>

<b>Status:</b> ${pod.status || "-"}<br><br>

<button
onclick="searchFromList('${pod.grNo}')">
View POD
</button>

</div>

`;

}

});

if(!found){

resultBox.innerHTML =
"<h3>No POD found in selected date range</h3>";

}

}
async function loadSystemStats(){

// Trusted Devices
const trustedSnapshot =
await getDocs(
collection(db,"trustedDevices")
);

document.getElementById(
"totalDevices"
).innerText =
trustedSnapshot.size;

// Pending Requests
const pendingSnapshot =
await getDocs(
collection(db,"pendingDevices")
);

document.getElementById(
"pendingRequests"
).innerText =
pendingSnapshot.size;

// Total Logins
const loginSnapshot =
await getDocs(
collection(db,"loginHistory")
);

document.getElementById(
"totalLogins"
).innerText =
loginSnapshot.size;

}
window.toggleAllPods = async function(){

const box =
document.getElementById("allPodsBox");

if(box.style.display === "none"){

box.style.display = "block";

loadAllPods();

}else{

box.style.display = "none";

}
}
window.loadAllPods = async function(){

const snapshot =
await getDocs(collection(db,"pods"));

const box =
document.getElementById("allPodsBox");

box.innerHTML = "";

snapshot.forEach((docItem)=>{

const pod = docItem.data();

box.innerHTML += `
<div style="
border:1px solid #ddd;
padding:10px;
margin:5px;
border-radius:5px;
">

<b>GR:</b> ${pod.grNo}<br>

<b>Party:</b> ${pod.partyName || "-"}<br>

<b>Vehicle:</b> ${pod.vehicleNo || "-"}<br>

<b>Status:</b> ${pod.status}<br><br>

<button onclick="searchFromList('${pod.grNo}')">
View
</button>

</div>
`;

});

}

window.searchFromList = function(grNo){

document.getElementById("searchGR").value = grNo;

searchPOD();

document.getElementById("searchPanel")
.scrollIntoView({
behavior:"smooth"
});

}

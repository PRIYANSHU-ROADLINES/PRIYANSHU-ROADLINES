let editMode = false;
let currentGR = "";
// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp
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

// Cloudinary
const CLOUD_NAME = "de3ipfolr";
const UPLOAD_PRESET = "pod_upload";

// Login
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;

if (!user.emailVerified) {

  await sendEmailVerification(user);

  alert(
    "Verification email sent. Please verify your email first."
  );

  await signOut(auth);

  return;
}
    alert("Login Successful");
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

  if (user) {

    isAdminLoggedIn = true;

    adminPanel.style.display = "block";

    if (searchPanel) {
      searchPanel.style.display = "block";
    }

    if (loginBox) {
      loginBox.style.display = "none";
    }

    loadRecentPods();
    loadDashboard();

  } else {

    isAdminLoggedIn = false;

    adminPanel.style.display = "none";

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
if(editMode){

  await setDoc(doc(db,"pods",currentGR),{

    grNo: currentGR,

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
      document.getElementById("status").value

  },{merge:true});

  alert("POD Updated Successfully");
document.getElementById("grNo").value = "";
document.getElementById("vehicleNo").value = "";
document.getElementById("driverName").value = "";
document.getElementById("driverMobile").value = "";
document.getElementById("partyName").value = "";
document.getElementById("deliveryDate").value = "";
document.getElementById("remarks").value = "";
  editMode = false;
  currentGR = "";

  document.querySelector(
  'button[onclick="uploadPOD()"]'
  ).innerText = "Save POD";

  loadRecentPods();
  loadDashboard();
saveButton.disabled = false;
saveButton.innerText = "Save POD";
  return;
}
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

      createdAt: serverTimestamp()
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

    <p><b>Status:</b> ${data.status}</p>

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
    ${isAdminLoggedIn ? `
<button onclick="editPOD('${data.grNo}')">
Edit POD
</button>
` : ""}
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
window.editPOD = async function(grNo){

  const snap =
  await getDoc(doc(db,"pods",grNo));

  if(!snap.exists()) return;

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

  document
  .getElementById("adminPanel")
  .scrollIntoView({
      behavior:"smooth"
  });

editMode = true;
currentGR = grNo;

document.querySelector(
'button[onclick="uploadPOD()"]'
).innerText = "Save Changes";
  };

window.toggleRecentPods = function () {

  const podList = document.getElementById("recentPods");

  if (podList.style.display === "none") {
    podList.style.display = "block";
  } else {
    podList.style.display = "none";
  }
};

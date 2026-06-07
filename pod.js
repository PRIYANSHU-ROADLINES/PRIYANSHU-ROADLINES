// Firebase Imports
alert("POD JS LOADED");
console.log("POD JS LOADED");
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
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp
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
window.uploadPOD = async function () {

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

  // Duplicate Check
  const existing = await getDoc(doc(db, "pods", grNo));

  if (existing.exists()) {
    const confirmReplace = confirm(
      "GR Number already exists. Replace existing POD?"
    );

    if (!confirmReplace) return;
  }

  try {

    // Upload Image to Cloudinary
    const formData = new FormData();

    formData.append("file", file);
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
  `;
};

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

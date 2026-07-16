import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
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
let allPods = [];
let filteredPods = [];
let currentPage = 1;
const recordsPerPage = 10;



async function loadAllPods() {

    const snapshot = await getDocs(collection(db, "pods"));

    allPods = [];

    snapshot.forEach((docItem) => {
        allPods.push(docItem.data());
    });

    filteredPods = [...allPods];

    currentPage = 1;

    renderPods();

}

function renderPods() {

    const container =
    document.getElementById("allPodsContainer");

    container.innerHTML = "";

    const start =
    (currentPage - 1) * recordsPerPage;

    const end =
    start + recordsPerPage;

    const pageData =
    filteredPods.slice(start, end);

    pageData.forEach((pod) => {

        container.innerHTML += `

<div style="
background:white;
padding:15px;
margin:15px 0;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,.2);
">

<b>GR No:</b> ${pod.grNo}<br>

<b>Party:</b> ${pod.partyName || "-"}<br>

<b>Vehicle:</b> ${pod.vehicleNo || "-"}<br>

<b>Status:</b> ${pod.status}<br><br>

<button onclick="window.location.href='viewpod.html?gr=${pod.grNo}'">
👁 View POD
</button>

</div>

`;

    });

    const totalPages =
    Math.ceil(filteredPods.length / recordsPerPage);

    container.innerHTML += `

<div style="text-align:center;margin-top:20px;">

<button
onclick="prevPage()"
${currentPage==1 ? "disabled" : ""}>
Previous
</button>

<span style="margin:0 20px;">
Page ${currentPage} of ${totalPages}
</span>

<button
onclick="nextPage()"
${currentPage==totalPages ? "disabled" : ""}>
Next
</button>

</div>

`;

}

window.nextPage=function(){

    if(currentPage < Math.ceil(filteredPods.length / recordsPerPage)){

        currentPage++;

        renderPods();

    }

}

window.prevPage=function(){

    if(currentPage > 1){

        currentPage--;

        renderPods();

    }

}

loadAllPods();
window.searchPod = async function () {

  const gr = document
    .getElementById("searchGR")
    .value
    .trim()
    .toLowerCase();

  const snapshot =
    await getDocs(collection(db, "pods"));

  const container =
    document.getElementById("allPodsContainer");

  container.innerHTML = "";

  snapshot.forEach((docItem) => {

    const pod = docItem.data();

    if (
      pod.grNo &&
      pod.grNo.toLowerCase().includes(gr)
    ) {

      container.innerHTML += `

<div style="
background:white;
padding:15px;
margin:15px 0;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,.2);
">

<b>GR No:</b> ${pod.grNo}<br>

<b>Party:</b> ${pod.partyName || "-"}<br>

<b>Vehicle:</b> ${pod.vehicleNo || "-"}<br>

<b>Status:</b> ${pod.status}<br><br>

<button onclick="window.location.href='viewpod.html?gr=${pod.grNo}'">
👁 View POD
</button>

</div>

`;

    }

  });

};
window.filterStatus = async function(status){

const snapshot =
await getDocs(collection(db,"pods"));

const container =
document.getElementById("allPodsContainer");

container.innerHTML = "";

snapshot.forEach((docItem)=>{

const pod = docItem.data();

if(status==="All" || pod.status===status){

container.innerHTML += `

<div style="
background:white;
padding:15px;
margin:15px 0;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,.2);
">

<b>GR No:</b> ${pod.grNo}<br>

<b>Party:</b> ${pod.partyName || "-"}<br>

<b>Vehicle:</b> ${pod.vehicleNo || "-"}<br>

<b>Status:</b> ${pod.status}<br><br>

<button onclick="window.location.href='viewpod.html?gr=${pod.grNo}'">
👁 View POD
</button>

</div>

`;

}

});

};
window.searchPod = window.searchPod;
window.filterStatus = window.filterStatus;
window.searchByDate = async function () {

    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    if (!fromDate || !toDate) {
        alert("Please select both dates");
        return;
    }

    const snapshot = await getDocs(collection(db, "pods"));

    const container = document.getElementById("allPodsContainer");

    container.innerHTML = "";

    snapshot.forEach((docItem) => {

        const pod = docItem.data();

        if (
            pod.deliveryDate >= fromDate &&
            pod.deliveryDate <= toDate
        ) {

            container.innerHTML += `

<div style="
background:white;
padding:15px;
margin:15px 0;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,.2);
">

<b>GR No:</b> ${pod.grNo}</br>

<b>Party:</b> ${pod.partyName || "-"}</br>

<b>Vehicle:</b> ${pod.vehicleNo || "-"}</br>

<b>Status:</b> ${pod.status}</br><br>

<button onclick="window.location.href='viewpod.html?gr=${pod.grNo}'">
👁 View POD
</button>

</div>

`;

        }

    });

    if (container.innerHTML === "") {
        container.innerHTML = "<h3>No POD found in selected date range.</h3>";
    }

};

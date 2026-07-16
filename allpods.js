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

window.loadAllPods = async function () {

    const snapshot = await getDocs(collection(db, "pods"));

    allPods = [];

    snapshot.forEach((docItem) => {
        allPods.push(docItem.data());
    });

    allPods.sort((a, b) => b.grNo.localeCompare(a.grNo));

    filteredPods = [...allPods];

    currentPage = 1;

    renderPods();

};

function renderPods() {

    const container = document.getElementById("allPodsContainer");

    container.innerHTML = "";

    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;

    const pageData = filteredPods.slice(start, end);

    if (pageData.length === 0) {

        container.innerHTML =
        "<h3>No POD Found</h3>";

        updatePagination();

        return;

    }

    pageData.forEach((pod) => {

    container.innerHTML += `
<div class="pod-card">

<h3>🚚 GR ${pod.grNo}</h3>

<p><b>Party:</b> ${pod.partyName || "-"}</p>

<p><b>Vehicle:</b> ${pod.vehicleNo || "-"}</p>

<p><b>Status:</b> ${pod.status || "-"}</p>

<p><b>Date:</b> ${pod.deliveryDate || "-"}</p>

<button class="view-btn"
onclick="window.location.href='viewpod.html?gr=${pod.grNo}'">
View POD
</button>

</div>
`; 
        
    });

    updatePagination();

}

function updatePagination() {

    const pageInfo =
    document.getElementById("pageInfo");

    if (!pageInfo) return;

    const totalPages =
    Math.ceil(filteredPods.length / recordsPerPage);

    pageInfo.innerHTML =
    `Page ${currentPage} of ${totalPages || 1}`;

}

window.nextPage = function () {

    const totalPages =
    Math.ceil(filteredPods.length / recordsPerPage);

    if (currentPage < totalPages) {

        currentPage++;

        renderPods();

    }

};

window.prevPage = function () {

    if (currentPage > 1) {

        currentPage--;

        renderPods();

    }
  window.goToPage = function(page){

    currentPage = page;

    renderPods();

}

};

window.liveSearch = function () {

    const keyword =
    document.getElementById("liveSearch")
    .value
    .toLowerCase()
    .trim();

    filteredPods = allPods.filter((pod) => {

        return (
            (pod.grNo || "").toLowerCase().includes(keyword) ||
            (pod.partyName || "").toLowerCase().includes(keyword) ||
            (pod.vehicleNo || "").toLowerCase().includes(keyword)
        );

    });

    currentPage = 1;

    renderPods();

};

window.searchByDate = async function () {

    const fromDate =
    document.getElementById("fromDate").value;

    const toDate =
    document.getElementById("toDate").value;

    if (!fromDate || !toDate) {

        alert("Select both dates");

        return;

    }

    filteredPods = allPods.filter((pod) => {

        return (
            pod.deliveryDate &&
            pod.deliveryDate >= fromDate &&
            pod.deliveryDate <= toDate
        );

    });

    currentPage = 1;

    renderPods();

};
window.addEventListener("load", function () {
    loadAllPods();
});
function updatePagination() {

    const pageNumbers =
    document.getElementById("pageNumbers");

    const recordInfo =
    document.getElementById("recordInfo");

    pageNumbers.innerHTML = "";

    const totalPages =
    Math.ceil(filteredPods.length / recordsPerPage);

    for(let i=1;i<=totalPages;i++){

        pageNumbers.innerHTML += `

<button
onclick="goToPage(${i})"
style="
margin:3px;
padding:8px 12px;
border:none;
border-radius:6px;
cursor:pointer;
background:${i===currentPage ? '#0d6efd' : '#eee'};
color:${i===currentPage ? 'white' : 'black'};
">

${i}

</button>

`;

    }

    const start =
    filteredPods.length===0
    ?0
    :(currentPage-1)*recordsPerPage+1;

    const end =
    Math.min(
        currentPage*recordsPerPage,
        filteredPods.length
    );

    recordInfo.innerHTML =
    `Showing ${start}-${end} of ${filteredPods.length} PODs`;

}

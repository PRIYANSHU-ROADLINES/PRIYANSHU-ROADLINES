import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs
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

// Data
let allPods = [];
let filteredPods = [];

// Pagination
let currentPage = 1;
const recordsPerPage = 10;

async function loadAllPods() {

    const snapshot = await getDocs(collection(db, "pods"));

    allPods = [];

    snapshot.forEach(doc => {
        allPods.push(doc.data());
    });

    filteredPods = [...allPods];

    currentPage = 1;

    renderPods();

}
function renderPods() {

    const container = document.getElementById("allPodsContainer");

    container.innerHTML = "";

    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;

    const pageData = filteredPods.slice(start, end);

    if (pageData.length === 0) {
        container.innerHTML = "<h3>No POD Found</h3>";
        updatePagination();
        return;
    }

    pageData.forEach(pod => {

        container.innerHTML += `

<div style="
background:white;
padding:15px;
margin:15px 0;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,.15);
">

<b>GR No:</b> ${pod.grNo}<br>

<b>Party:</b> ${pod.partyName || "-"}<br>

<b>Vehicle:</b> ${pod.vehicleNo || "-"}<br>

<b>Status:</b> ${pod.status || "-"}<br><br>

<button onclick="window.location.href='viewpod.html?gr=${pod.grNo}'">
👁 View POD
</button>

</div>

`;

    });

    updatePagination();

}
function updatePagination() {

    const pageInfo = document.getElementById("pageInfo");

    const totalPages = Math.ceil(filteredPods.length / recordsPerPage);

    pageInfo.innerHTML =
        `Page ${currentPage} of ${totalPages || 1}`;

}
window.nextPage = function () {

    const totalPages = Math.ceil(filteredPods.length / recordsPerPage);

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

};
function renderPods() {

    const container = document.getElementById("allPodsContainer");

    container.innerHTML = "";

    const start = (currentPage - 1) * recordsPerPage;
    const end = start + recordsPerPage;

    const pageData = filteredPods.slice(start, end);

    if (pageData.length === 0) {
        container.innerHTML = "<h3>No POD Found</h3>";
        updatePagination();
        return;
    }

    pageData.forEach(pod => {

        container.innerHTML += `
<div style="
background:white;
padding:15px;
margin:15px 0;
border-radius:10px;
box-shadow:0 2px 10px rgba(0,0,0,.15);
">

<b>GR No:</b> ${pod.grNo}<br>
<b>Party:</b> ${pod.partyName || "-"}<br>
<b>Vehicle:</b> ${pod.vehicleNo || "-"}<br>
<b>Status:</b> ${pod.status || "-"}<br><br>

<button onclick="window.location.href='viewpod.html?gr=${pod.grNo}'">
👁 View POD
</button>

</div>
`;
    });

    updatePagination();

}

function updatePagination() {

    const pageInfo = document.getElementById("pageInfo");

    const totalPages = Math.ceil(filteredPods.length / recordsPerPage);

    pageInfo.innerHTML =
        `Page ${currentPage} of ${totalPages || 1}`;

}

window.nextPage = function () {

    const totalPages = Math.ceil(filteredPods.length / recordsPerPage);

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

};

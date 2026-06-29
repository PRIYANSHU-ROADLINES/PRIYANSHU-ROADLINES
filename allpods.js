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

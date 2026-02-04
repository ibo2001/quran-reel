import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-NaqqCK3oH7vk471LdOugqw-JRwT-Sm8",
  authDomain: "qraiqe.firebaseapp.com",
  projectId: "qraiqe",
  storageBucket: "qraiqe.firebasestorage.app",
  messagingSenderId: "216722987429",
  appId: "1:216722987429:web:125ed9655d090db6b9704c",
  measurementId: "G-7ZX1260XVY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

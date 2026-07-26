import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBY2m3d3BUx63teTQWVPGf-3A4bvGBz7yg",
  authDomain: "sabiduria-oculta.firebaseapp.com",
  projectId: "sabiduria-oculta",
  storageBucket: "sabiduria-oculta.appspot.com", // ⚠️ corregido
  messagingSenderId: "246928239882",
  appId: "1:246928239882:web:41c50e64653b35f0c0def3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// 🔑 Persistencia con IndexedDB (más estable en WebView de Tauri)
setPersistence(auth, indexedDBLocalPersistence)
  .then(() => {
    console.log("Persistencia configurada en IndexedDB");
  })
  .catch((error) => {
    console.error("Error configurando persistencia:", error);
  });

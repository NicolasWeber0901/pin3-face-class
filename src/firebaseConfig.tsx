import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Sua configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmKCwyDJrXZE9Wd4sBotvhTx-9pWWVqHI",
  authDomain: "faceclass-15d9c.firebaseapp.com",
  projectId: "faceclass-15d9c",
  storageBucket: "faceclass-15d9c.firebasestorage.app",
  messagingSenderId: "182156492783",
  appId: "1:182156492783:web:907bce883b1053360ec01a",
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

export default db;

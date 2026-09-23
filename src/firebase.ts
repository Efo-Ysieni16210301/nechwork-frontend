// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk3RuPq_yaygpP8rPXa9QRxSQip7CIrFs",
  authDomain: "nech-work.firebaseapp.com",
  projectId: "nech-work",
  storageBucket: "nech-work.firebasestorage.app",
  messagingSenderId: "796833902728",
  appId: "1:796833902728:web:cdc77186d4a8df0cf7ef3d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

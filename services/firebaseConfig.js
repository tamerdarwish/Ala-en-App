// Import necessary functions from Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxqhp8mjwjOHmurosPiWuel3NBPNCrA10",
  authDomain: "aleen-app-35474.firebaseapp.com",
  projectId: "aleen-app-35474",
  storageBucket: "aleen-app-35474.appspot.com",
  messagingSenderId: "682511627975",
  appId: "1:682511627975:web:762f611a85f3f535f130e2",
  measurementId: "G-24WGTQP4NV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { db, storage,auth };

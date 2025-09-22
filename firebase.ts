// Import the functions you need from the SDKs you need
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANESDezo-4Er-23mJpLSmgK3wrNnwZu-Q",
  authDomain: "task-manager-57eb8.firebaseapp.com",
  projectId: "task-manager-57eb8",
  storageBucket: "task-manager-57eb8.firebasestorage.app",
  messagingSenderId: "673831569434",
  appId: "1:673831569434:web:560ef2c1d33fe2aac869a3"
}
  // measurementId: "G-MEASUREMENT_ID",

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported (not in SSR or unsupported environments)
let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const auth = getAuth(app);
export { analytics };

export const db = getFirestore(app);
export const storage = getStorage(app);

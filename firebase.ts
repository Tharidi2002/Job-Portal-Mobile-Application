import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyANESDezo-4Er-23mJpLSmgK3wrNnwZu-Q",
  authDomain: "task-manager-57eb8.firebaseapp.com",
  projectId: "task-manager-57eb8",
  storageBucket: "task-manager-57eb8.firebasestorage.app",
  messagingSenderId: "673831569434",
  appId: "1:673831569434:web:560ef2c1d33fe2aac869a3"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
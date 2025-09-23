import { db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  companyName?: string;
  logo?: string;
  companyWebsite?: string;
  companyIndustry?: string;
  companyDescription?: string;
  contactPhone?: string;
}

const userCollection = collection(db, "users");

export const createOrUpdateUserProfile = async (
  uid: string,
  email: string,
  profileData: Partial<UserProfile>
) => {
  const userDoc = doc(db, "users", uid);
  const docSnap = await getDoc(userDoc);
  if (docSnap.exists()) {
    await updateDoc(userDoc, profileData);
  } else {
    await setDoc(userDoc, { uid, email, ...profileData });
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = doc(db, "users", uid);
  const docSnap = await getDoc(userDoc);
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
};

export const getAllCompanies = async (): Promise<UserProfile[]> => {
  const snapshot = await getDocs(userCollection);
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map((doc) => doc.data() as UserProfile);
};

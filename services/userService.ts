import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  setDoc,
} from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  companyName?: string;
  logo?: string;
  location?: string;
  ceoName?: string;
  gallery?: string[];
  description?: string;
  phone?: string;
  createdAt: string;
}

export const userColRef = collection(db, "users");

export const uploadImageToCloudinary = async (imageUri: string) => {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "profile.jpg",
  } as any);
  data.append("upload_preset", "my_preset"); // Replace with your preset

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dfwzzxgja/image/upload",
    {
      method: "POST",
      body: data,
    }
  );
  const result = await res.json();
  if (!result.secure_url) {
    console.error("Cloudinary upload failed:", result);
    return "";
  }
  return result.secure_url;
};

export const createUserProfile = async (userProfile: UserProfile) => {
  let logoUrl = userProfile.logo;
  if (logoUrl && logoUrl.startsWith("file://")) {
    logoUrl = await uploadImageToCloudinary(logoUrl);
  }
  // Handle gallery upload if present
  let galleryUrls = userProfile.gallery || [];
  galleryUrls = await Promise.all(
    (galleryUrls || []).map(async (img) =>
      img.startsWith("file://") ? await uploadImageToCloudinary(img) : img
    )
  );
  const userDocRef = doc(db, "users", userProfile.uid);
  await setDoc(userDocRef, { ...userProfile, logo: logoUrl, gallery: galleryUrls });
  return userProfile.uid;
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userDocRef = doc(db, "users", uid);
  const userSnap = await getDoc(userDocRef);
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
) => {
  let logoUrl = updates.logo;
  if (logoUrl && logoUrl.startsWith("file://")) {
    logoUrl = await uploadImageToCloudinary(logoUrl);
    updates.logo = logoUrl;
  }
  // Handle gallery upload if present
  if (updates.gallery) {
    updates.gallery = await Promise.all(
      updates.gallery.map(async (img) =>
        img.startsWith("file://") ? await uploadImageToCloudinary(img) : img
      )
    );
  }

  const userDocRef = doc(db, "users", uid);

  // Check if document exists first
  const userSnap = await getDoc(userDocRef);

  if (userSnap.exists()) {
    // Document exists, update it
    await updateDoc(userDocRef, updates);
  } else {
    // Document doesn't exist, create it with basic info + updates
    const newProfile: UserProfile = {
      uid,
      email: updates.email || "",
      companyName: updates.companyName || "",
      logo: logoUrl || "",
      location: updates.location || "",
      ceoName: updates.ceoName || "",
      gallery: updates.gallery || [],
      description: updates.description || "",
      phone: updates.phone || "",
      createdAt: new Date().toISOString(),
      ...updates,
    };
    await setDoc(userDocRef, newProfile);
  }
};

export const createOrUpdateUserProfile = async (
  uid: string,
  email: string,
  updates: Partial<UserProfile>
) => {
  let logoUrl = updates.logo;
  if (logoUrl && logoUrl.startsWith("file://")) {
    logoUrl = await uploadImageToCloudinary(logoUrl);
    updates.logo = logoUrl;
  }
  // Handle gallery upload if present
  if (updates.gallery) {
    updates.gallery = await Promise.all(
      updates.gallery.map(async (img) =>
        img.startsWith("file://") ? await uploadImageToCloudinary(img) : img
      )
    );
  }

  const userDocRef = doc(db, "users", uid);

  // Always use setDoc with merge to create or update
  const profileData: UserProfile = {
    uid,
    email,
    companyName: updates.companyName || "",
    logo: logoUrl || "",
    location: updates.location || "",
    ceoName: updates.ceoName || "",
    gallery: updates.gallery || [],
    description: updates.description || "",
    phone: updates.phone || "",
    createdAt: new Date().toISOString(),
    ...updates,
  };
  await setDoc(userDocRef, profileData, { merge: true });
};

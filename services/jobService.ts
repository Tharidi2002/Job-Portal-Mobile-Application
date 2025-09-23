// Job Portal: Job service logic extracted from mealService.ts
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

export type Job = {
  id?: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  logo?: string;
  image?: string;
  createdAt?: any;
  updatedAt?: any;
};

export const jobColRef = collection(db, "jobs");

export const createJob = async (job: Omit<Job, "id">) => {
  const docRef = await addDoc(jobColRef, {
    ...job,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
};

export const getJobs = async () => {
  const snapshot = await getDocs(jobColRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Job) }));
};

export const getJobById = async (id: string) => {
  const docRef = doc(db, "jobs", id);
  const jobSnap = await getDoc(docRef);
  if (jobSnap.exists()) {
    return { id: jobSnap.id, ...jobSnap.data() };
  }
  return null;
};

export const updateJob = async (id: string, job: Partial<Job>) => {
  const docRef = doc(db, "jobs", id);
  await updateDoc(docRef, { ...job, updatedAt: new Date() });
};

export const deleteJob = async (id: string) => {
  const docRef = doc(db, "jobs", id);
  await deleteDoc(docRef);
};

export const uploadImageToCloudinary = async (imageUri: string) => {
  try {
    if (!imageUri || typeof imageUri !== "string") {
      console.error("Invalid image URI:", imageUri);
      return null;
    }
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    } as any);
    data.append("upload_preset", "my_preset");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfwzzxgja/image/upload",
        {
          method: "POST",
          body: data,
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Cloudinary upload failed:", errorText);
        return null;
      }
      const result = await res.json();
      return result.secure_url;
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Cloudinary upload error:", err);
      return null;
    }
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};

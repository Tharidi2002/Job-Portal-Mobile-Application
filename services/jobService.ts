import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc, 
  query,
  where,
} from "firebase/firestore";
import { getUserProfile, UserProfile } from "./userService";

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  salary?: number;
}

const jobCollection = collection(db, "jobs");

export const createJob = async (job: Omit<Job, 'id'>) => {
  const docRef = await addDoc(jobCollection, job);
  return docRef.id;
};

export const getJobs = async (companyId?: string): Promise<Job[]> => {
  let q = query(jobCollection);
  if (companyId) {
    q = query(jobCollection, where("companyId", "==", companyId));
  }
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return [];
  }

  const jobs = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const job = { ...doc.data(), id: doc.id } as Job;
      if (job.companyId) {
        const companyProfile = await getUserProfile(job.companyId);
        if (companyProfile) {
          job.companyName = companyProfile.companyName;
          job.companyLogo = companyProfile.logo;
        }
      }
      return job;
    })
  );

  return jobs;
};

export const getJobById = async (jobId: string): Promise<Job | null> => {
  const jobDoc = doc(db, "jobs", jobId);
  const docSnap = await getDoc(jobDoc);
  if (docSnap.exists()) {
    const job = { ...docSnap.data(), id: docSnap.id } as Job;
    if (job.companyId) {
      const companyProfile = await getUserProfile(job.companyId);
      if (companyProfile) {
        job.companyName = companyProfile.companyName;
        job.companyLogo = companyProfile.logo;
      }
    }
    return job;
  }
  return null;
};

export const updateJob = async (jobId: string, updates: Partial<Job>) => {
  const jobDoc = doc(db, "jobs", jobId);
  await updateDoc(jobDoc, updates);
};

export const deleteJob = async (jobId: string) => {
  const jobDoc = doc(db, "jobs", jobId);
  await deleteDoc(jobDoc);
};

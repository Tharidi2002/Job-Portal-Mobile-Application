// // Script to delete all documents in 'companies' and 'jobs' collections from Firebase Firestore
// // Usage: node scripts/clearFirestoreData.js

// const { initializeApp, applicationDefault } = require('firebase-admin/app');
// const { getFirestore } = require('firebase-admin/firestore');

// initializeApp({
//   credential: applicationDefault(),
// });

// const db = getFirestore();

// async function deleteCollection(collectionName) {
//   const snapshot = await db.collection(collectionName).get();
//   const batch = db.batch();
//   snapshot.forEach(doc => {
//     batch.delete(doc.ref);
//   });
//   await batch.commit();
//   console.log(`Deleted all documents from '${collectionName}' collection.`);
// }

// async function main() {
//   await deleteCollection('companies');
//   await deleteCollection('jobs');
//   console.log('All company profiles and job postings have been deleted.');
//   process.exit(0);
// }

// main().catch(err => {
//   console.error('Error clearing Firestore data:', err);
//   process.exit(1);
// });

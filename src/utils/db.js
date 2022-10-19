// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
import { Buffer } from 'buffer';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = JSON.parse(
  Buffer.from(
    'ewogICJhcGlLZXkiOiAiQUl6YVN5QjhkWTRLYzFoYUR2bWhzTngzcERKdFhHcnp3M2lWbWZRIiwKICAiYXV0aERvbWFpbiI6ICJteS1taW50aW5nLWFwcC5maXJlYmFzZWFwcC5jb20iLAogICJwcm9qZWN0SWQiOiAibXktbWludGluZy1hcHAiLAogICJzdG9yYWdlQnVja2V0IjogIm15LW1pbnRpbmctYXBwLmFwcHNwb3QuY29tIiwKICAibWVzc2FnaW5nU2VuZGVySWQiOiAiMTA5NzY2ODI2ODY2MyIsCiAgImFwcElkIjogIjE6MTA5NzY2ODI2ODY2Mzp3ZWI6MThhNmMwYWRiODQwNmVjMzYyNmM3MiIKfQ',
    'base64'
  ).toString()
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app, 'gs://my-minting-app.appspot.com');

export { db, storage };

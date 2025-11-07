const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAmwJfXd-3jKEKC5IZPqkwyiChJsnp9jOs",
  authDomain: "automated-college-system.firebaseapp.com",
  projectId: "automated-college-system",
  storageBucket: "automated-college-system.appspot.com",
  messagingSenderId: "1041511667290",
  appId: "1:1041511667290:web:114e101b2430762680aa63",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };

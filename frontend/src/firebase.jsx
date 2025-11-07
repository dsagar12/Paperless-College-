import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification as sendEmailVerificationFirebase
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection, 
  addDoc,
  updateDoc,
  getDocs,
  query,
  where, 
  serverTimestamp,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAzURPUqB_0-BJvXS8eRi464tYXLZ9XWj8",
//   authDomain: "automated-college-system-58188.firebaseapp.com",
//   projectId: "automated-college-system-58188",
//   storageBucket: "automated-college-system-58188.appspot.com",
//   messagingSenderId: "739925625292",
//   appId: "1:739925625292:web:20de0308876f0a4e737569",
//   measurementId: "G-K0V1J10QQC",
// };


const firebaseConfig = {
  apiKey: "AIzaSyAmwJfXd-3jKEKC5IZPqkwyiChJsnp9jOs",
  authDomain: "automated-college-system.firebaseapp.com",
  projectId: "automated-college-system",
  storageBucket: "automated-college-system.appspot.com",
  messagingSenderId: "1041511667290",
  appId: "1:1041511667290:web:114e101b2430762680aa63",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 
const provider = new GoogleAuthProvider();

//Email validation patterns for different roles
const EMAIL_PATTERNS = {
  student: /^(20\d{2})(bcs|bce|bec|mech)(\d{3})@sggs\.ac\.in$/i,
  mtech: /^(20\d{2})(mcs|mme|mec)(\d{3})@sggs\.ac\.in$/i,
  faculty: /^[a-z]+\.[a-z]+@sggs\.ac\.in$/i,
  admin: /^admin\.[a-z]+@sggs\.ac\.in$/i,
  doctor: /^dr\.[a-z]+@sggs\.ac\.in$/i
};

// Allowed roles and their metadata
const ROLES_CONFIG = {
  student: { branches: ['bcs', 'bce', 'bec', 'mech'] },
  mtech: { branches: ['mcs', 'mme', 'mec'] },
  faculty: { departments: ['CSE', 'ME', 'ECE'] },
  admin: { accessLevel: 3 },
  doctor: { medicalLicense: true }
};



const submitCandidate = async () => {
  if (!auth.currentUser) {
    console.error("User is not logged in!");
    return;
  }

  try {
    await addDoc(collection(db, "electionsCandidates"), {
      name: "Candidate Name",
      position: "President",
      votes: 0,
      createdBy: auth.currentUser.uid, // Store user ID
      createdAt: new Date(),
    });
    console.log("Candidate added successfully!");
  } catch (error) {
    console.error("Error adding candidate:", error);
  }
};

const fetchComplaintCount = async (status) => {
  try {
    const complaintsRef = collection(db, "complaints");
    const q = query(complaintsRef, where("status", "==", status));
    const snapshot = await getDocs(q);
    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error("Error fetching complaint count:", error.message);
    return { success: false, count: 0, message: error.message };
  }
};

const fetchApprovedComplaints = async () => {
  try {
    const approvedQuery = query(collection(db, "complaints"), where("status", "==", "approved"));
    const querySnapshot = await getDocs(approvedQuery);
    
    const approvedComplaints = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Approved Complaints Fetched:", approvedComplaints);
    return approvedComplaints;
  } catch (error) {
    console.error("Error fetching approved complaints:", error.message);
    return [];
  }
};

const submitComplaint = async (complaintText, userId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User is not logged in. Please log in before submitting a complaint.");
    }

    userId = userId || currentUser.uid;

    console.log("Submitting complaint:", complaintText, userId);

    const newComplaintRef = await addDoc(collection(db, "complaints"), {
      complaintText,
      userId,
      timestamp: serverTimestamp(),
      status: "pending",
    });

    console.log("Complaint submitted! Document ID:", newComplaintRef.id);
    return { success: true, complaintId: newComplaintRef.id };
  } catch (error) {
    console.error("Error submitting complaint:", error.message);
    return { success: false, message: error.message };
  }
};

const fetchComplaints = async (status) => {
  try {
    const complaintsRef = collection(db, "complaints");
    let q;
    if (status) {
      q = query(complaintsRef, where("status", "==", status));
    } else {
      q = complaintsRef;
    }
    const complaintsSnapshot = await getDocs(q);
    const complaints = complaintsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(`Complaints Fetched for status "${status}":`, complaints);
    return { success: true, complaints };
  } catch (error) {
    console.error("Error fetching complaints:", error.message);
    return { success: false, message: error.message };
  }
};

const approveComplaint = async (complaintId) => {
  try {
    const complaintRef = doc(db, "complaints", complaintId);
    await updateDoc(complaintRef, { status: "approved" });

    console.log(`Complaint ${complaintId} approved.`);
    return { success: true, message: "Complaint approved." };
  } catch (error) {
    console.error("Error approving complaint:", error.message);
    return { success: false, message: error.message };
  }
};

const rejectComplaint = async (complaintId) => {
  try {
    const complaintRef = doc(db, "complaints", complaintId);
    await updateDoc(complaintRef, { status: "rejected" });

    console.log(`Complaint ${complaintId} rejected.`);
    return { success: true, message: "Complaint rejected." };
  } catch (error) {
    console.error("Error rejecting complaint:", error.message);
    return { success: false, message: error.message };
  }
};

const validateEmailForRole = (email, role) => {
  const pattern = EMAIL_PATTERNS[role];
  if (!pattern) throw new Error('Invalid role specified');
  return pattern.test(email);
};

export const sendEmailVerification = async (user) => {
  await sendEmailVerificationFirebase(user);
};

export const getAuthUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

const signUpUser = async (fullName, email, password, role) => {
  try {
    if (!ROLES_CONFIG[role]) {
      throw new Error('Invalid user role');
    }

    if (!validateEmailForRole(email, role)) {
      throw new Error(`Invalid email format for ${role}. Example: ${getEmailExample(role)}`);
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userData = { fullName, email, role };
    const emailMatch = email.match(EMAIL_PATTERNS[role]);
    
    if (['student', 'mtech'].includes(role)) {
      userData.year = emailMatch[1];
      userData.branch = emailMatch[2].toUpperCase();
      userData.rollNumber = emailMatch[3];
    }

    await setDoc(doc(db, "users", user.uid), userData);

    await sendEmailVerification(user);

    return user;
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

const getEmailExample = (role) => {
  const examples = {
    student: '2024bcs001@sggs.ac.in',
    mtech: '2024mcs001@sggs.ac.in',
    faculty: 'john.doe@sggs.ac.in',
    admin: 'admin.jane@sggs.ac.in',
    doctor: 'dr.smith@sggs.ac.in'
  };
  return examples[role];
};
 const getCandidateImageURL = async (candidateId) => {
  try {
    const filePath = `candidates/${candidateId}`;
    const fileRef = ref(storage, filePath);
    return await getDownloadURL(fileRef);
  } catch (error) {
    console.error("Error fetching file:", error);
    return null;
  }
};

export { auth,app, db,provider,signInWithPopup, collection, signUpUser, loginUser, submitComplaint,
  fetchComplaints, approveComplaint, rejectComplaint, logout, storage,
  addDoc, doc, updateDoc, getDocs, setDoc, ref, uploadBytes,
  getDownloadURL, fetchApprovedComplaints, fetchComplaintCount, submitCandidate,
  query, where, serverTimestamp,getCandidateImageURL };

  
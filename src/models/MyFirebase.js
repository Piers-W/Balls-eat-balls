import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy, limit, deleteDoc } from "firebase/firestore";

function FirebaseService() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDFqqvqqklh5cIS3b5qTiFK8TU7Wlh6sHA",
    authDomain: "balls-eat-balls-6c000.firebaseapp.com",
    projectId: "balls-eat-balls-6c000",
    storageBucket: "balls-eat-balls-6c000.appspot.com",
    messagingSenderId: "275030785108",
    appId: "1:275030785108:web:f9a0f1b933391092b601c1"
  };

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const service = {};

  // Get PvE scores
  service.getPvEScore = async (difficulty) => {
    const docRef = doc(db, "Scores", difficulty);
    const docSnap = await getDoc(docRef);
    console.log("get difficulty:", difficulty);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return initial scores if document not found
      return { monsterScore: 0, playerScore: 0 };
    }
  };

  // Update PvE scores
  service.updatePvEScore = async (difficulty, scores) => {
    const docRef = doc(db, "Scores", difficulty);
    await updateDoc(docRef, scores).catch(err => console.error("Error updating scores:", err));
  };

  // Record PvP scores
  service.recordPvPScore = async (roomNumber, player1Name, player2Name, player1Score, player2Score) => {
    const documentId = roomNumber.toString(); 
    const docRef = doc(db, "pvpScores", documentId);
  
    // Update or create document with setDoc, excluding roomNumber as a field
    await setDoc(docRef, {
      player1Name,
      player2Name,
      player1Score,
      player2Score,
      timestamp: Date.now() // Add timestamp
    });
  };

  // Get PvP scoreboard
  service.getPvPScoreboard = async () => {
    const q = query(collection(db, "pvpScores"), orderBy("timestamp", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  };

  // Delete PvP scoreboard
  service.deletePvPScoreboard = async () => {
    const querySnapshot = await getDocs(collection(db, "pvpScores"));
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  };

  return service;
}

export const myFirebase = new FirebaseService();





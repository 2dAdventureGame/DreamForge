import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const handler = async function (event) {
  try {
    const date = event.queryStringParameters.date;
    if (!date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Date parameter is required" }),
      };
    }

    const lessonsRef = collection(db, `grade1/term1/weeks`);
    const weeksSnapshot = await getDocs(lessonsRef);
    const lessons = [];

    for (const weekDoc of weeksSnapshot.docs) {
      const daysRef = collection(db, `grade1/term1/weeks/${weekDoc.id}/days`);
      const daysQuery = query(daysRef, where("date", "==", date));
      const daysSnapshot = await getDocs(daysQuery);

      for (const dayDoc of daysSnapshot.docs) {
        const lessonsRef = collection(
          db,
          `grade1/term1/weeks/${weekDoc.id}/days/${dayDoc.id}/lessons`
        );
        const lessonsSnapshot = await getDocs(lessonsRef);
        lessonsSnapshot.forEach((lessonDoc) => {
          lessons.push({ id: lessonDoc.id, ...lessonDoc.data() });
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(lessons),
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

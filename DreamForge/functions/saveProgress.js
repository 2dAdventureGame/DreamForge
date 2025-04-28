import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
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
    const body = JSON.parse(event.body);
    const { studentId, lessonId, coinsEarned, score } = body;

    if (!studentId || !lessonId || coinsEarned === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "studentId, lessonId, and coinsEarned are required",
        }),
      };
    }

    const studentRef = doc(db, `students/${studentId}`);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Student not found" }),
      };
    }

    const studentData = studentDoc.data();
    const updatedCompletedLessons = [
      ...(studentData.completed_lessons || []),
      { lessonId, score, date: new Date().toISOString() },
    ];
    const updatedCoins = (studentData.coins || 0) + coinsEarned;

    await updateDoc(studentRef, {
      completed_lessons: updatedCompletedLessons,
      coins: updatedCoins,
      last_updated: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Progress saved", coins: updatedCoins }),
    };
  } catch (error) {
    console.error("Error saving progress:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

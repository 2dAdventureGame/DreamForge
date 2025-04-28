import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import grade1Term1 from "../artifacts/grade1_term1.json";
import studentProgress from "../artifacts/student_progress.json";

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

export const handler = async function (event, context) {
  try {
    for (const week of grade1Term1.weeks) {
      for (const day of week.days) {
        for (const lesson of day.lessons) {
          const lessonPath = `grade1/term1/weeks/week_${week.week}/days/${day.date}/lessons`;
          await setDoc(doc(db, lessonPath, lesson.lesson_id), lesson);
        }
      }
    }
    await setDoc(doc(db, "students/lila_001"), studentProgress);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Firebase initialized successfully!" }),
    };
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

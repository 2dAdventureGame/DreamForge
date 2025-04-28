import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import grade1Term1 from "../../artifacts/grade1_term1.json";
import studentProgress from "../../artifacts/student_progress.json";

async function initFirebase() {
  try {
    for (const week of grade1Term1.weeks) {
      for (const day of week.days) {
        for (const lesson of day.lessons) {
          const lessonPath = `grade1/term1/weeks/week_${week.week}/days/${day.date}/lessons`;
          await setDoc(doc(db, lessonPath, lesson.lesson_id), lesson);
          console.log(`Uploaded lesson: ${lesson.lesson_id}`);
        }
      }
    }
    await setDoc(doc(db, "students/lila_001"), studentProgress);
    console.log("Student progress uploaded for lila_001");
    console.log("Firebase initialized successfully!");
  } catch (error) {
    console.error("Firebase initialization failed:", error.message);
    throw error;
  }
}

initFirebase();

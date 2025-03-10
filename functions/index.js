import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions/v1";

initializeApp();
const db = getFirestore();

export const addDefaultCategories = functions.auth
  .user()
  .onCreate(async (user) => {
    const defaultCategories = [
      { name: "errand", color: "lime" },
      { name: "personal", color: "green" },
      { name: "work", color: "teal" },
    ];

    const userRef = db.collection("users").doc(user.uid);

    // Add user email to the Firestore document
    await userRef.set({
      email: user.email,
      createdAt: new Date(),
    });

    // Add default categories to the 'categories' subcollection for the new user
    const batch = db.batch();
    defaultCategories.forEach((category) => {
      const categoryRef = userRef.collection("categories").doc(category.name);
      batch.set(categoryRef, category);
    });

    // Commit the batch write
    await batch.commit();

    console.log(`Default categories added for user: ${user.uid}`);
  });

export const handleRepeatingTasks = functions.firestore
  .document("tasks/{taskId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    // Only proceed if the task was just marked as completed
    if (
      before.status != "completed" &&
      after.status == "completed" &&
      after.repeatNumber
    ) {
      const newDueDate = getNextDueDate(after.repeatNumber, after.repeatUnit);

      // Create a new task with the updated due date
      await db.collection("tasks").add({
        ...after,
        dueDate: newDueDate,
        status: "to-do",
        completedTimestamp: null,
        startedTimestamp: null,
        taskId: null, // Do not include the taskId in the new task to avoid reusing the same ID
      });

      console.log("New repeating task created for:", newDueDate);
    }
  });

function getNextDueDate(number, unit) {
  let date = new Date();

  switch (unit) {
    case "day":
      date.setDate(date.getDate() + number);
      break;
    case "week":
      date.setDate(date.getDate() + 7 * number);
      break;
    case "month":
      date.setMonth(date.getMonth() + number);
      break;
    default:
      return date;
  }

  return date.toISOString().split("T")[0];
}

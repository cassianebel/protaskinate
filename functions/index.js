import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions/v1";
import { DateTime } from "luxon";
import { Timestamp } from "firebase-admin/firestore";

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
      const newDueDate = getNextDueDate(
        after.completedTimestamp.toDate(),
        after.repeatNumber,
        after.repeatUnit,
        after.timeZone
      );

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

export const handleNewTasks = functions.firestore
  .document("tasks/{taskId}")
  .onCreate(async (snap) => {
    try {
      const taskData = snap.data();

      // Only proceed if the task is completed and set to repeat
      if (taskData.status === "completed" && taskData.repeatNumber) {
        // Ensure completedTimestamp is a valid Firestore Timestamp before conversion
        const completedTimestamp =
          taskData.completedTimestamp instanceof Timestamp
            ? taskData.completedTimestamp.toDate()
            : new Date(taskData.completedTimestamp);

        const newDueDate = getNextDueDate(
          completedTimestamp,
          taskData.repeatNumber,
          taskData.repeatUnit,
          taskData.timeZone
        );

        // Create a new task with updated values
        await db.collection("tasks").add({
          ...taskData,
          dueDate: newDueDate,
          status: "to-do",
          completedTimestamp: null,
          startedTimestamp: null,
        });

        console.log("New repeating task created for:", newDueDate);
      }
    } catch (error) {
      console.error("Error handling new repeating task:", error);
    }
  });

function getNextDueDate(completedTimestamp, number, unit, userTimeZone) {
  // Convert Firestore Timestamp to JavaScript Date
  const utcDate =
    completedTimestamp instanceof Timestamp
      ? completedTimestamp.toDate()
      : new Date(completedTimestamp);

  console.log("Completed Timestamp (UTC):", utcDate.toISOString());

  // Convert UTC date to local time in the user's timezone
  const localDate = DateTime.fromJSDate(utcDate, { zone: userTimeZone });

  console.log("Adjusted Local Date:", localDate.toISO());

  let newDueDate;
  switch (unit) {
    case "day":
      newDueDate = localDate.plus({ days: number });
      break;
    case "week":
      newDueDate = localDate.plus({ weeks: number });
      break;
    case "month":
      newDueDate = localDate.plus({ months: number });
      break;
    default:
      return localDate.toISODate();
  }

  console.log("Final Due Date Before Formatting:", newDueDate.toISO());

  return newDueDate.toISODate(); // Returns in YYYY-MM-DD format
}

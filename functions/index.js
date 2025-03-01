import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions/v1";

initializeApp();
const db = getFirestore();

export const addDefaultCategories = functions.auth
  .user()
  .onCreate(async (user) => {
    const defaultCategories = [
      { name: "Personal", color: "red" },
      { name: "Work", color: "blue" },
      { name: "Errand", color: "orange" },
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

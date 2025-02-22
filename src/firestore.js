import {
  doc,
  setDoc,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export const createUserInDatabase = async (user) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(
      userDocRef,
      {
        email: user.email,
      },
      { merge: true }
    );

    console.log("User data saved to Firestore");
  } catch (error) {
    console.error("Error creating/updating user in Firestore:", error.message);
  }
};

// Example of how to query tasks with a specific label

// const workLabelRef = doc(db, "labels", "work"); // Get a reference to the "work" label doc.

// const q = query(
//   collection(db, "tasks"),
//   where("labels", "array-contains", workLabelRef)
// );

// const querySnapshot = await getDocs(q);
// querySnapshot.forEach((doc) => {
//   // Access task data here.
//   console.log(doc.id, "=>", doc.data());
// });

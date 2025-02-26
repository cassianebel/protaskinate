import {
  doc,
  setDoc,
  addDoc,
  query,
  collection,
  getDocs,
  where,
  updateDoc,
  getDoc,
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

export const fetchUserFromDatabase = async (user) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user from Firestore:", error.message);
  }
};

export const updateUserInDatabase = async (user, updatedData) => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, updatedData, { merge: true });
    console.log("User data updated in Firestore");
  } catch (error) {
    console.error("Error updating user in Firestore:", error.message);
  }
};

export const createTask = async (taskData) => {
  try {
    const tasksCollectionRef = collection(db, "tasks");
    const docRef = await addDoc(tasksCollectionRef, taskData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

export const fetchUsersTasks = async (user) => {
  try {
    const tasksCollectionRef = collection(db, "tasks");
    const tasksQuery = query(tasksCollectionRef, where("userId", "==", user));
    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
  }
};

export const fetchTask = async (taskId) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const querySnapshot = await getDoc(taskRef);
    return querySnapshot;
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updatedData);
  } catch (error) {
    console.error("Error updating task:", error);
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

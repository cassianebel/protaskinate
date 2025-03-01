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
  deleteDoc,
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

export const deleteTask = async (taskId) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const fetchCategories = async (userId) => {
  const categoriesRef = collection(db, `users/${userId}/categories`);
  const querySnapshot = await getDocs(categoriesRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addCategory = async (userId, categoryName, color) => {
  const sanitizedCategoryName = categoryName.replace(/[\/\.\#\[\]\s]/g, "");

  try {
    const categoryRef = doc(
      db,
      "users",
      userId,
      "categories",
      sanitizedCategoryName
    );

    const docSnapshot = await getDoc(categoryRef);
    if (docSnapshot.exists()) {
      console.log("Category already exists!");
      return sanitizedCategoryName; // Return the existing ID
    }

    await setDoc(categoryRef, {
      id: sanitizedCategoryName, // Store ID in Firestore
      name: sanitizedCategoryName,
      color,
    });

    return sanitizedCategoryName; // ✅ Return the ID
  } catch (error) {
    console.error("Error adding category:", error);
    throw error; // Re-throw error to be caught in `addNewCategory`
  }
};

export const deleteCategory = async (userId, categoryName) => {
  try {
    const categoryRef = doc(db, "users", userId, "categories", categoryName);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

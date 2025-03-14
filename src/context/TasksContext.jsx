import { createContext, useState, useEffect, useContext } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import PropTypes from "prop-types";

const TasksContext = createContext();

export function TasksProvider({ user, children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", user.uid));

    // Set up Firestore listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(tasks);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  return (
    <TasksContext.Provider value={{ tasks }}>{children}</TasksContext.Provider>
  );
}

TasksProvider.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export const useTasks = () => useContext(TasksContext);

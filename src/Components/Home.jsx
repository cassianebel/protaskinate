import { useState, useEffect } from "react";
import Link from "./Link";
import { fetchUsersTasks } from "../firestore";
import TaskCard from "./TaskCard";

const Home = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        try {
          const tasks = await fetchUsersTasks(user.uid);
          setTasks(tasks);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  useEffect(() => {
    if (tasks.length > 0) {
      let completed = tasks.filter((task) => task.status === "completed");
      let toDo = tasks.filter((task) => task.status === "to-do");
      let inProgress = tasks.filter((task) => task.status === "in-progress");
      // Sort tasks by priority
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      toDo.sort((a, b) => {
        // First, sort by priority
        const priorityDiff =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        // If priorities are the same, sort by dueDate (earliest first)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }

        // Tasks with a dueDate should come before those without
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return 0;
      });
      inProgress.sort((a, b) => {
        // First, sort by priority
        const progressPriorityDiff =
          priorityOrder[a.priority] - priorityOrder[b.priority];
        if (progressPriorityDiff !== 0) return progressPriorityDiff;

        // If priorities are the same, sort by dueDate (earliest first)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }

        // Tasks with a dueDate should come before those without
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return 0;
      });

      setCompletedTasks(completed);
      setToDoTasks(toDo);
      setInProgressTasks(inProgress);
    }
  }, [tasks]);

  return (
    <div className="w-full">
      {!user ? (
        <div className="flex flex-col items-center justify-center">
          <Link text="New here? Sign up!" link="/signup" style="primary" />
          <Link
            text="Already protaskanating? Sign in!"
            link="/signin"
            style="secondary"
          />
        </div>
      ) : (
        <div className="w-full p-6 lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="">
            <h2 className="text-2xl text-center m-4">Current Task</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-700 dark:text-red-400">
                {error}
              </p>
            ) : inProgressTasks.length > 0 ? (
              inProgressTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${task.priority} ps-4 my-6 rounded-md shadow-md`}
                >
                  <TaskCard task={task} />
                </div>
              ))
            ) : (
              <p className="text-center">Let's get to work on something!</p>
            )}
          </div>

          <div className="lg:order-first">
            <h2 className="text-2xl text-center m-4">To-Dos</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-700 dark:text-red-400">
                {error}
              </p>
            ) : toDoTasks.length > 0 ? (
              toDoTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${task.priority} ps-4 my-6 rounded-md shadow-md`}
                >
                  <TaskCard task={task} />
                </div>
              ))
            ) : (
              <p className="text-center">Let's get to work on something!</p>
            )}
          </div>
          <div>
            <h2 className="text-2xl text-center m-4">Completed Tasks</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-700 dark:text-red-400">
                {error}
              </p>
            ) : completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`${task.priority} ps-4 my-6 rounded-md shadow-md opacity-50`}
                >
                  <TaskCard task={task} />
                </div>
              ))
            ) : (
              <p className="text-center">Let's get to work on something!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

import { useState, useEffect } from "react";
import Link from "./Link";
import { fetchUsersTasks } from "../firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import Column from "./Column";
import TaskCard from "./TaskCard";

const Home = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

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

  const handleDragStart = (event) => {
    setActiveTask(event.active.data.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    if (activeTask.status !== newStatus) {
      // Update Firestore
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: newStatus,
        lastModifiedTimestamp: new Date(),
      });

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }

    setActiveTask(null);
  };

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
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Column
              key="in-progredd"
              id="in-progress"
              title="Current Task"
              tasks={inProgressTasks}
              text="What are you working on?"
            />
            <div className="lg:order-first">
              <Column
                key="to-do"
                id="to-do"
                title="To-Dos"
                tasks={toDoTasks}
                text="Let's get protaskinating!"
              />
            </div>
            <Column
              key="completed"
              id="completed"
              title="Completed Tasks"
              tasks={completedTasks}
              text="Are you protaskinating?"
            />
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default Home;

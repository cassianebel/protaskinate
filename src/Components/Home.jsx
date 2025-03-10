import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  parseISO,
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isPast,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { useCategories } from "../context/CategoriesContext";
import Column from "./Column";
import TaskCard from "./TaskCard";
import Link from "./Link";
import PropTypes from "prop-types";

const Home = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { categories } = useCategories();

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

  useEffect(() => {
    if (tasks.length > 0) {
      let toDo = tasks.filter((task) => task.status === "to-do");
      // Sort tasks by priority and due date
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

      let inProgress = tasks.filter((task) => task.status === "in-progress");
      // Sort tasks by priority and due date
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

      let completed = tasks.filter((task) => task.status === "completed");
      // Sort by completedTimestamp or lastModifiedTimestamp if none (latest first)
      completed.sort((a, b) => {
        return b.completedTimestamp - a.completedTimestamp;
      });

      setToDoTasks(toDo);
      setInProgressTasks(inProgress);
      setCompletedTasks(completed);
    }
  }, [tasks]);

  useEffect(() => {
    const dateFilters = {
      isToday,
      isTomorrow,
      isThisWeek,
      isThisMonth,
      isPast,
      isNextWeek: (date) =>
        isWithinInterval(date, {
          start: startOfWeek(addWeeks(new Date(), 1)),
          end: endOfWeek(addWeeks(new Date(), 1)),
        }),
      isNextMonth: (date) =>
        isWithinInterval(date, {
          start: startOfMonth(addMonths(new Date(), 1)),
          end: endOfMonth(addMonths(new Date(), 1)),
        }),
    };
    let toDo = tasks.filter((task) => {
      let parsedDate = null;
      if (task.dueDate) {
        parsedDate = parseISO(task.dueDate);
      }
      const matchesCategory =
        categoryFilter === "all" || task.categories?.includes(categoryFilter);
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDate =
        dateFilter === "all" || dateFilters[dateFilter]?.(parsedDate);
      return (
        task.status === "to-do" &&
        matchesCategory &&
        matchesPriority &&
        matchesDate
      );
    });
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
    let inProgress = tasks.filter((task) => {
      let parsedDate = null;
      if (task.dueDate) {
        parsedDate = parseISO(task.dueDate);
      }
      const matchesCategory =
        categoryFilter === "all" || task.categories?.includes(categoryFilter);
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDate =
        dateFilter === "all" || dateFilters[dateFilter]?.(parsedDate);
      return (
        task.status === "in-progress" &&
        matchesCategory &&
        matchesPriority &&
        matchesDate
      );
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
    let completed = tasks.filter((task) => {
      let parsedDate = null;
      if (task.dueDate) {
        parsedDate = parseISO(task.dueDate);
      }
      const matchesCategory =
        categoryFilter === "all" || task.categories?.includes(categoryFilter);
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDate =
        dateFilter === "all" || dateFilters[dateFilter]?.(parsedDate);
      return (
        task.status === "completed" &&
        matchesCategory &&
        matchesPriority &&
        matchesDate
      );
    });
    completed.sort((a, b) => {
      return b.completedTimestamp - a.completedTimestamp;
    });

    setToDoTasks(toDo);
    setInProgressTasks(inProgress);
    setCompletedTasks(completed);
  }, [priorityFilter, dateFilter, categoryFilter, tasks]);

  const handleDragStart = (event) => {
    setActiveTask(event.active.data.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;
    const now = new Date();

    if (activeTask.status !== newStatus) {
      const taskRef = doc(db, "tasks", taskId);
      let updatedFields = { status: newStatus, lastModifiedTimestamp: now };

      if (newStatus === "completed") {
        updatedFields.completedTimestamp = now;
        updatedFields.timeZone =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
      } else if (newStatus === "in-progress") {
        updatedFields.startedTimestamp = now;
      }

      // Update Firestore
      await updateDoc(taskRef, updatedFields);

      // Update local state
      // setTasks((prevTasks) =>
      //   prevTasks.map((task) =>
      //     task.id === taskId ? { ...task, ...updatedFields } : task
      //   )
      // );

      if (newStatus === "completed") {
        setCompletedTasks((prevCompletedTasks) => {
          const updatedTask = { ...activeTask, ...updatedFields };

          return [updatedTask, ...prevCompletedTasks].sort(
            (a, b) =>
              new Date(b.completedTimestamp) - new Date(a.completedTimestamp)
          );
        });
      }
    }

    setActiveTask(null);
  };

  return (
    <div className="w-full max-w-[1600px]">
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
        <div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col md:flex-row gap-8 mb-4 justify-center items-center mx-10">
              {categories.length > 0 ? (
                <div className="flex gap-2 items-center">
                  <label className="text-end leading-5">
                    Filter by Category
                  </label>
                  <select
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 p-2 rounded-md font-medium"
                  >
                    <option value="all">All</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className="flex gap-2 items-center">
                <label className="text-end leading-5">Filter by Priority</label>
                <select
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800  border border-zinc-300 dark:border-zinc-700 p-2 rounded-md font-medium"
                >
                  <option value="all">All</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-end leading-5">Filter by Due Date</label>
                <select
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 p-2 rounded-md font-medium"
                >
                  <option value="all">All</option>
                  <option value="isToday">Today</option>
                  <option value="isTomorrow">Tomorrow</option>
                  <option value="isThisWeek">This Week</option>
                  <option value="isNextWeek">Next Week</option>
                  <option value="isThisMonth">This Month</option>
                  <option value="isNextMonth">Next Month</option>
                  <option value="isPast">Past Due</option>
                </select>
              </div>
            </div>
          </div>
          <div className="w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <Column
                key="in-progress"
                id="in-progress"
                title="Current Task"
                tasks={inProgressTasks}
                text="What are you working on?"
                user={user}
              />
              <div className="lg:order-first">
                <Column
                  key="to-do"
                  id="to-do"
                  title="To-Dos"
                  tasks={toDoTasks}
                  text="Let's get protaskinating!"
                  user={user}
                />
              </div>
              <Column
                key="completed"
                id="completed"
                title="Completed Tasks"
                tasks={completedTasks}
                text="Are you protaskinating?"
                user={user}
              />
              <DragOverlay>
                {activeTask ? <TaskCard task={activeTask} /> : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      )}
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};

export default Home;

import { useState, useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
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
  endOfDay,
} from "date-fns";
import { Howl } from "howler";
import { useCategories } from "../context/CategoriesContext";
import { usePriorityColors } from "../context/PriorityColorContext";
import { useTasks } from "../context/TasksContext";
import Confetti from "react-confetti";
import colorCodes from "../colors";
import Column from "./Column";
import TaskCard from "./TaskCard";
import Link from "./Link";
import PropTypes from "prop-types";

const KanBan = ({ user, theme }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [toDoTasks, setToDoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [partyModeDimensions, setPartyModeDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const { categories } = useCategories();
  const { priorityColors } = usePriorityColors();
  const { tasks } = useTasks();

  const colors = {
    low: colorCodes[theme + "low" + priorityColors.low],
    medium: colorCodes[theme + "medium" + priorityColors.medium],
    high: colorCodes["high" + priorityColors.high],
  };

  const popRef = useRef(null);

  useEffect(() => {
    popRef.current = new Howl({
      src: ["./442265__crafty_juggler__pop-sound.mp3"],
    });
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      let toDo = tasks.filter((task) => task.status === "to-do");
      // Sort tasks by priority and due date
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      toDo.sort((a, b) => {
        // If both tasks have due dates, sort by due date (earliest first)
        if (a.dueDate && b.dueDate) {
          const dateDiff = new Date(a.dueDate) - new Date(b.dueDate);
          if (dateDiff !== 0) return dateDiff;
        }

        // Tasks with a dueDate should come before those without
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        // If due dates are the same (or both missing), sort by priority
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      let inProgress = tasks.filter((task) => task.status === "in-progress");
      // Sort tasks by priority and due date
      inProgress.sort((a, b) => {
        // If both tasks have due dates, sort by due date (earliest first)
        if (a.dueDate && b.dueDate) {
          const dateDiff = new Date(a.dueDate) - new Date(b.dueDate);
          if (dateDiff !== 0) return dateDiff;
        }

        // Tasks with a dueDate should come before those without
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        // If due dates are the same (or both missing), sort by priority
        return priorityOrder[a.priority] - priorityOrder[b.priority];
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
    setLoading(false);
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
      let dueDate = null;
      if (task.dueDate) {
        let parsedDate = parseISO(task.dueDate);
        dueDate = endOfDay(parsedDate);
      }
      const matchesCategory =
        categoryFilter === "all" || task.categories?.includes(categoryFilter);
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDate =
        dateFilter === "all" || dateFilters[dateFilter]?.(dueDate);
      return (
        task.status === "to-do" &&
        matchesCategory &&
        matchesPriority &&
        matchesDate
      );
    });
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    toDo.sort((a, b) => {
      // If both tasks have due dates, sort by due date (earliest first)
      if (a.dueDate && b.dueDate) {
        const dateDiff = new Date(a.dueDate) - new Date(b.dueDate);
        if (dateDiff !== 0) return dateDiff;
      }

      // Tasks with a dueDate should come before those without
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      // If due dates are the same (or both missing), sort by priority
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    let inProgress = tasks.filter((task) => {
      let dueDate = null;
      if (task.dueDate) {
        let parsedDate = parseISO(task.dueDate);
        dueDate = endOfDay(parsedDate);
      }
      const matchesCategory =
        categoryFilter === "all" || task.categories?.includes(categoryFilter);
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDate =
        dateFilter === "all" || dateFilters[dateFilter]?.(dueDate);
      return (
        task.status === "in-progress" &&
        matchesCategory &&
        matchesPriority &&
        matchesDate
      );
    });
    inProgress.sort((a, b) => {
      // If both tasks have due dates, sort by due date (earliest first)
      if (a.dueDate && b.dueDate) {
        const dateDiff = new Date(a.dueDate) - new Date(b.dueDate);
        if (dateDiff !== 0) return dateDiff;
      }

      // Tasks with a dueDate should come before those without
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      // If due dates are the same (or both missing), sort by priority
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    let completed = tasks.filter((task) => {
      let dueDate = null;
      if (task.dueDate) {
        let parsedDate = parseISO(task.dueDate);
        dueDate = endOfDay(parsedDate);
      }
      const matchesCategory =
        categoryFilter === "all" || task.categories?.includes(categoryFilter);
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      const matchesDate =
        dateFilter === "all" || dateFilters[dateFilter]?.(dueDate);
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

  useEffect(() => {
    const handleResize = () => {
      setPartyModeDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const completeTaskAnimation = () => {
    if (popRef.current) {
      popRef.current.play();
      setTimeout(() => popRef.current.stop(), 3000);
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

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
        completeTaskAnimation();
        updatedFields.completedTimestamp = now;
        updatedFields.timeZone =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
      } else if (newStatus === "in-progress") {
        updatedFields.startedTimestamp = now;
      }

      // Update Firestore
      await updateDoc(taskRef, updatedFields);
    }

    setActiveTask(null);
  };

  return (
    <div className="w-full max-w-[1600px]">
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={600}
          gravity={0.5}
          tweenDuration={1000}
          colors={[colors.low, colors.medium, colors.high]}
          width={partyModeDimensions.width}
          height={partyModeDimensions.height}
        />
      )}
      {!user ? (
        <div className="flex flex-col items-center justify-center">
          <Link text="New here? Sign up!" link="/signup" style="primary" />
          <Link
            text="Already a Protaskinator? Sign in!"
            link="/signin"
            style="secondary"
          />
        </div>
      ) : user && loading ? (
        <div>
          <p className="text-center text-3xl mb-20">Protaskinating ...</p>
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
                text="Mastering the art of avoidance, I see."
                user={user}
              />
              <div className="lg:order-first">
                <Column
                  key="to-do"
                  id="to-do"
                  title="To-Dos"
                  tasks={toDoTasks}
                  text="This is where good intentions go to die."
                  user={user}
                />
              </div>
              <Column
                key="completed"
                id="completed"
                title="Completed Tasks"
                tasks={completedTasks}
                text="Nothing yet? That's cool."
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

KanBan.propTypes = {
  user: PropTypes.object,
};

export default KanBan;

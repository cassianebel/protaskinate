import { useState, useEffect } from "react";
import { getDaysInMonth } from "date-fns";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { fetchTask } from "../firestore";
import { usePriorityColors } from "../context/PriorityColorContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaCirclePlus, FaCircleCheck } from "react-icons/fa6";
import Modal from "./Modal";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";
import clsx from "clsx";
import PropTypes from "prop-types";

const CalendarGrid = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [isEmptySlot, setIsEmptySlot] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);
  const { priorityColors } = usePriorityColors();

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
    const tasksDue = tasks.filter((task) => task.dueDate != null);
    const taskEvents = tasksDue.map((task) => {
      const date = new Date(task.dueDate);
      const adjustedDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      ); // Shift back to UTC
      return {
        id: task.id,
        title: task.title,
        date: adjustedDate,
        priority: task.priority,
        status: task.status,
      };
    });
    console.log(taskEvents);
    setEvents(taskEvents);
  }, [tasks]);

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  let days = [];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const prevMonthDays = getDaysInMonth(new Date(year, month - 1));

  const firstDayIndex = firstDayOfMonth.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  // Add previous month's days
  for (let i = firstDayIndex; i > 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i + 1),
      isCurrentMonth: false,
    });
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  // Add next month's days to complete the 6-row grid
  const totalDays = days.length;
  const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);

  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEmptySlot(false);
  };

  // Update Task Data After Editing
  const handleTaskUpdate = (updatedTask) => {
    setTaskDetails(updatedTask);
  };

  const fetchDetails = async (event) => {
    console.log(event);
    if (!user) return;
    try {
      const task = await fetchTask(event.id);
      if (task) {
        const taskData = { id: task.id, ...task.data() };
        setTaskDetails(taskData);
      } else {
        console.error("Failed to fetch task.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    openModal();
  };

  const handleEmptySlot = (date) => {
    setIsEmptySlot(true);
    setSlotInfo(date);
    openModal();
  };

  return (
    <div className="w-full px-4 mb-20">
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => prevMonth()}
          className="hover:scale-120 duration-200 p-3 cursor-pointer"
        >
          <FaChevronLeft />
        </button>
        <h2 className="w-40 text-center text-3xl font-bold mb-2">
          {monthName}
        </h2>
        <button
          onClick={() => nextMonth()}
          className="hover:scale-120 duration-200 p-3 cursor-pointer"
        >
          <FaChevronRight />
        </button>
      </div>
      <div className="w-full max-w-[1500px] grid grid-cols-7 gap-1 mx-auto">
        {days.map((day) => (
          <div
            key={day.date}
            className={`w-full min-h-28 rounded-md flex flex-col gap-1 ${
              !day.isCurrentMonth
                ? "bg-zinc-300 dark:bg-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            <span className="block text-end mt-1 me-2">
              {day.date.getDate()}
            </span>
            {events
              .filter((event) => event.date.toString() == day.date.toString())
              .map((task) => (
                <button
                  key={task.title}
                  className={clsx(
                    "w-11/12 text-start mx-2 ps-2 shadow rounded-sm cursor-pointer hover:scale-110 transition-all ease-in ",
                    priorityColors[task.priority],
                    task.priority,
                    task.status
                  )}
                  onClick={() => fetchDetails(task)}
                >
                  <div className="border-1 rounded-sm bg-white dark:bg-zinc-950 dark:text-zinc-400 ps-2 py-1 pe-1">
                    <p className="truncate">
                      {task.status == "completed" && (
                        <FaCircleCheck className="inline me-2 -mt-1" />
                      )}
                      {task.title}
                    </p>
                  </div>
                </button>
              ))}
            <button
              onClick={() => handleEmptySlot(day.date)}
              className="grow w-full cursor-pointer pt-1 pb-2 group/item"
            >
              <span className="group/edit opacity-0 group-hover/item:opacity-100 duration-300 ease-in-out flex items-center justify-center gap-2">
                <FaCirclePlus />
                <span className="pb-1">add new task</span>
              </span>
            </button>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isEmptySlot ? (
          <CreateTaskForm date={slotInfo} user={user} closeModal={closeModal} />
        ) : (
          <TaskCard
            task={taskDetails}
            user={user}
            handleTaskUpdate={handleTaskUpdate}
          />
        )}
      </Modal>
    </div>
  );
};

CalendarGrid.propTypes = {
  user: PropTypes.object.isRequired,
};

export default CalendarGrid;

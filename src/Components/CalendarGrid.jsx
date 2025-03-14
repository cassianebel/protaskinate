import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDaysInMonth } from "date-fns";
import { fetchTask } from "../firestore";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useTasks } from "../context/TasksContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Modal from "./Modal";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";
import CalendarDay from "./CalendarDay";
import CalendarTask from "./CalendarTask";
import PropTypes from "prop-types";

const CalendarGrid = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [isEmptySlot, setIsEmptySlot] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const { tasks } = useTasks();

  useEffect(() => {
    const tasksDue = tasks.filter((task) => task.dueDate != null);
    const taskEvents = tasksDue.map((task) => {
      const date = new Date(task.dueDate);
      const adjustedDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      ); // Shift back to UTC
      const isPastDue = () => {
        if (task.dueDate) {
          const todayLocal = new Date();
          todayLocal.setHours(0, 0, 0, 0); // Normalize today’s time to midnight

          const [year, month, day] = task.dueDate.split("-").map(Number); // Extract components
          const dueDate = new Date();
          dueDate.setFullYear(year, month - 1, day); // Ensure local time
          dueDate.setHours(0, 0, 0, 0); // Normalize to midnight local time

          return dueDate < todayLocal && task.status === "to-do";
        }
      };
      return {
        id: task.id,
        title: task.title,
        date: adjustedDate,
        repeatNumber: task.repeatNumber,
        priority: task.priority,
        status: task.status,
        isPastDue: isPastDue()
          ? "motion-safe:animate-wiggle hover:animate-none"
          : "",
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

  const handleDragStart = (event) => {
    setActiveTask(event.active.data.current);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newDueDate = new Date(over.id);
    const formattedDate = newDueDate.toISOString().split("T")[0];
    console.log(formattedDate);
    const now = new Date();

    if (activeTask.dueDate !== formattedDate) {
      const taskRef = doc(db, "tasks", taskId);
      let updatedFields = {
        dueDate: formattedDate,
        lastModifiedTimestamp: now,
      };

      // Update Firestore
      await updateDoc(taskRef, updatedFields);
    }

    setActiveTask(null);
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
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {days.map((day) => (
            <CalendarDay
              key={day.date}
              id={day.date}
              day={day}
              events={events}
              fetchDetails={fetchDetails}
              handleEmptySlot={handleEmptySlot}
            />
          ))}

          <DragOverlay>
            {activeTask ? <CalendarTask task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
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

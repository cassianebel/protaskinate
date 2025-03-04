import { useState, useEffect } from "react";
import Link from "./Link";
import { fetchUsersTasks, fetchTask } from "../firestore";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import enUS from "date-fns/locale/en-US";
import "../calendar.css";
import Modal from "./Modal";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ user, theme }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [isEmptySlot, setIsEmptySlot] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);

  const background = theme == "light" ? "#f5f4f4" : "#1b1718";

  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

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
    const tasksDue = tasks.filter((task) => task.dueDate != null);
    const taskEvents = tasksDue.map((task) => {
      const date = new Date(task.dueDate);
      const adjustedDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      ); // Shift back to UTC
      return {
        id: task.id,
        title: task.title,
        start: adjustedDate,
        end: adjustedDate,
      };
    });
    setEvents(taskEvents);
  }, [tasks]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEmptySlot(false);
  };

  const fetchDetails = async (event) => {
    if (!user) return;
    try {
      const task = await fetchTask(event);
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

  const handleEmptySlot = (slotInfo) => {
    setIsEmptySlot(true);
    console.log(slotInfo);
    setSlotInfo(slotInfo);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-[80vh] ">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        defaultView="month"
        style={{
          height: 600,
          width: 900,
          backgroundColor: background,
          padding: 20,
          borderRadius: 8,
        }}
        onSelectEvent={(event) => fetchDetails(event.id)}
        onSelectSlot={(slotInfo) => handleEmptySlot(slotInfo)}
        selectable
        date={currentDate} // Make sure date is controlled
        onNavigate={handleNavigate} // Handles navigation
        view={currentView} // Ensure view is controlled
        onView={handleViewChange} // Handles view changes
      />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isEmptySlot ? (
          <CreateTaskForm
            date={slotInfo.start}
            user={user}
            closeModal={closeModal}
          />
        ) : (
          <TaskCard task={taskDetails} />
        )}
      </Modal>
    </div>
  );
};

export default CalendarView;

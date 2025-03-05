import { useState, useEffect } from "react";
import { Route, Routes, Navigate, NavLink } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SignOut from "./components/SignOut";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import { IoInvertMode } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaCirclePlus, FaChartPie } from "react-icons/fa6";
import CreateTaskForm from "./Components/CreateTaskForm";
import EditTaskForm from "./Components/EditTaskForm";
import { PriorityColorProvider } from "./context/PriorityColorContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext";
import Stats from "./Components/Stats.jsx";
import { LuCalendarDays } from "react-icons/lu";
import { BsKanban } from "react-icons/bs";
import Modal from "./Components/Modal";
import CalendarGrid from "./Components/CalendarGrid.jsx";

function App() {
  const [theme, setTheme] = useState("light");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <CategoriesProvider user={user}>
      <PriorityColorProvider user={user}>
        <div className={theme}>
          <div className="bg-zinc-200 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 font-extralight min-h-screen flex flex-col items-center justify-between md:justify-start gap-10">
            <header className="sticky top-0  w-full bg-zinc-100 dark:bg-zinc-900 py-1 px-3 z-50">
              <div className="max-w-[1700px] flex items-center justify-between mx-auto">
                <h1>
                  <NavLink
                    to="/"
                    className="text-xl md:text-2xl lg:text-3xl font-bold"
                  >
                    protaskinate
                  </NavLink>
                </h1>

                <nav className="flex items-center gap-6 text-2xl">
                  <button
                    onClick={() => openModal()}
                    className="hidden md:block text-2xl p-2"
                  >
                    <FaCirclePlus />
                    <span className="sr-only">Create New Task</span>
                  </button>

                  <NavLink to="/" className="p-2">
                    <BsKanban />
                    <span className="sr-only">KanBan Board</span>
                  </NavLink>
                  <NavLink to="/calendar" className="p-2 hidden lg:block">
                    <LuCalendarDays />
                    <span className="sr-only">Calendar</span>
                  </NavLink>
                  <NavLink to="/stats" className="p-2">
                    <FaChartPie />
                    <span className="sr-only">Analytics</span>
                  </NavLink>
                  <NavLink to="/profile" className="p-2">
                    <FaUserCircle />
                    <span className="sr-only">Profile</span>
                  </NavLink>
                  <button onClick={toggleTheme} className="p-2">
                    <IoInvertMode />
                    <span className="sr-only">Toggle Theme</span>
                  </button>
                </nav>
              </div>
            </header>

            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signout" element={<SignOut />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/create" element={<CreateTaskForm user={user} />} />
              <Route
                path="/edit/:taskId"
                element={<EditTaskForm user={user} />}
              />
              <Route
                path="/stats"
                element={<Stats user={user} theme={theme} />}
              />
              <Route
                path="/calendar"
                element={<CalendarGrid user={user} theme={theme} />}
              />
            </Routes>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <CreateTaskForm user={user} closeModal={closeModal} />
            </Modal>
            <footer className="md:hidden sticky bottom-0 w-full  p-6 flex items-center justify-center text-4xl">
              <NavLink to="/create">
                <FaCirclePlus />
              </NavLink>
            </footer>
          </div>
        </div>
      </PriorityColorProvider>
    </CategoriesProvider>
  );
}

export default App;

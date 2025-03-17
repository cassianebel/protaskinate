import { useState, useEffect } from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { PriorityColorProvider } from "./context/PriorityColorContext.jsx";
import { CategoriesProvider } from "./context/CategoriesContext";
import { TasksProvider } from "./context/TasksContext.jsx";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SignOut from "./components/SignOut";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import CreateTaskForm from "./Components/CreateTaskForm";
import EditTaskForm from "./Components/EditTaskForm";
import Stats from "./Components/Stats.jsx";
import Modal from "./Components/Modal";
import CalendarGrid from "./Components/CalendarGrid.jsx";
import Navigation from "./Components/Navigation.jsx";
import KanBan from "./Components/KanBan.jsx";

const App = () => {
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
      <PriorityColorProvider key={user?.uid} user={user}>
        <TasksProvider user={user}>
          <div className={theme}>
            <div className="bg-zinc-200 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 font-extralight min-h-screen flex flex-col items-center justify-between md:justify-start gap-10 duration-300 ease-in-out">
              <header className="sticky top-0 w-full bg-zinc-100 dark:bg-zinc-900 py-2 px-3 z-50">
                <div className="max-w-[1700px] flex items-center justify-center md:justify-between mx-auto">
                  <h1>
                    <NavLink
                      to="/"
                      className="text-xl md:text-2xl lg:text-3xl font-bold"
                    >
                      Protaskinate
                    </NavLink>
                  </h1>
                  <div className="hidden md:block">
                    <Navigation
                      openModal={openModal}
                      toggleTheme={toggleTheme}
                      user={user}
                    />
                  </div>
                </div>
              </header>

              <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signout" element={<SignOut />} />
                <Route
                  path="/kanban"
                  element={<KanBan user={user} theme={theme} />}
                />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route
                  path="/create"
                  element={<CreateTaskForm user={user} />}
                />
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
              <footer className="md:hidden sticky bottom-0 w-full p-4 bg-zinc-100 dark:bg-zinc-900 z-40 flex items-center justify-center text-4xl">
                <Navigation
                  openModal={openModal}
                  toggleTheme={toggleTheme}
                  user={user}
                />
              </footer>
            </div>
          </div>
        </TasksProvider>
      </PriorityColorProvider>
    </CategoriesProvider>
  );
};

export default App;

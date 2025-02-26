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
import { FaCirclePlus } from "react-icons/fa6";
import CreateTaskForm from "./Components/CreateTaskForm";
import EditTaskForm from "./Components/EditTaskForm";
import { PriorityColorProvider } from "./Components/PriorityColorContext.jsx";

function App() {
  const [theme, setTheme] = useState("light");
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

  return (
    <PriorityColorProvider>
      <div className={theme}>
        <div className="bg-zinc-200 dark:bg-zinc-950 text:zinc-800 dark:text-zinc-200 font-extralight min-h-screen flex flex-col items-center justify-between">
          <header className="sticky top-0 flex items-center justify-between w-full bg-zinc-100 dark:bg-zinc-900 py-1 px-3">
            <h1>
              <NavLink
                to="/"
                className="text-xl md:text-2xl lg:text-3xl font-bold"
              >
                protaskinate
              </NavLink>
            </h1>
            <nav className="flex items-center gap-2 text-2xl">
              <button onClick={toggleTheme} className=" px-4 py-2 rounded-full">
                <IoInvertMode />
                <span className="sr-only">Toggle Theme</span>
              </button>
              <NavLink to="/profile">
                <FaUserCircle />
              </NavLink>
            </nav>
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
          </Routes>
          <footer className="sticky bottom-0 w-full bg-zinc-100 dark:bg-zinc-900 p-3 flex items-center justify-center text-3xl">
            <NavLink to="/create">
              <FaCirclePlus />
            </NavLink>
          </footer>
        </div>
      </div>
    </PriorityColorProvider>
  );
}

export default App;

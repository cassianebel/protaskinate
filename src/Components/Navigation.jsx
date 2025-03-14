import { NavLink } from "react-router-dom";
import { IoInvertMode } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaCirclePlus, FaChartPie } from "react-icons/fa6";
import { LuCalendarDays } from "react-icons/lu";
import { BsKanbanFill } from "react-icons/bs";
import { useTasks } from "../context/TasksContext";
import PropTypes from "prop-types";

const Navigation = ({ openModal, toggleTheme, user }) => {
  const { tasks } = useTasks();
  return (
    <nav className="flex items-center gap-8 lg:gap-4 xl:gap-8 text-2xl font-bold">
      <button
        onClick={() => openModal()}
        className="flex items-center gap-2 text-2xl p-2 cursor-pointer group opacity-80 hover:opacity-100 duration-300 "
      >
        <FaCirclePlus
          className={`md:scale-90 group-hover:scale-110 duration-300 ${
            user && tasks.length < 1 && "animate-bounce"
          } group-hover:animate-none`}
        />
        <span className="hidden lg:block text-base">New Task</span>
      </button>

      <NavLink
        to="/kanban"
        className="flex items-center gap-2 p-2 group opacity-80 hover:opacity-100 duration-300 "
      >
        <BsKanbanFill className="md:scale-90 group-hover:scale-110 duration-300 " />
        <span className="hidden lg:block text-base">KanBan</span>
      </NavLink>
      <NavLink
        to="/calendar"
        className="p-2 hidden lg:flex items-center gap-2 group opacity-80 hover:opacity-100 duration-300 "
      >
        <LuCalendarDays className="md:scale-100 group-hover:scale-120 duration-300 " />
        <span className="hidden lg:block text-base">Calendar</span>
      </NavLink>
      <NavLink
        to="/stats"
        className="p-2 flex items-center gap-2 group opacity-80 hover:opacity-100 duration-300 "
      >
        <FaChartPie className="md:scale-90 group-hover:scale-110 duration-300 " />
        <span className="hidden lg:block text-base">Stats</span>
      </NavLink>
      <NavLink
        to="/profile"
        className="p-2 flex items-center gap-2 group opacity-80 hover:opacity-100 duration-300 "
      >
        <FaUserCircle className="md:scale-90 group-hover:scale-110 duration-300 " />
        <span className="hidden lg:block text-base">Profile</span>
      </NavLink>
      <button
        onClick={toggleTheme}
        className="p-2 flex items-center gap-2 cursor-pointer group opacity-80 hover:opacity-100 duration-300 "
      >
        <IoInvertMode className="md:scale-100 group-hover:scale-120 duration-300 " />
        <span className="hidden lg:block text-base">Toggle Theme</span>
      </button>
    </nav>
  );
};

Navigation.propTypes = {
  openModal: PropTypes.func.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Navigation;

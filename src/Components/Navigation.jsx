import { NavLink } from "react-router-dom";
import { IoInvertMode } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { FaCirclePlus, FaChartPie } from "react-icons/fa6";
import { LuCalendarDays } from "react-icons/lu";
import { BsKanban } from "react-icons/bs";
import PropTypes from "prop-types";

const Navigation = ({ openModal, toggleTheme }) => {
  return (
    <nav className="flex items-center gap-8 lg:gap-4 xl:gap-8 text-2xl font-bold">
      <button
        onClick={() => openModal()}
        className="flex items-center gap-2 text-2xl p-2 cursor-pointer"
      >
        <FaCirclePlus />
        <span className="hidden lg:block text-base">New Task</span>
      </button>

      <NavLink to="/" className="flex items-center gap-2 p-2">
        <BsKanban />
        <span className="hidden lg:block text-base">KanBan</span>
      </NavLink>
      <NavLink to="/calendar" className="p-2 hidden lg:flex items-center gap-2">
        <LuCalendarDays />
        <span className="hidden lg:block text-base">Calendar</span>
      </NavLink>
      <NavLink to="/stats" className="p-2 flex items-center gap-2">
        <FaChartPie />
        <span className="hidden lg:block text-base">Analytics</span>
      </NavLink>
      <NavLink to="/profile" className="p-2 flex items-center gap-2">
        <FaUserCircle />
        <span className="hidden lg:block text-base">Profile</span>
      </NavLink>
      <button
        onClick={toggleTheme}
        className="p-2 flex items-center gap-2 cursor-pointer"
      >
        <IoInvertMode />
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

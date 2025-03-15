import { FaUserCircle } from "react-icons/fa";
import { FaChartPie } from "react-icons/fa6";
import { BsKanbanFill } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import SignUp from "./SignUp";
import PropTypes from "prop-types";

const Home = ({ user }) => {
  return (
    <div className="w-full max-w-[1600px] text-lg text-center px-10">
      <h2 className="text-5xl my-10">
        Welcome to <span className="font-bold">Protaskinate</span>!
      </h2>

      <p className="my-10">
        Ah, yes... Another task manager app — because clearly, the world needed
        one more.
      </p>
      <div className="lg:flex items-center gap-20 xl:gap-40 mx-auto w-fit">
        <div className="lg:text-left">
          <h3 className="my-10 text-3xl">
            Our Cutting-Edge Procrastination Features:
          </h3>

          <ul className="my-10 text-start max-w-2xl mx-auto">
            <li className="my-4 flex gap-2">
              <LuCalendarDays className="text-4xl text-center w-10" />
              <p>
                <span className="font-medium">
                  Future You’s Problem Scheduler
                </span>{" "}
                – Pick any random day on the calendar to put off a task for
                later.
              </p>
            </li>
            <li className="my-4 flex gap-2">
              <FaUserCircle className="text-3xl text-center  w-12" />
              <p>
                <span className="font-medium">Customization Station </span>–
                Spend endless hours picking your palette, creating categories,
                and pretending you have your life together.
              </p>
            </li>
            <li className="my-4 flex gap-2">
              <FaChartPie className="text-3xl text-center  w-10" />
              <p>
                <span className="font-medium">Dopamine Dashboard </span>- Track
                your progress (or lack thereof) with fancy stats. Who doesn’t
                love a good pie chart?
              </p>
            </li>
            <li className="my-4 flex gap-2">
              <BsKanbanFill className="text-3xl text-center w-7" />
              <p>
                <span className="font-medium">Task Cemetery </span>– Where to-do
                items go to be ignored forever.
              </p>
            </li>
          </ul>

          <p className="my-10">
            Sign up now to get started. Or don’t. We both know you’ll get to it
            eventually.
          </p>
        </div>
        <div className="text-start md:p-10 bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow my-10">
          {user ? (
            <div className="p-10">
              <p>What are you still doing here?</p>

              <p className="my-10">
                Check out the{" "}
                <NavLink
                  to="/kanban"
                  className="inline-flex gap-2 mx-2 items-center font-bold"
                >
                  <BsKanbanFill /> KanBan
                </NavLink>{" "}
                or the{" "}
                <NavLink
                  to="/calendar"
                  className="inline-flex gap-2 mx-2 items-center font-bold"
                >
                  <LuCalendarDays /> Calendar
                </NavLink>
              </p>

              <p>And start adding some tasks already!</p>
            </div>
          ) : (
            <SignUp />
          )}
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  user: PropTypes.object,
};

export default Home;

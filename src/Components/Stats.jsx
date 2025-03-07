import { useState, useEffect } from "react";
import { fetchUsersTasks } from "../firestore";
import { isToday, isSameWeek, isSameMonth, isSameYear, format } from "date-fns";
import PriorityDonut from "./PriorityDonut";
import StatusDonut from "./StatusDonut";
import Stat from "./Stat";
import Link from "./Link";
import PropTypes from "prop-types";

const Stats = ({ user, theme }) => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [error, setError] = useState(null);
  const [totalCompletedTasks, setTotalCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(0);
  const [tasksCompletedThisWeek, setTasksCompletedThisWeek] = useState(0);
  const [tasksCompletedThisMonth, setTasksCompletedThisMonth] = useState(0);
  const [tasksCompletedThisYear, setTasksCompletedThisYear] = useState(0);
  const today = new Date();

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
    if (tasks.length > 0) {
      let completed = tasks.filter((task) => task.status === "completed");
      // Sort by completedTimestamp or lastModifiedTimestamp if none (latest first)
      completed.sort((a, b) => {
        return b.completedTimestamp - a.completedTimestamp;
      });

      setCompletedTasks(completed);
      animateNums(
        completed.length,
        totalCompletedTasks,
        setTotalCompletedTasks
      );
      setTotalTasks(tasks.length);

      const completedToday = completed.filter((task) =>
        isToday(task.completedTimestamp.toDate())
      );

      const completedThisWeek = completed.filter((task) =>
        isSameWeek(task.completedTimestamp.toDate(), today)
      );
      const completedThisMonth = completed.filter((task) =>
        isSameMonth(task.completedTimestamp.toDate(), today)
      );
      const completedThisYear = completed.filter((task) =>
        isSameYear(task.completedTimestamp.toDate(), today)
      );

      animateNums(
        completedToday.length,
        tasksCompletedToday,
        setTasksCompletedToday
      );
      animateNums(
        completedThisWeek.length,
        tasksCompletedThisWeek,
        setTasksCompletedThisWeek
      );
      animateNums(
        completedThisMonth.length,
        tasksCompletedThisMonth,
        setTasksCompletedThisMonth
      );
      animateNums(
        completedThisYear.length,
        tasksCompletedThisYear,
        setTasksCompletedThisYear
      );
    }
  }, [tasks]);

  const animateNums = (num, setVal, setter) => {
    if (num > 0) {
      setTimeout(() => {
        setter(setVal++);
        if (num === setVal) return;
        return animateNums(num, setVal, setter);
      }, 30);
    }
  };

  return !user ? (
    <div className="flex flex-col items-center justify-center">
      <Link text="New here? Sign up!" link="/signup" style="primary" />
      <Link
        text="Already protaskanating? Sign in!"
        link="/signin"
        style="secondary"
      />
    </div>
  ) : (
    <div>
      <h2 className="text-2xl text-center font-bold mb-20">Stats</h2>
      <h3 className="text-lg text-center font-bold mb-4">Completed Tasks</h3>
      <div className="flex flex-row flex-wrap gap-10 items-center justify-center mx-10 mb-20">
        <Stat text="today" number={tasksCompletedToday} />
        <Stat text="this week" number={tasksCompletedThisWeek} />
        <Stat text={format(today, "MMMM")} number={tasksCompletedThisMonth} />
        <Stat text={format(today, "y")} number={tasksCompletedThisYear} />
        <Stat text="total" number={totalCompletedTasks} />
      </div>
      <div className="flex flex-col lg:flex-row gap-10 items-center justify-center m-10">
        <StatusDonut tasks={tasks} theme={theme} />
        <div className="flex flex-col md:flex-row gap-10">
          <PriorityDonut
            tasks={tasks}
            theme={theme}
            heading="ALL Tasks by Priority"
          />
          <PriorityDonut
            tasks={completedTasks}
            theme={theme}
            heading="COMPLETED Tasks by Priority"
          />
        </div>
      </div>
    </div>
  );
};

Stats.propTypes = {
  user: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
};

export default Stats;

import { useState, useEffect } from "react";
import { fetchUsersTasks } from "../firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import * as dateFns from "date-fns";
import PriorityDonut from "./PriorityDonut";
import StatusDonut from "./StatusDonut";
import Stat from "./Stat";

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
  const [lowPriorityTasks, setLowPriorityTasks] = useState([]);
  const [mediumPriorityTasks, setMediumPriorityTasks] = useState([]);
  const [highPriorityTasks, setHighPriorityTasks] = useState([]);
  const [averageCompletionTime, setAverageCompletionTime] = useState(0);
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
        dateFns.isToday(task.completedTimestamp.toDate())
      );

      const completedThisWeek = completed.filter((task) =>
        dateFns.isSameWeek(task.completedTimestamp.toDate(), today)
      );
      const completedThisMonth = completed.filter((task) =>
        dateFns.isSameMonth(task.completedTimestamp.toDate(), today)
      );
      const completedThisYear = completed.filter((task) =>
        dateFns.isSameYear(task.completedTimestamp.toDate(), today)
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

      // let times = [];
      // const completionTimes = completed.map((task) => {
      //   const completedTime = task.completedTimestamp.toDate();
      //   const createdTime = task.createdTimestamp.toDate();
      //   const time = dateFns.differenceInMinutes(completedTime, createdTime);
      //   times.push(time);
      // });
      // const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      // if (averageTime > 60) {
      //   const hours = Math.floor(averageTime / 60);
      //   const minutes = Math.round(averageTime % 60);
      //   setAverageCompletionTime(`${hours}h ${minutes}m`);
      // }
      // if (averageTime < 60) {
      //   setAverageCompletionTime(`${Math.round(averageTime)}m`);
      // }
    }
  }, [tasks]);

  const animateNums = (num, setVal, setter) => {
    setTimeout(() => {
      setter(setVal++);
      if (num === setVal) return;
      return animateNums(num, setVal, setter);
    }, 30);
  };

  return (
    <div>
      <h2 className="text-2xl text-center font-bold mb-20">Analytics</h2>
      <h3 className="text-lg text-center font-bold mb-4">Completed Tasks</h3>
      <div className="flex flex-row flex-wrap gap-10 items-center justify-center mx-10 mb-20">
        <Stat text="today" number={tasksCompletedToday} />
        <Stat text="this week" number={tasksCompletedThisWeek} />
        <Stat
          text={dateFns.format(today, "MMMM")}
          number={tasksCompletedThisMonth}
        />
        <Stat
          text={dateFns.format(today, "y")}
          number={tasksCompletedThisYear}
        />
        <Stat text="total" number={totalCompletedTasks} />
      </div>
      {/* <p className="text-center m-10">
        <span className="block text-6xl font-black">
          {averageCompletionTime}
        </span>{" "}
        average time spent per task
      </p> */}
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

export default Stats;

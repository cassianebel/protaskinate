import { useState, useEffect } from "react";
import { fetchUsersTasks } from "../firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebase";
import * as dateFns from "date-fns";
import PriorityDonut from "./PriorityDonut";
import StatusDonut from "./StatusDonut";

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
      setTotalCompletedTasks(completed.length);
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

      setTasksCompletedToday(completedToday.length);
      setTasksCompletedThisWeek(completedThisWeek.length);
      setTasksCompletedThisMonth(completedThisMonth.length);
      setTasksCompletedThisYear(completedThisYear.length);

      let times = [];
      const completionTimes = completed.map((task) => {
        const completedTime = task.completedTimestamp.toDate();
        const createdTime = task.createdTimestamp.toDate();
        const time = dateFns.differenceInMinutes(completedTime, createdTime);
        times.push(time);
      });
      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      if (averageTime > 60) {
        const hours = Math.floor(averageTime / 60);
        const minutes = Math.round(averageTime % 60);
        setAverageCompletionTime(`${hours}h ${minutes}m`);
      }
      if (averageTime < 60) {
        setAverageCompletionTime(`${Math.round(averageTime)}m`);
      }
    }
  }, [tasks]);

  return (
    <div>
      <h2 className="text-2xl text-center font-bold mb-4">Statistics</h2>
      <p>today: {tasksCompletedToday}</p>
      <p>this week: {tasksCompletedThisWeek}</p>
      <p>
        {dateFns.format(today, "MMMM")}: {tasksCompletedThisMonth}
      </p>
      <p>
        {dateFns.format(today, "y")}: {tasksCompletedThisYear}
      </p>
      <p>total: {totalCompletedTasks}</p>
      <p>average time spent per task: {averageCompletionTime}</p>
      <PriorityDonut
        tasks={completedTasks}
        theme={theme}
        heading="Completed Tasks by Priority"
      />
      <p>total tasks: {totalTasks}</p>
      <PriorityDonut
        tasks={tasks}
        theme={theme}
        heading="All Tasks by Priority"
      />
      <StatusDonut tasks={tasks} theme={theme} />
    </div>
  );
};

export default Stats;

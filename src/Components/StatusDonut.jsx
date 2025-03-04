import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { usePriorityColors } from "../context/PriorityColorContext";
import colorCodes from "../colors";

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const StatusDonutChart = ({ tasks, theme }) => {
  const { priorityColors } = usePriorityColors();
  // Define colors for each priority level
  const colors = {
    todo: colorCodes.todo,
    inprogress: colorCodes.inprogress,
    completed: colorCodes.completed,
  };
  // Count tasks by status
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { "to-do": 0, inProgress: 0, completed: 0 }
  );

  // Data for Chart.js
  const data = {
    labels: ["To-Do", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          statusCounts["to-do"],
          statusCounts.inProgress,
          statusCounts.completed,
        ],
        backgroundColor: [colors.todo, colors.inprogress, colors.completed],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color:
            theme === "dark"
              ? "oklch(0.92 0.004 286.32)"
              : "oklch(0.274 0.006 286.033)",
        },
      },
    },
  };

  return (
    <div className="w-64">
      <h3 className="text-center text-lg font-semibold mb-2">
        Tasks by Status
      </h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StatusDonutChart;

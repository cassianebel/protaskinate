import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { usePriorityColors } from "./PriorityColorContext";
import colorCodes from "../colors";

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PriorityDonutChart = ({ tasks, theme }) => {
  const { priorityColors } = usePriorityColors();
  // Define colors for each priority level
  const colors = {
    low: colorCodes[theme + "low" + priorityColors.low],
    medium: colorCodes[theme + "medium" + priorityColors.medium],
    high: colorCodes["high" + priorityColors.high],
  };
  console.log(colorCodes);
  // Count tasks by priority
  const priorityCounts = tasks.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  // Data for Chart.js
  const data = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [priorityCounts.low, priorityCounts.medium, priorityCounts.high],
        backgroundColor: [colors.low, colors.medium, colors.high],
        borderWidth: 1,
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
        Completed Tasks by Priority
      </h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PriorityDonutChart;

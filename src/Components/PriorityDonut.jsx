import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { usePriorityColors } from "../context/PriorityColorContext";
import colorCodes from "../colors";
import PropTypes from "prop-types";

// Register necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PriorityDonutChart = ({ tasks, theme, heading }) => {
  const { priorityColors } = usePriorityColors();
  // Define colors for each priority level
  const colors = {
    low: colorCodes[theme + "low" + priorityColors.low],
    medium: colorCodes[theme + "medium" + priorityColors.medium],
    high: colorCodes["high" + priorityColors.high],
  };
  // console.log(colorCodes);
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
    tasks.length > 0 && (
      <div className="w-64">
        <h3 className="text-center text-lg font-bold mb-2">{heading}</h3>
        <Doughnut data={data} options={options} />
      </div>
    )
  );
};

PriorityDonutChart.propTypes = {
  tasks: PropTypes.object,
  theme: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
};

export default PriorityDonutChart;

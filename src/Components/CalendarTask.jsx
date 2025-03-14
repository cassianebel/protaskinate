import { usePriorityColors } from "../context/PriorityColorContext";
import { useDraggable } from "@dnd-kit/core";
import { MdDragIndicator } from "react-icons/md";
import { FaCircleCheck, FaRepeat } from "react-icons/fa6";
import clsx from "clsx";
import PropTypes from "prop-types";

const CalendarTask = ({ task, fetchDetails }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { ...task },
  });
  const { priorityColors } = usePriorityColors();
  return (
    <div
      ref={setNodeRef}
      id={task.id}
      className={clsx(
        "w-11/12 text-start mx-2 ps-2 shadow rounded-sm  hover:scale-110 transition-all ease-in",
        priorityColors[task.priority],
        task.priority,
        task.status,
        task.isPastDue
      )}
    >
      <div className="flex gap-2 items-center border-1 rounded-sm bg-white dark:bg-zinc-950 dark:text-zinc-400 px-2 py-1">
        {/* {task.repeatNumber > 0 && <FaRepeat />} */}
        <button
          className="truncate grow cursor-pointer text-start w-100"
          onClick={() => fetchDetails(task)}
        >
          {task.status == "completed" && (
            <span>
              <FaCircleCheck className="inline me-2 -mt-1" />
              {task.title}
            </span>
          )}
          {task.status != "completed" && (
            <span className="font-medium">{task.title}</span>
          )}
        </button>
        <div {...listeners} {...attributes} className="cursor-grab">
          <MdDragIndicator />
        </div>
      </div>
    </div>
  );
};

CalendarTask.propTypes = {
  task: PropTypes.object.isRequired,
  fetchDetails: PropTypes.func.isRequired,
};

export default CalendarTask;

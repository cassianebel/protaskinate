import { useDraggable } from "@dnd-kit/core";
import { NavLink } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { FiMove } from "react-icons/fi";
import clsx from "clsx";
import { usePriorityColors } from "./PriorityColorContext";

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { ...task },
  });
  const { priorityColors } = usePriorityColors();

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "ps-4 my-6 rounded-md shadow-md",
        priorityColors[task.priority],
        task.priority,
        task.status === "completed" && "opacity-50"
      )}
    >
      <div className="flex gap-2 w-full bg-zinc-100 dark:bg-zinc-900 p-4 border-2 dark:border-1 rounded-lg">
        <div className="w-full self-center">
          <h3 className="text-xl font-medium">{task.title}</h3>
          <p className="my-2 text-zinc-600 dark:text-zinc-400">
            {task.description}
          </p>
          <div className="flex justify-between items-center">
            {task.dueDate && (
              <p className="font-light mt-2 shrink-0">
                Due: {new Date(task.dueDate).toString().slice(0, 10)}
              </p>
            )}
            {/* <ul className="mt-3 flex flex-wrap justify-end gap-3">
          <li className="inline-flex items-center bg-blue-200 dark:bg-blue-800 px-3 pb-1 rounded-full text-sm">
            work
          </li>
          <li className="inline-block bg-green-200 dark:bg-green-800 px-3 pb-1 rounded-full text-sm">
            tag two
          </li>
            </ul> */}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="opacity-60 hover:opacity-90">
            <NavLink to={`/edit/${task.id}`}>
              <FaPencilAlt /> <span className="sr-only">Edit Task</span>
            </NavLink>
          </div>
          <div
            {...listeners}
            {...attributes}
            className="text-2xl opacity-60 hover:opacity-90 cursor-grab"
          >
            <FiMove />{" "}
            <span className="sr-only">
              Drag task to update status (to-do, current/in-progress, completed)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

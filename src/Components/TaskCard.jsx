import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { usePriorityColors } from "../context/PriorityColorContext";
import { useCategories } from "../context/CategoriesContext";
import { format, parseISO } from "date-fns";
import { FaPencilAlt } from "react-icons/fa";
import { LuCalendarClock } from "react-icons/lu";
import { FaCircleCheck, FaArrowRightArrowLeft } from "react-icons/fa6";
import Modal from "./Modal";
import EditTaskForm from "./EditTaskForm";
import clsx from "clsx";
import PropTypes from "prop-types";

const TaskCard = ({ task, user, handleTaskUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: { ...task },
  });
  const { priorityColors } = usePriorityColors();
  const { categories } = useCategories();

  const formattedDueDate = task.dueDate
    ? format(
        typeof task.dueDate === "string"
          ? parseISO(task.dueDate)
          : task.dueDate,
        "MMM d"
      )
    : "No Due Date";

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "ps-4 my-6 rounded-md shadow-md",
        priorityColors[task.priority],
        task.priority
      )}
    >
      <div className="flex gap-2 w-full bg-zinc-100 dark:bg-zinc-900 p-4 border-2 dark:border-1 rounded-lg">
        <div className="w-full self-center">
          <h3 className="text-xl font-medium">
            {task.status == "completed" && (
              <FaCircleCheck className="inline me-2 -mt-1" />
            )}
            {task.title}
          </h3>
          <p className="my-2 text-zinc-600 dark:text-zinc-400">
            {task.description}
          </p>
          {task.dueDate && (
            <p className="flex gap-2 items-center font-light mt-2 shrink-0">
              <LuCalendarClock className="text-xl" /> {formattedDueDate}
            </p>
          )}
          {task.categories && (
            <ul className="mt-3 flex flex-wrap gap-3">
              {task.categories
                .map((cat) => categories.filter((c) => c.id === cat)) // Get all matching categories
                .flat() // Flatten array in case `filter` returns nested arrays
                .map((category) => (
                  <li
                    key={category.id}
                    className={`text-sm px-3 pt-1 pb-2 rounded-full ${category.color} category`}
                  >
                    {category.name}
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="opacity-60 hover:opacity-90">
            <button onClick={() => openModal()}>
              <FaPencilAlt /> <span className="sr-only">Edit Task</span>
            </button>
          </div>
          <div
            {...listeners}
            {...attributes}
            className="hidden lg:block text-2xl opacity-60 hover:opacity-90 cursor-grab"
          >
            <FaArrowRightArrowLeft />{" "}
            <span className="sr-only">
              Drag task to update status (to-do, current/in-progress, completed)
            </span>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <EditTaskForm
          task={task}
          user={user}
          closeModal={closeModal}
          handleTaskUpdate={handleTaskUpdate}
        />
      </Modal>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleTaskUpdate: PropTypes.func.isRequired,
};

export default TaskCard;

import { NavLink } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";

const TaskCard = ({ task }) => {
  return (
    <div className="block w-full bg-zinc-100 dark:bg-zinc-900 p-4 border-2 dark:border-1 rounded-lg relative">
      <div>
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
        <div className="absolute top-2 right-2 p-2 opacity-60 hover:opacity-90">
          <NavLink to={`/edit/${task.id}`}>
            <FaPencilAlt />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

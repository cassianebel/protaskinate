import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const Column = ({ id, title, tasks, text }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="h-full">
      <h2 className="text-2xl text-center m-4">{title}</h2>
      {tasks.length === 0 && <p className="text-center">{text}</p>}
      {title == "Completed Tasks" ? (
        <div className="opacity-50">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task} />)
      )}
    </div>
  );
};

export default Column;

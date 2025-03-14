import { useDroppable } from "@dnd-kit/core";
import { usePriorityColors } from "../context/PriorityColorContext";
import { FaCirclePlus, FaCircleCheck, FaRepeat } from "react-icons/fa6";
import clsx from "clsx";
import PropTypes from "prop-types";
import CalendarTask from "./CalendarTask";

const CalendarDay = ({ id, day, events, fetchDetails, handleEmptySlot }) => {
  const { setNodeRef } = useDroppable({ id });
  const { priorityColors } = usePriorityColors();
  return (
    <div
      key={day.date}
      ref={setNodeRef}
      className={`w-full min-h-28 rounded-md flex flex-col gap-1 ${
        !day.isCurrentMonth
          ? "bg-zinc-300 dark:bg-zinc-900"
          : "bg-zinc-100 dark:bg-zinc-800"
      }`}
    >
      <span className="block text-end mt-1 me-2">{day.date.getDate()}</span>
      {events
        .filter((event) => event.date.toString() == day.date.toString())
        .map((task) => (
          <CalendarTask key={task.id} task={task} fetchDetails={fetchDetails} />
        ))}
      <button
        onClick={() => handleEmptySlot(day.date)}
        className="grow w-full cursor-pointer pt-1 pb-2 group/item"
      >
        <span className="group/edit opacity-0 group-hover/item:opacity-100 duration-300 ease-in-out flex items-center justify-center gap-2">
          <FaCirclePlus />
          <span className="pb-1">add new task</span>
        </span>
      </button>
    </div>
  );
};

CalendarDay.propTypes = {
  id: PropTypes.string.isRequired,
  day: PropTypes.object.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchDetails: PropTypes.func.isRequired,
  handleEmptySlot: PropTypes.func.isRequired,
};

export default CalendarDay;

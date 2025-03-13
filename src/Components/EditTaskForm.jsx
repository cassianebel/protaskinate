import { useState, useEffect } from "react";
import { fetchTask, updateTask, deleteTask } from "../firestore";
import { usePriorityColors } from "../context/PriorityColorContext";
import { useCategories } from "../context/CategoriesContext";
import SignIn from "./SignIn";
import Input from "./Input";
import Button from "./Button";
import clsx from "clsx";
import PropTypes from "prop-types";

const EditTaskForm = ({ task, user, closeModal, handleTaskUpdate }) => {
  const [taskOwner, setTaskOwner] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [repeatNumber, setRepeatNumber] = useState("");
  const [repeatUnit, setRepeatUnit] = useState("never");
  const [repeatError, setRepeatError] = useState(null);
  const [taskPriority, setTaskPriority] = useState("low");
  const [taskCategories, setTaskCategories] = useState([]);
  const [taskStatus, setTaskStatus] = useState("to-do");
  const { priorityColors } = usePriorityColors();
  const { categories } = useCategories();

  useEffect(() => {
    if (user) {
      fetchTask(task.id)
        .then((task) => {
          if (task) {
            setTaskOwner(task.data().userId);
            setTaskTitle(task.data().title);
            setTaskDescription(task.data().description || "");
            setTaskDueDate(task.data().dueDate || "");
            setRepeatNumber(task.data().repeatNumber || "");
            setRepeatUnit(task.data().repeatUnit || "never");
            setTaskPriority(task.data().priority);
            setTaskCategories(task.data().categories || []);
            setTaskStatus(task.data().status);
          } else {
            console.error("Failed to fetch task.");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }, [user, task.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("You must be signed in to edit a task.");
      return;
    } else if (user.uid !== taskOwner) {
      console.error("You do not have permission to edit this task.");
      return;
    }

    if (repeatNumber > 0 && repeatUnit == "never") {
      setRepeatError("please choose a REPEAT UNIT");
      return;
    } else if (repeatUnit != "never" && repeatNumber < 1) {
      setRepeatError("please choose a REPEAT FREQUENCY");
      return;
      // } else if (
      //   repeatNumber > 0 &&
      //   repeatUnit != "never" &&
      //   taskDueDate == null
      // ) {
      //   setRepeatError("please choose a DUE DATE for repeating tasks");
      //   return;
    } else {
      setRepeatError(null);
    }

    const updatedTask = {
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate ? taskDueDate : null,
      repeatNumber: +repeatNumber,
      repeatUnit: repeatUnit,
      priority: taskPriority,
      categories: taskCategories,
      status: taskStatus,
      lastModifiedTimestamp: new Date(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const fetchedTask = await fetchTask(task.id);
    if (fetchedTask.data().status != "completed" && taskStatus == "completed") {
      updatedTask.completedTimestamp = new Date();
    }
    if (
      fetchedTask.data().status != "in-progress" &&
      taskStatus == "in-progress"
    ) {
      updatedTask.startedTimestamp = new Date();
    }

    await updateTask(task.id, updatedTask);
    console.log("Task updated successfully!");
    handleTaskUpdate(updatedTask);
    closeModal();
  };

  const handleDelete = async () => {
    if (!user) {
      console.error("You must be signed in to delete a task.");
      return;
    } else if (user.uid !== taskOwner) {
      console.error("You do not have permission to delete this task.");
      return;
    }

    await deleteTask(task.id);
    console.log("Task deleted successfully!");
    closeModal();
  };

  return (
    <>
      {!user ? (
        <SignIn />
      ) : (
        <div className="w-full lg:max-w-md mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative p-4 mx-3 bg-white dark:bg-zinc-900 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Task</h2>
            <Input
              type="text"
              label="Title"
              name="title"
              value={taskTitle}
              changeHandler={(e) => setTaskTitle(e.target.value)}
              required={true}
            />
            <label htmlFor="description" className="block mx-2 mb-1 font-light">
              Description
            </label>
            <textarea
              className="block w-full p-2 mb-6 border border-zinc-300 bg-zinc-100 rounded-md dark:border-zinc-700 dark:bg-zinc-800"
              type="text"
              id="description"
              label="Description"
              name="description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <Input
              type="date"
              label="Due Date"
              name="dueDate"
              value={taskDueDate}
              changeHandler={(e) => setTaskDueDate(e.target.value)}
            />
            {repeatError && (
              <p className="text-red-700 dark:text-red-400 font-medium text-center mx-2 my-4">
                {repeatError}
              </p>
            )}
            <fieldset>
              <legend className="text-lg ">
                Repeat{" "}
                <span className="text-sm">(based on completion date)</span>
              </legend>
              <div className="flex items-center gap-2">
                <div className="">
                  <label
                    htmlFor="repeatNumber"
                    className="block mx-2 mb-1 font-light"
                  >
                    Frequency
                  </label>
                  <input
                    type="number"
                    id="repeatNumber"
                    name="repeatNumber"
                    value={repeatNumber}
                    min="0"
                    onChange={(e) => setRepeatNumber(e.target.value)}
                    className="w-30 block p-2 mb-6 border border-zinc-300 bg-zinc-100 rounded-md dark:border-zinc-700 dark:bg-zinc-800"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="repeatUnit"
                    className="block mx-2 mb-1 font-light"
                  >
                    Every (Unit)
                  </label>
                  <select
                    id="repeatUnit"
                    name="repeatUnit"
                    value={repeatUnit}
                    onChange={(e) => setRepeatUnit(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 p-2 mb-6 rounded-md font-medium"
                  >
                    <option value="never">Never</option>
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                    <option value="month">Month(s)</option>
                  </select>
                </div>
              </div>
            </fieldset>
            <fieldset className="mb-6">
              <legend className="block mx-2 mb-1 font-light">
                Priority Level
              </legend>
              <div className="grid md:grid-cols-3 gap-2">
                <div>
                  <label
                    className={clsx(
                      "block p-2 scale-90 has-[:checked]:scale-100 transition-all duration-300 ease-in-out font-medium rounded-md low",
                      priorityColors["low"]
                    )}
                    htmlFor="low"
                  >
                    <input
                      type="radio"
                      id="low"
                      name="low"
                      value="low"
                      className="mx-2"
                      checked={taskPriority === "low"}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    />
                    Low
                  </label>
                </div>
                <div>
                  <label
                    className={clsx(
                      "block p-2 scale-90 has-[:checked]:scale-100 transition-all duration-300 ease-in-out font-medium rounded-md medium",
                      priorityColors["medium"]
                    )}
                    htmlFor="medium"
                  >
                    <input
                      type="radio"
                      id="medium"
                      name="medium"
                      value="medium"
                      className="mx-2"
                      checked={taskPriority === "medium"}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    />
                    Medium
                  </label>
                </div>
                <div>
                  <label
                    className={clsx(
                      "block p-2 scale-90 has-[:checked]:scale-100 transition-all duration-300 ease-in-out font-medium rounded-md high text-white",
                      priorityColors["high"]
                    )}
                    htmlFor="high"
                  >
                    <input
                      type="radio"
                      id="high"
                      name="high"
                      value="high"
                      className="mx-2"
                      checked={taskPriority === "high"}
                      onChange={(e) => setTaskPriority(e.target.value)}
                    />
                    High
                  </label>
                </div>
              </div>
            </fieldset>

            {categories.length > 0 && (
              <fieldset className="mb-6">
                <legend className="block mx-2 mb-1 font-light">
                  Categories
                </legend>
                <div className="flex flex-wrap gap-4 ms-2">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <label
                        className={clsx(
                          "block pt-1 pb-2 ps-3 pe-4 opacity-50 has-[:checked]:opacity-100 transition-all duration-300 ease-in-out font-medium rounded-full category",
                          cat.color
                        )}
                        htmlFor={cat.name}
                      >
                        <input
                          type="checkbox"
                          id={cat.name}
                          name={cat.name}
                          value={cat.name}
                          className="me-2"
                          checked={taskCategories.includes(cat.name)}
                          onChange={() =>
                            setTaskCategories((prev) =>
                              prev.includes(cat.name)
                                ? prev.filter((c) => c !== cat.name)
                                : [...prev, cat.name]
                            )
                          }
                        />
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            )}
            <fieldset className="mb-6">
              <legend className="block mx-2 mb-1 font-light">Status</legend>
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label className="font-medium" htmlFor="to-do">
                    <input
                      type="radio"
                      id="to-do"
                      name="to-do"
                      value="to-do"
                      className="mx-2"
                      checked={taskStatus === "to-do"}
                      onChange={(e) => setTaskStatus(e.target.value)}
                    />
                    To-Do
                  </label>
                </div>
                <div>
                  <label className="font-medium" htmlFor="in-progress">
                    <input
                      type="radio"
                      id="in-progress"
                      name="in-progress"
                      value="in-progress"
                      className="mx-2"
                      checked={taskStatus === "in-progress"}
                      onChange={(e) => setTaskStatus(e.target.value)}
                    />
                    In-Progress
                  </label>
                </div>
                <div>
                  <label className="font-medium" htmlFor="completed">
                    <input
                      type="radio"
                      id="completed"
                      name="completed"
                      value="completed"
                      className="mx-2"
                      checked={taskStatus === "completed"}
                      onChange={(e) => setTaskStatus(e.target.value)}
                    />
                    Completed
                  </label>
                </div>
              </div>
            </fieldset>
            <Button type="submit" style="primary" text="Update Task" />
            <div className="flex gap-4 mt-4">
              <Button
                text="Cancel"
                action={() => closeModal()}
                style="secondary"
              />
              <Button text="Delete" action={handleDelete} style="danger" />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

EditTaskForm.propTypes = {
  user: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleTaskUpdate: PropTypes.func.isRequired,
};

export default EditTaskForm;

import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { createTask } from "../firestore";
import { usePriorityColors } from "../context/PriorityColorContext";
import { useCategories } from "../context/CategoriesContext";
import SignIn from "./SignIn";
import Input from "./Input";
import Button from "./Button";
import clsx from "clsx";
import PropTypes from "prop-types";

const CreateTaskForm = ({ user, date, closeModal }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(
    date ? date.toISOString().split("T")[0] : null
  );
  const [taskPriority, setTaskPriority] = useState("low");
  const [taskStatus, setTaskStatus] = useState("to-do");
  const [taskCategories, setTaskCategories] = useState([]);
  const navigate = useNavigate();
  const { priorityColors } = usePriorityColors();
  const { categories } = useCategories();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate ? taskDueDate : null,
      priority: taskPriority,
      categories: taskCategories,
      status: taskStatus,
      userId: user.uid,
      createdTimestamp: new Date(),
      lastModifiedTimestamp: new Date(),
    };

    if (taskStatus === "completed") {
      newTask.startedTimestamp = new Date();
      newTask.completedTimestamp = new Date();
    }
    if (taskStatus === "in-progress") {
      newTask.startedTimestamp = new Date();
    }

    createTask(newTask)
      .then((docId) => {
        if (docId) {
          // Reset form fields
          setTaskTitle("");
          setTaskDescription("");
          setTaskDueDate("");
          setTaskPriority("low");
          setTaskCategories([]);
          setTaskStatus("to-do");
          closeModal ? closeModal() : navigate("/");
        } else {
          console.error("Failed to add task.");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
    <>
      {!user ? (
        <SignIn />
      ) : (
        <div className="w-full max-w-md mx-auto">
          <form
            onSubmit={handleSubmit}
            className="p-4 mx-3 bg-white dark:bg-zinc-900 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Create a New Task
            </h2>
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
            <fieldset className="mb-6">
              <legend className="block mx-2 mb-1 font-light">
                Priority Level
              </legend>
              <div className="grid md:grid-cols-3 gap-2">
                <div>
                  <label
                    className={clsx(
                      "block p-2 mx-2 scale-90 has-[:checked]:scale-100 transition-all duration-300 ease-in-out font-medium rounded-md low",
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
                      "block p-2 mx-2 scale-90 has-[:checked]:scale-100 transition-all duration-300 ease-in-out font-medium rounded-md medium",
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
                      "block p-2 mx-2 scale-90 has-[:checked]:scale-100 transition-all duration-300 ease-in-out font-medium rounded-md high text-white",
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
            <Button type="submit" style="primary" text="Create Task" />
          </form>
        </div>
      )}
    </>
  );
};

CreateTaskForm.propTypes = {
  user: PropTypes.object.isRequired,
  date: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
};

export default CreateTaskForm;

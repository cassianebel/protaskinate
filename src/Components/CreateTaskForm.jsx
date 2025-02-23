import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { createTask } from "../firestore";

const CreateTaskForm = ({ user }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("low");
  const [taskStatus, setTaskStatus] = useState("to-do");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      title: taskTitle,
      description: taskDescription,
      dueDate: taskDueDate ? taskDueDate : null,
      priority: taskPriority,
      status: taskStatus,
      userId: user.uid,
      createdTimestamp: new Date(),
      lastModifiedTimestamp: new Date(),
    };

    createTask(newTask)
      .then((docId) => {
        if (docId) {
          // Reset form fields
          setTaskTitle("");
          setTaskDescription("");
          setTaskDueDate("");
          setTaskPriority("low");
          setTaskStatus("to-do");
          //redirect to home page
          navigate(`/`);
        } else {
          console.error("Failed to add task.");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  return (
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
          <legend className="block mx-2 mb-1 font-light">Priority Level</legend>
          <div className="grid grid-cols-3 ">
            <div>
              <label
                className="bg-yellow-200 dark:bg-yellow-500 dark:text-zinc-950 block p-2 mx-2 scale-90 has-[:checked]:scale-110 transition-all duration-300 ease-in-out font-medium rounded-md"
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
                className="bg-orange-300 dark:bg-orange-700 dark:text-white  block p-2 mx-2 scale-90 has-[:checked]:scale-110 transition-all duration-300 ease-in-out font-medium rounded-md"
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
                className="bg-red-400 dark:bg-red-700 dark:text-zinc-50  block p-2 mx-2 scale-90 has-[:checked]:scale-110 transition-all duration-300 ease-in-out font-medium rounded-md"
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
        <fieldset className="mb-6">
          <legend className="block mx-2 mb-1 font-light">Status</legend>
          <div className="flex gap-4 ms-4">
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
  );
};

export default CreateTaskForm;

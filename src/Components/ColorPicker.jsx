import { useEffect } from "react";
import { usePriorityColors } from "./PriorityColorContext";
import { fetchUserFromDatabase, updateUserInDatabase } from "../firestore";
import Button from "./Button";
import clsx from "clsx";

function ColorPicker({ user }) {
  const { priorityColors, setPriorityColors } = usePriorityColors();
  const priorityOrder = ["low", "medium", "high"];
  const colorChoices = [
    "yellow",
    "orange",
    "red",
    "fuchsia",
    "purple",
    "blue",
    "teal",
    "green",
    "lime",
  ];

  useEffect(() => {
    if (user) {
      fetchUserFromDatabase(user)
        .then((userData) => {
          if (userData && userData.priorityColors) {
            setPriorityColors(userData.priorityColors);
          }
          console.log("User data fetched successfully:", userData);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }, [user]);

  const handleColorChange = (priority, color) => {
    setPriorityColors((prevColors) => ({
      ...prevColors,
      [priority]: color,
    }));
  };

  const submitColorChange = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await updateUserInDatabase(user, { priorityColors });
        console.log("Priority colors updated successfully");
      } catch (error) {
        console.error("Error updating priority colors:", error);
      }
    }
  };

  return (
    <form onSubmit={submitColorChange}>
      {priorityOrder.map((priority) => (
        <div
          key={priority}
          className={clsx(
            "ps-4 my-6 rounded-md shadow-md",
            priorityColors[priority],
            priority
          )}
        >
          <div className="flex gap-2 justify-between w-full bg-zinc-100 dark:bg-zinc-900 p-4 border-2 dark:border-1 rounded-lg">
            <label className="font-light" htmlFor={`${priority}PriorityColor`}>
              {priority}:
            </label>
            <select
              id={`${priority}PriorityColor`}
              name={`${priority}PriorityColor`}
              onChange={(e) => handleColorChange(priority, e.target.value)}
              value={priorityColors[priority]}
            >
              {colorChoices.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <Button type="submit" text="Save Color Choices" style="primary" />
    </form>
  );
}

export default ColorPicker;

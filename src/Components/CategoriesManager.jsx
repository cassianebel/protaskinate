import { useState } from "react";
import { useCategories } from "../context/CategoriesContext";
import Input from "./Input";
import Button from "./Button";
import { MdDeleteForever } from "react-icons/md";
import { set } from "date-fns";

const CategoriesManager = () => {
  const { categories, addNewCategory, deleteThisCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("yellow");
  const [saving, setSaving] = useState(false);
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

  const handleAddNewCategory = (name, color) => {
    if (name.trim() === "") {
      alert("Category name cannot be empty");
      return;
    }
    setSaving(true);
    addNewCategory(name, color);
    setTimeout(() => {
      setNewCategoryName("");
      setNewCategoryColor("");
      setSaving(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
      <ul className="flex flex-col gap-4 my-4">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={`flex items-center justify-between gap-4 px-3 pt-1 pb-2 rounded-full ${cat.color} category`}
          >
            <span>{cat.name}</span>
            <button
              onClick={() => deleteThisCategory(cat.id)}
              className="text-xl cursor-pointer"
            >
              <MdDeleteForever />
            </button>
          </li>
        ))}
      </ul>
      <div>
        <Input
          label="New Category Name"
          name="name"
          type="text"
          value={newCategoryName}
          changeHandler={(e) => setNewCategoryName(e.target.value)}
          required="true"
        />
        <div className="mt-[-10px] mb-4">
          <label className="font-light ms-2" htmlFor="color">
            New Category Color
          </label>
          <select
            id="color"
            name="color"
            onChange={(e) => setNewCategoryColor(e.target.value)}
            value={newCategoryColor}
            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 p-2 rounded-sm font-medium ms-4"
          >
            {colorChoices.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>
        <Button
          action={() => handleAddNewCategory(newCategoryName, newCategoryColor)}
          text={saving ? "Saving..." : "Add New Category"}
          disabled={saving}
          type="submit"
          style="primary"
        />
      </div>
    </div>
  );
};

export default CategoriesManager;

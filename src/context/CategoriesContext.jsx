import { createContext, useState, useEffect, useContext } from "react";
import { fetchCategories, addCategory, deleteCategory } from "../firestore";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ user, children }) => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Work", color: "blue" },
    { id: 2, name: "Personal", color: "red" },
    { id: 3, name: "Errands", color: "orange" },
  ]);

  useEffect(() => {
    if (user) {
      fetchCategories(user.uid)
        .then((userData) => {
          if (userData) {
            setCategories(userData);
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }, [user]);

  const addNewCategory = (name, color) => {
    if (user) {
      addCategory(user.uid, name, color)
        .then((docId) => {
          if (!docId) {
            console.warn(
              "No document ID returned. Category might already exist."
            );
            return;
          }
          console.log("Document written with ID:", docId);
          setCategories((prev) => [...prev, { id: docId, name, color }]);
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  };

  const deleteThisCategory = (id) => {
    if (user) {
      deleteCategory(user.uid, id)
        .then(() => {
          console.log("Category deleted successfully");
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <CategoriesContext.Provider
      value={{ categories, addNewCategory, deleteThisCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

// Custom hook to use the Categories Context
export const useCategories = () => useContext(CategoriesContext);

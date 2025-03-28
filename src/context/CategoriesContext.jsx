import { createContext, useState, useEffect, useContext } from "react";
import { addCategory, deleteCategory } from "../firestore";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import PropTypes from "prop-types";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ user, children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user) return;

    const categoriesRef = collection(db, "users", user.uid, "categories");

    const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
      const updatedCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(updatedCategories);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
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
  };

  return (
    <CategoriesContext.Provider
      value={{ categories, addNewCategory, deleteThisCategory }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

CategoriesProvider.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

// Custom hook to use the Categories Context
export const useCategories = () => useContext(CategoriesContext);

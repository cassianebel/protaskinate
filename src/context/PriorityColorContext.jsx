import { createContext, useContext, useState, useEffect } from "react";
import { fetchUserFromDatabase } from "../firestore";

const PriorityColorContext = createContext();

export function PriorityColorProvider({ user, children }) {
  const [priorityColors, setPriorityColors] = useState({
    low: "purple",
    medium: "purple",
    high: "purple",
  });

  useEffect(() => {
    if (user) {
      fetchUserFromDatabase(user)
        .then((userData) => {
          if (userData && userData.priorityColors) {
            setPriorityColors(userData.priorityColors);
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }, [user]);

  const updatePriorityColor = (priority, color) => {
    setPriorityColors((prev) => ({ ...prev, [priority]: color }));
  };

  return (
    <PriorityColorContext.Provider
      value={{ priorityColors, setPriorityColors }}
    >
      {children}
    </PriorityColorContext.Provider>
  );
}

export function usePriorityColors() {
  return useContext(PriorityColorContext);
}

import { createContext, useContext, useState, useEffect } from "react";
import { fetchUserFromDatabase } from "../firestore";
import PropTypes from "prop-types";

const PriorityColorContext = createContext();

export function PriorityColorProvider({ user, children }) {
  const [priorityColors, setPriorityColors] = useState({});

  useEffect(() => {
    if (user) {
      fetchUserFromDatabase(user)
        .then((userData) => {
          if (userData && userData.priorityColors) {
            setPriorityColors(userData.priorityColors);
          } else {
            setPriorityColors({
              low: "purple",
              medium: "purple",
              high: "purple",
            });
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

PriorityColorProvider.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export function usePriorityColors() {
  return useContext(PriorityColorContext);
}

import { createContext, useContext, useState } from "react";

const PriorityColorContext = createContext();

export function PriorityColorProvider({ children }) {
  const [priorityColors, setPriorityColors] = useState({
    low: "purple",
    medium: "purple",
    high: "purple",
  });

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

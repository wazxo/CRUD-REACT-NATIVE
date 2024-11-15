import React, { createContext, useState, useContext } from "react";

const StateContext = createContext();

export const useStateContext = () => useContext(StateContext);

export const StateProvider = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <StateContext.Provider value={{ selectedEvent, setSelectedEvent }}>
      {children}
    </StateContext.Provider>
  );
};

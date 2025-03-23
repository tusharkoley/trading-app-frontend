import React, { createContext, useState, useContext } from "react";

// Create a Context object

const DarkModeContext = createContext();

// Create a custom hook to use the context
function useDarkMode() {
  return useContext(DarkModeContext);
}

// Create the DarkModeProvider component
function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Initial state: light mode

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeProvider, useDarkMode };

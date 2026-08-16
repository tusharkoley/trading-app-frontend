import React, { createContext, useState, useContext, useEffect } from "react";

// Create a Context object

const DarkModeContext = createContext();

// Create a custom hook to use the context
function useDarkMode() {
  return useContext(DarkModeContext);
}

// Create the DarkModeProvider component
function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("tradezen-theme");
      return savedTheme === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.setAttribute("data-bs-theme", "dark");
    } else {
      htmlElement.removeAttribute("data-bs-theme");
    }

    try {
      localStorage.setItem("tradezen-theme", isDarkMode ? "dark" : "light");
    } catch {
      // Ignore storage write failures in restricted environments.
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeProvider, useDarkMode };

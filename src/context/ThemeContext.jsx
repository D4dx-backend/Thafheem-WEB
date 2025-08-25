import { createContext, useContext, useState, useEffect } from "react";

// Create context
const ThemeContext = createContext();

// Custom hook
export const useTheme = () => useContext(ThemeContext);

// Provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Always prefer saved theme if available
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Apply theme changes to document (ignore system/Chrome preference)
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    console.log("Theme switched to:", theme);
  }, [theme]);

  // Toggle theme manually (button only)
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/* ThemeContext */
// TODO: Talvez refatorar o nome do file já que altera tanto tema quanto fonte para algo mais adequado

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || "light");
  const [textSize, setTextSize] = useState("medium");

  useEffect(() => {
    // Load saved theme from storage
    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        const savedTextSize = await AsyncStorage.getItem("textSize");
        if (savedTheme) setTheme(savedTheme);
        if (savedTextSize) setTextSize(savedTextSize);
      } catch (error) {
        console.log("Error loading theme/textSize:", error);
      }
    };
    getTheme();
  }, []);

  useEffect(() => {
    // set theme to system selected theme
    if (colorScheme) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  const toggleTheme = async (newTheme) => {
    const themeToSet = newTheme === "system" ? colorScheme : newTheme;
    setTheme(themeToSet);
    await AsyncStorage.setItem("theme", themeToSet);
  };

  const toggleTextSize = async (size) => {
    setTextSize(size);
    await AsyncStorage.setItem("textSize", size);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, textSize, toggleTextSize }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;

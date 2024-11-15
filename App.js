import React from "react";
import { StatusBar } from "expo-status-bar";
import Navigation from "./navigation/navigation"; // Asegúrate de que el nombre del archivo sea correcto

// Tema oscuro global
const darkTheme = {
  background: "#121212",
  text: "#fff",
  tabBar: "#1f1f1f",
  tabBarIcon: "#fff",
  stackHeader: "#1f1f1f",
  stackHeaderText: "#fff",
  stackBackground: "#121212",
};

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Navigation theme={darkTheme} />
    </>
  );
}

import * as React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/homeScreen";
import AboutScreen from "../screens/aboutScreen";
import EventDetails from "../screens/EventDetails";
import RecordAudio from "../screens/RecordAudio";
import Lista from "../screens/lista";
import { FontAwesome } from "@expo/vector-icons"; // Íconos
import { StateProvider } from "../context/StateContext"; // Importamos el provider

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#121212",
    card: "#1f1f1f",
    text: "#fff",
    border: "#1f1f1f",
    notification: "#ff6f61",
  },
};

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1f1f1f" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{ title: "Descripción de eventos" }}
      />
      <Stack.Screen name="RecordAudio" component={RecordAudio} />
    </Stack.Navigator>
  );
}

function ListaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1f1f1f" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="Lista" component={Lista} />
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{ title: "Descripción de eventos" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <StateProvider>
      <NavigationContainer theme={darkTheme}>
        <Tab.Navigator
          initialRouteName="Registro de Emergencias"
          screenOptions={{
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#888",
            tabBarStyle: { backgroundColor: "#1f1f1f" },
          }}
        >
          <Tab.Screen
            name="Registro de Emergencias"
            component={HomeStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="home" size={size} color={color} />
              ),
              tabBarLabel: "Inicio",
            }}
          />
          <Tab.Screen
            name="Lista de Eventos"
            component={ListaStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="list" size={size} color={color} />
              ),
              tabBarLabel: "Eventos",
            }}
          />
          <Tab.Screen
            name="Acerca de mí"
            component={AboutScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="user-secret" size={size} color={color} />
              ),
              tabBarLabel: "Perfil",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </StateProvider>
  );
}

import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Necesario para los íconos

const ProfileScreen = () => {
  const name = "Johelin Pascual Perez Valdez";
  const matricula = "2022-1131";
  const email = "johelinperez@gmail.com";
  const githubURL = "https://github.com/wazxo";

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleGitHubPress = () => {
    Linking.openURL(githubURL);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#121212" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/foto2x2.jpg")} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.info}>
          <Text style={styles.boldText}>Matrícula: </Text>
          {matricula}
        </Text>

        <Section title="Sobre mí">
          <Text style={styles.description}>
            Soy un estudiante de desarrollo de software en el ITLA, enfocado en
            crear soluciones innovadoras con tecnologías modernas. Me
            especializo en desarrollo de aplicaciones móviles con React Native y
            JavaScript, además tengo conocimientos básicos de SQL y algo de C#.
          </Text>
        </Section>

        <Section title="Habilidades Técnicas">
          <Text style={styles.skills}>
            - React Native{"\n"}- JavaScript{"\n"}- SQL (básico){"\n"}- C#
            (básico){"\n"}
          </Text>
        </Section>

        <Section title="Redes Sociales">
          <View style={styles.socials}>
            <TouchableOpacity onPress={handleGitHubPress}>
              <FontAwesome
                name="github"
                size={30}
                color="#333333" // Cambiado a gris oscuro
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </Section>

        <TouchableOpacity style={styles.button} onPress={handleEmailPress}>
          <Text style={styles.buttonText}>Contáctame</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Fondo oscuro para el modo oscuro
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#FF6F61",
    marginBottom: 20,
    marginTop: 50,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6F61", // Manteniendo el color principal
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: "#FFFFFF", // Texto en blanco
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 22,
    color: "#FFFFFF", // Texto en blanco para los títulos de sección
    marginBottom: 10,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#CCCCCC", // Texto gris claro para la descripción
    textAlign: "center",
    paddingHorizontal: 10,
  },
  skills: {
    fontSize: 16,
    color: "#CCCCCC", // Texto gris claro para las habilidades
    textAlign: "left",
  },
  socials: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#FF6F61", // Color del botón
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF", // Texto del botón en blanco
    fontSize: 18,
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
    color: "#FFFFFF", // Texto en blanco para los textos en negrita
  },
});

export default ProfileScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";

const EventDetails = ({ route, navigation }) => {
  const { event } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sound, setSound] = useState(null);

  const playAudio = async (uri) => {
    if (uri) {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      await sound.playAsync();
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.detailsTitle}>{event.title}</Text>
      {event.photo ? (
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Image
            source={{ uri: event.photo }}
            style={styles.eventImagePreview}
          />
        </TouchableOpacity>
      ) : (
        <Text style={styles.noImageText}>No hay imagen disponible</Text>
      )}
      <Text style={styles.eventDetails}>Descripción: {event.description}</Text>
      <Text style={styles.eventDetails}>Fecha: {event.date}</Text>
      {event.audioURI && (
        <TouchableOpacity
          style={styles.audioButton}
          onPress={() => playAudio(event.audioURI)}
        >
          <Icon name="play-arrow" size={30} color="#fff" />
          <Text style={styles.audioButtonText}>Reproducir Audio</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.closeModalButtonText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: event.photo }} style={styles.fullScreenImage} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 20,
  },
  eventImagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: "cover",
  },
  noImageText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  eventDetails: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  audioButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeModalButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#FF6F61",
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
  },
  closeModalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EventDetails;

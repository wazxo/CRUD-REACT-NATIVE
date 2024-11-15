import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import Icon from "react-native-vector-icons/MaterialIcons";

// Abrir la base de datos
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("events1.db", {
      useNewConnection: true,
    });
    return db;
  } catch (error) {
    console.error("Error opening database: ", error);
  }
};

const Lista = ({ navigation }) => {
  const [db, setDb] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [deleteEnabled, setDeleteEnabled] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await openDatabase();
      if (database) {
        setDb(database);
        fetchEvents(database);
      }
    };
    initializeDatabase();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (db) {
        fetchEvents(db);
      }
    }, [db])
  );

  const fetchEvents = useCallback(async (database) => {
    try {
      const allRows = await database.getAllAsync("SELECT * FROM events");
      setEvents(allRows);
      setFilteredEvents(allRows);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.description.toLowerCase().includes(query.toLowerCase()) ||
          event.date.includes(query)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  };

  useEffect(() => {
    let timer;
    if (modalVisible && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setDeleteEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [modalVisible, countdown]);

  const handleDeleteAll = async () => {
    if (db) {
      try {
        await db.runAsync("DELETE FROM events");
        fetchEvents(db);
        setModalVisible(false);
        setCountdown(5);
        setDeleteEnabled(false);
      } catch (error) {
        console.error("Error deleting all events: ", error);
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setCountdown(5);
    setDeleteEnabled(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("EventDetails", { event: item })}
    >
      <View style={styles.eventItem}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar eventos"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.deleteButtonText}>Eliminar Todo</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Advertencia: Esto eliminará todos los datos. Esta acción no se
              puede deshacer.
            </Text>
            <Text style={styles.modalText}>
              La eliminación se habilitará en {countdown} segundos.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title="Eliminar Todo"
                onPress={handleDeleteAll}
                disabled={!deleteEnabled}
                color="#FF6F61"
              />
              <Button title="Cancelar" onPress={handleCancel} color="#888" />
            </View>
          </View>
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#1f1f1f",
    color: "#fff",
  },
  eventItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  eventDate: {
    fontSize: 14,
    color: "#888",
  },
  deleteButton: {
    backgroundColor: "#FF6F61",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default Lista;

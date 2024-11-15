import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
} from "react-native";
import * as SQLite from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";

// Abrir la base de datos
const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("events1.db", {
      useNewConnection: true,
    });
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        date TEXT,
        photo TEXT,
        audioURI TEXT
      );
    `);
    return db;
  } catch (error) {
    console.error("Error opening database: ", error);
  }
};

const HomeScreen = ({ navigation, route }) => {
  const [db, setDb] = useState(null);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState(route.params?.title || "");
  const [description, setDescription] = useState(
    route.params?.description || ""
  );
  const [date, setDate] = useState(
    route.params?.date ? new Date(route.params.date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photo, setPhoto] = useState(route.params?.photo || null);
  const [audioURI, setAudioURI] = useState(route.params?.audioURI || null);
  const [audioDuration, setAudioDuration] = useState(null);
  const [editingEventId, setEditingEventId] = useState(
    route.params?.editingEventId || null
  );

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

  useEffect(() => {
    if (route.params?.audioURI) {
      setAudioURI(route.params.audioURI);
      getAudioDuration(route.params.audioURI);
    }
  }, [route.params?.audioURI]);

  const fetchEvents = useCallback(async (database) => {
    try {
      const allRows = await database.getAllAsync(
        "SELECT * FROM events ORDER BY id DESC LIMIT 5"
      );
      setEvents(allRows);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  }, []);

  const selectPhoto = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }, []);

  const getAudioDuration = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      const status = await sound.getStatusAsync();
      setAudioDuration(status.durationMillis);
      await sound.unloadAsync();
    } catch (error) {
      console.error("Error getting audio duration: ", error);
    }
  };

  const handleSubmit = async () => {
    if (db) {
      try {
        const formattedDate = date.toISOString().split("T")[0]; // Solo la fecha
        if (editingEventId) {
          await db.runAsync(
            "UPDATE events SET title = ?, description = ?, date = ?, photo = ?, audioURI = ? WHERE id = ?",
            [title, description, formattedDate, photo, audioURI, editingEventId]
          );
        } else {
          await db.runAsync(
            "INSERT INTO events (title, description, date, photo, audioURI) VALUES (?, ?, ?, ?, ?)",
            [title, description, formattedDate, photo, audioURI]
          );
        }
        fetchEvents(db);
        resetForm();
      } catch (error) {
        console.error("Error saving event: ", error);
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setPhoto(null);
    setAudioURI(null);
    setAudioDuration(null);
    setEditingEventId(null);
  };

  const handleDelete = async (id) => {
    if (db) {
      try {
        await db.runAsync("DELETE FROM events WHERE id = ?", [id]);
        fetchEvents(db);
      } catch (error) {
        console.error("Error deleting event: ", error);
      }
    }
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setDate(new Date(event.date));
    setPhoto(event.photo);
    setAudioURI(event.audioURI);
    setEditingEventId(event.id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EventDetails", { event: item })}
      >
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
      </TouchableOpacity>
      <View style={styles.eventActions}>
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={[styles.iconButton, styles.iconButtonMargin]}
        >
          <Icon name="edit" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.iconButton}
        >
          <Icon name="delete" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título del evento"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.iconButton}
        >
          <Icon name="calendar-today" size={30} color="#fff" />
          <Text style={styles.iconButtonText}>Seleccionar Fecha</Text>
        </TouchableOpacity>
        <Text style={styles.selectedDate}>
          {date.toISOString().split("T")[0]}
        </Text>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          themeVariant="dark"
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              const currentDate = new Date(
                selectedDate.getTime() +
                  selectedDate.getTimezoneOffset() * 60000
              );
              setShowDatePicker(Platform.OS === "ios");
              setDate(currentDate);
            }
          }}
        />
      )}
      <TouchableOpacity onPress={selectPhoto} style={styles.iconButton}>
        <Icon name="photo" size={30} color="#fff" />
        <Text style={styles.iconButtonText}>Seleccionar Foto</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={styles.previewPhoto} />}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("RecordAudio", {
            title,
            description,
            date: date.toISOString(),
            photo,
            audioURI,
            editingEventId,
          })
        }
        style={styles.iconButton}
      >
        <Icon name="audiotrack" size={30} color="#fff" />
        <Text style={styles.iconButtonText}>Agregar Audio</Text>
      </TouchableOpacity>
      {audioURI && (
        <>
          <Text style={styles.audioDuration}>
            Duración del audio:{" "}
            {audioDuration
              ? `${Math.floor(audioDuration / 60000)}:${Math.floor(
                  (audioDuration % 60000) / 1000
                )
                  .toString()
                  .padStart(2, "0")}`
              : "Cargando..."}
          </Text>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={editingEventId ? "Actualizar Evento" : "Agregar Evento"}
          onPress={handleSubmit}
          color="#FF6F61"
        />
        <Button title="Cancelar" onPress={resetForm} color="#888" />
      </View>

      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#1f1f1f",
    color: "#fff",
  },
  previewPhoto: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
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
  eventActions: {
    flexDirection: "row",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  iconButtonMargin: {
    marginRight: 10,
  },
  iconButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  audioDuration: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  selectedDate: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatList: {
    marginTop: 20,
  },
});

export default HomeScreen;

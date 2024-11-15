import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";

const RecordAudio = ({ navigation, route }) => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordTime, setRecordTime] = useState("00:00:00.000");
  const [audioPath, setAudioPath] = useState(route.params?.audioURI || null);

  const recordingOptions = {
    android: {
      extension: ".m4a",
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: ".caf",
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const onStartRecord = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setAudioPath(recording.getURI());
      recording.setOnRecordingStatusUpdate((status) => {
        setRecordTime(
          new Date(status.durationMillis).toISOString().substr(11, 12)
        );
      });
    } catch (err) {
      console.error("Error al iniciar grabación:", err);
    }
  };

  const onStopRecord = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
    } catch (err) {
      console.error("Error al detener grabación:", err);
    }
  };

  const onDeleteRecord = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      if (audioPath) {
        await FileSystem.deleteAsync(audioPath);
        setAudioPath(null);
        setRecordTime("00:00:00.000");
      }
    } catch (err) {
      console.error("Error al eliminar grabación:", err);
    }
  };

  const onPlayRecord = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioPath });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error("Error al reproducir grabación:", err);
    }
  };

  const onStopPlay = async () => {
    try {
      await sound.stopAsync();
      setSound(null);
    } catch (err) {
      console.error("Error al detener reproducción:", err);
    }
  };

  const onSaveRecord = async () => {
    if (recording) {
      await onStopRecord();
    }
    // Send the audio URI back to the home screen
    navigation.navigate("Home", {
      audioURI: audioPath,
      title: route.params?.title,
      description: route.params?.description,
      date: route.params?.date,
      photo: route.params?.photo,
      editingEventId: route.params?.editingEventId,
    });
  };

  useEffect(() => {
    return () => {
      if (recording) {
        onStopRecord();
      }
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, [recording, sound]);

  return (
    <ImageBackground
      source={require("../assets/spy-background.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.recordTime}>
          Duración de la grabación: {recordTime}
        </Text>
        <Text style={styles.title}>Agente de Grabación</Text>
        <TouchableOpacity
          onPress={onStartRecord}
          disabled={recording !== null}
          style={[styles.button, recording !== null && styles.buttonDisabled]}
        >
          <Icon name="mic" size={30} color="#fff" />
          <Text style={styles.buttonText}>Iniciar grabación</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onStopRecord}
          disabled={recording === null}
          style={[styles.button, recording === null && styles.buttonDisabled]}
        >
          <Icon name="stop" size={30} color="#fff" />
          <Text style={styles.buttonText}>Detener grabación</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDeleteRecord}
          disabled={!audioPath}
          style={[styles.button, !audioPath && styles.buttonDisabled]}
        >
          <Icon name="delete" size={30} color="#fff" />
          <Text style={styles.buttonText}>Eliminar grabación</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPlayRecord}
          disabled={!audioPath || recording !== null}
          style={[
            styles.button,
            (!audioPath || recording !== null) && styles.buttonDisabled,
          ]}
        >
          <Icon name="play-arrow" size={30} color="#fff" />
          <Text style={styles.buttonText}>Reproducir grabación</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onStopPlay}
          disabled={!audioPath || !sound}
          style={[
            styles.button,
            (!audioPath || !sound) && styles.buttonDisabled,
          ]}
        >
          <Icon name="stop" size={30} color="#fff" />
          <Text style={styles.buttonText}>Detener reproducción</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSaveRecord}
          disabled={!audioPath}
          style={[styles.button, !audioPath && styles.buttonDisabled]}
        >
          <Icon name="save" size={30} color="#fff" />
          <Text style={styles.buttonText}>Guardar grabación</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6F61",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  recordTime: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontWeight: "bold",
  },
});

export default RecordAudio;

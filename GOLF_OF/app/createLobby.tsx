import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export default function CreateLobbyScreen() {
  const hasAccount = true;
  const [lobbyCode, setLobbyCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = () => {
    if (!lobbyCode.trim()) {
      setError("Please enter a lobby code.");
      return;
    }
    setError("");
    alert(`Entering lobby: ${lobbyCode}`);
  };

  const handleCreate = () => {
    alert("Creating party...");
  };

  return (
    <View style={styles.bg}>
      <ImageBackground
        source={require("../assets/images/GolfBG.gif")}
        style={styles.imageBg}
        resizeMode="cover"
      >
        <View style={styles.overlay} pointerEvents="none" />
        <View style={styles.cardContainer} pointerEvents="box-none">
          <View style={styles.card}>
            <Text style={styles.title}>Golfin' Lobby</Text>
            <Text style={styles.subtitle}>Join or create a party!</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Join Party!</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter code"
                placeholderTextColor="#888"
                value={lobbyCode}
                onChangeText={setLobbyCode}
                maxLength={8}
                autoCapitalize="characters"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
                <Text style={styles.btnText}>Join</Text>
              </TouchableOpacity>
            </View>
            {hasAccount && (
              <>
                <View style={styles.sectionDivider} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Don't have a code?</Text>
                  <TouchableOpacity
                    style={styles.createBtn}
                    onPress={handleCreate}
                  >
                    <Text style={styles.btnText}>Create party</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    position: "relative",
  },
  imageBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  card: {
    backgroundColor: "rgba(40,120,57,0.95)",
    borderRadius: 24,
    padding: 32,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgb(122, 199, 12)",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "rgb(251, 245, 201)",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "rgb(251, 245, 201)",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f0fff4",
    color: "#000000 ",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    width: "100%",
    borderWidth: 2,
    borderColor: "rgb(122, 199, 12)",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 2,
  },
  joinBtn: {
    backgroundColor: "rgb(142, 224, 0)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 4,
    width: "100%",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgb(122, 199, 12)",
  },
  createBtn: {
    backgroundColor: "rgb(229, 56, 56)",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 4,
    width: "100%",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgb(211, 49, 49)",
  },
  btnText: {
    color: "#181818",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "rgb(122, 199, 12)",
    width: "100%",
    marginVertical: 16,
    opacity: 0.3,
    borderRadius: 1,
  },
  error: {
    color: "#ff5252",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0, 0, 0, 0.16)",x
    zIndex: 1,
  },
});
